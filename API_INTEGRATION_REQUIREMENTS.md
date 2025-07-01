# TM Forum API Integration & Linking Requirements

## Overview
Yes, there are **critical links** between the TM Forum APIs that need to be established for a fully integrated Consent Management System. Currently, your APIs are working in isolation, but they need to be interconnected to provide a cohesive consent management experience.

## Current API Status ❌ **ISOLATED IMPLEMENTATIONS**

### Current State:
- ✅ TMF651 Agreement Management - **Working independently**
- ✅ TMF629 Customer Management - **Working independently** 
- ✅ TMF688 Event Management - **Working independently**
- ✅ Custom Consent API - **Working independently**
- ❌ **No cross-API data linking or synchronization**

## Required API Links & Integration Points

### 1. **TMF651 ↔ TMF629 Integration** ⚠️ **CRITICAL MISSING**

#### Current Problem:
- Agreements exist without customer linkage
- Customer consent preferences not synchronized with agreements
- No automatic agreement creation when customer updates preferences

#### Required Links:
```javascript
// When customer updates consent preferences in TMF629
PATCH /tmf-api/customerManagement/v4/customer/{id}/consentPreferences
↓ 
// Should automatically create/update agreement in TMF651
POST /tmf-api/agreementManagement/v4/agreement

// Agreement should reference customer
{
  "engagedParty": [{
    "id": "cust_001",
    "href": "/tmf-api/customerManagement/v4/customer/cust_001",
    "role": "customer"
  }]
}
```

### 2. **TMF651 ↔ TMF688 Integration** ⚠️ **CRITICAL MISSING**

#### Current Problem:
- Agreement changes not automatically logged as events
- No audit trail when agreements are created, updated, or deleted
- Manual event creation required

#### Required Links:
```javascript
// Every agreement action should trigger event logging
POST /tmf-api/agreementManagement/v4/agreement
↓
POST /tmf-api/eventManagement/v4/event
{
  "eventType": "ConsentGranted",
  "relatedParty": [{"id": "cust_001"}],
  "agreementId": "agreement_123"
}

// Agreement updates should log events
PATCH /tmf-api/agreementManagement/v4/agreement/{id}
↓
POST /tmf-api/eventManagement/v4/event
{
  "eventType": "ConsentUpdated",
  "description": "Customer updated marketing consent"
}
```

### 3. **TMF629 ↔ TMF688 Integration** ⚠️ **CRITICAL MISSING**

#### Current Problem:
- Customer consent preference changes not logged
- No audit trail for customer data subject rights requests
- Missing PDPA compliance logging

#### Required Links:
```javascript
// Customer preference updates should log events
PATCH /tmf-api/customerManagement/v4/customer/{id}/consentPreferences
↓
POST /tmf-api/eventManagement/v4/event
{
  "eventType": "ConsentPreferenceUpdated",
  "customerId": "cust_001",
  "changedPreferences": ["marketing", "analytics"]
}
```

### 4. **Custom Consent API ↔ All TMF APIs** ⚠️ **PARTIALLY MISSING**

#### Current Problem:
- Consent API uses mock data instead of real TMF API data
- No real-time synchronization between consent overview and actual API data

#### Required Links:
```javascript
// Consent overview should aggregate data from all APIs
GET /api/consent/overview
↓ Should call:
- GET /tmf-api/customerManagement/v4/customer (total customers)
- GET /tmf-api/agreementManagement/v4/agreement (active consents)
- GET /tmf-api/eventManagement/v4/event (recent activities)
```

## Implementation Plan: API Integration

### Phase 1: Core API Linking (Week 1-2)

#### 1.1 Agreement-Customer Integration
```javascript
// Update Agreement Controller
exports.createAgreement = async (req, res) => {
  try {
    // Create agreement
    const agreement = await Agreement.save();
    
    // Link to customer and update preferences
    if (agreement.engagedParty?.[0]?.id) {
      await updateCustomerConsent(agreement.engagedParty[0].id, agreement);
    }
    
    // Log event
    await logEvent('ConsentGranted', agreement);
    
    res.status(201).json(agreement);
  } catch (error) {
    // Handle error
  }
};
```

#### 1.2 Customer-Agreement Integration
```javascript
// Update Customer Routes
router.patch('/:id/consentPreferences', async (req, res) => {
  try {
    // Update customer preferences
    const customer = await updateCustomerPreferences(req.params.id, req.body);
    
    // Create/update corresponding agreements
    await syncAgreementsWithPreferences(customer);
    
    // Log event
    await logEvent('ConsentPreferenceUpdated', customer);
    
    res.json(customer);
  } catch (error) {
    // Handle error
  }
});
```

### Phase 2: Event Integration (Week 2-3)

#### 2.1 Automatic Event Logging Service
```javascript
// Create shared event logging service
class EventLogger {
  static async logConsentEvent(type, data) {
    const event = {
      eventType: type,
      eventTime: new Date().toISOString(),
      relatedParty: data.customerId ? [{ id: data.customerId }] : [],
      description: this.generateDescription(type, data),
      eventId: uuidv4()
    };
    
    // POST to TMF688 Event API
    await fetch('/tmf-api/eventManagement/v4/event', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  }
}
```

#### 2.2 Integration Points
```javascript
// Add to all API controllers
const EventLogger = require('../services/EventLogger');

// In agreement operations
await EventLogger.logConsentEvent('ConsentGranted', { 
  customerId: agreement.engagedParty[0].id,
  agreementType: agreement.agreementType 
});

// In customer operations  
await EventLogger.logConsentEvent('ConsentPreferenceUpdated', {
  customerId: customer.id,
  changes: changedPreferences
});
```

### Phase 3: Real-time Data Synchronization (Week 3-4)

#### 3.1 Consent Overview Integration
```javascript
// Update consent API to use real TMF data
router.get('/overview', async (req, res) => {
  try {
    // Get real data from TMF APIs
    const customers = await fetch('/tmf-api/customerManagement/v4/customer');
    const agreements = await fetch('/tmf-api/agreementManagement/v4/agreement');
    const events = await fetch('/tmf-api/eventManagement/v4/event');
    
    // Calculate real metrics
    const metrics = {
      totalCustomers: customers.length,
      activeConsents: agreements.filter(a => a.status === 'approved').length,
      complianceRate: calculateComplianceRate(customers, agreements),
      recentActivities: events.slice(0, 10)
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate consent data' });
  }
});
```

## Enhanced Backend Architecture

### Required New Services:

#### 1. **Integration Service** (`services/integration.js`)
```javascript
class IntegrationService {
  // Sync customer preferences with agreements
  static async syncCustomerAgreements(customerId) {
    // Implementation
  }
  
  // Update agreement when customer changes preferences  
  static async updateAgreementsFromPreferences(customer) {
    // Implementation
  }
  
  // Validate data consistency across APIs
  static async validateDataConsistency() {
    // Implementation
  }
}
```

#### 2. **Event Orchestration Service** (`services/eventOrchestrator.js`)
```javascript
class EventOrchestrator {
  // Handle complex event workflows
  static async handleConsentWorkflow(action, data) {
    // Implementation
  }
  
  // Ensure all related events are logged
  static async ensureCompleteAuditTrail(operation) {
    // Implementation
  }
}
```

#### 3. **Data Consistency Service** (`services/dataConsistency.js`)
```javascript
class DataConsistencyService {
  // Ensure customer-agreement consistency
  static async validateCustomerAgreements(customerId) {
    // Implementation
  }
  
  // Repair data inconsistencies
  static async repairInconsistencies() {
    // Implementation
  }
}
```

## Updated API Endpoints with Integration

### Enhanced TMF651 Agreement API:
```
POST   /tmf-api/agreementManagement/v4/agreement
  → Creates agreement
  → Updates customer preferences
  → Logs ConsentGranted event
  
PATCH  /tmf-api/agreementManagement/v4/agreement/{id}
  → Updates agreement
  → Syncs customer preferences
  → Logs ConsentUpdated event
  
DELETE /tmf-api/agreementManagement/v4/agreement/{id}
  → Deletes agreement
  → Updates customer preferences
  → Logs ConsentRevoked event
```

### Enhanced TMF629 Customer API:
```
PATCH  /tmf-api/customerManagement/v4/customer/{id}/consentPreferences
  → Updates customer preferences
  → Creates/updates agreements
  → Logs ConsentPreferenceUpdated event
  
GET    /tmf-api/customerManagement/v4/customer/{id}/agreements
  → Returns customer's agreements (linked from TMF651)
  
POST   /tmf-api/customerManagement/v4/customer/{id}/dataSubjectRequest
  → Handles PDPA rights requests
  → Updates relevant agreements
  → Logs DataSubjectRightRequest event
```

## PDPA Compliance Through API Integration

### Required Cross-API Workflows:

1. **Consent Withdrawal Process**:
   ```
   Customer Request → TMF629 → TMF651 → TMF688
   (Update preferences → Revoke agreements → Log events)
   ```

2. **Data Subject Rights**:
   ```
   Customer Request → TMF629 → TMF651 → TMF688
   (Access request → Check agreements → Log access)
   ```

3. **Compliance Reporting**:
   ```
   TMF688 → TMF651 → TMF629 → Report Generation
   (Events → Agreements → Customers → PDPA Report)
   ```

## Implementation Priority

### 🔴 **HIGH PRIORITY** (Immediate - Week 1):
1. Agreement ↔ Customer linking
2. Automatic event logging for all operations
3. Real-time consent overview data

### 🟡 **MEDIUM PRIORITY** (Week 2-3):
1. Data consistency validation
2. Complex consent workflows
3. Enhanced audit trail reporting

### 🟢 **LOW PRIORITY** (Week 4+):
1. Advanced analytics integration
2. Performance optimization
3. Automated data repair services

## Conclusion

**Yes, critical API links are missing** in your current implementation. While each individual API works well, they need to be interconnected to provide a cohesive consent management experience that meets PDPA compliance requirements.

The integration will transform your system from **isolated APIs** to a **unified consent management platform** where:
- Customer actions automatically create agreements
- Agreement changes are fully audited
- Compliance is calculated from real, synchronized data
- PDPA requirements are met through coordinated workflows

This integration is **essential** for production deployment and regulatory compliance.
