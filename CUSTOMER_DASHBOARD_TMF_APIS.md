# TM Forum APIs Required for Customer Dashboard

## Customer Dashboard Functionality Analysis

### **Customer Dashboard Features & Required TMF APIs:**

#### **1. Overview Tab - Personal Consent Statistics**
**Features**: Personal consent metrics, quick actions, recent activity
**Required APIs**:
- **TMF629 Customer Management** - Get customer consent statistics
- **TMF651 Agreement Management** - Retrieve customer's active agreements
- **TMF688 Event Management** - Recent consent activities

#### **2. Consent Preferences Tab - Interactive Consent Management**
**Features**: Toggle consent categories, real-time updates, preference management
**Required APIs**:
- **TMF629 Customer Management** - Update consent preferences
- **TMF651 Agreement Management** - Create/update consent agreements
- **TMF688 Event Management** - Log consent changes

#### **3. History Tab - Personal Audit Trail**
**Features**: Consent change history, export functionality
**Required APIs**:
- **TMF688 Event Management** - Retrieve customer's audit trail
- **TMF651 Agreement Management** - Historical agreement data

#### **4. Data Usage Tab - Transparency Information**
**Features**: Data usage details, retention periods, third-party sharing
**Required APIs**:
- **TMF629 Customer Management** - Customer data categories
- **Custom Data Governance API** - Data retention and usage policies

#### **5. Profile Tab - Customer Information**
**Features**: Personal information display, profile management
**Required APIs**:
- **TMF629 Customer Management** - Customer profile data

---

## **Primary TMF APIs for Customer Dashboard**

### **1. TMF629 - Customer Management API** 🔴 **CRITICAL**

#### **Customer-Specific Endpoints Needed:**
```javascript
// Get customer's consent preferences
GET /tmf-api/customerManagement/v4/customer/{customerId}/consentPreferences

// Update customer's consent preferences
PATCH /tmf-api/customerManagement/v4/customer/{customerId}/consentPreferences

// Get customer profile information
GET /tmf-api/customerManagement/v4/customer/{customerId}

// Get customer's data usage information
GET /tmf-api/customerManagement/v4/customer/{customerId}/dataUsageInfo

// Submit data subject rights request
POST /tmf-api/customerManagement/v4/customer/{customerId}/dataSubjectRequest
```

#### **Purpose for Customer Dashboard:**
- **Personal consent preference management**
- **Customer profile information display**
- **Data subject rights request submission**
- **Consent statistics calculation**

### **2. TMF651 - Agreement Management API** 🔴 **CRITICAL**

#### **Customer-Specific Endpoints Needed:**
```javascript
// Get customer's consent agreements
GET /tmf-api/agreementManagement/v4/agreement?customerId={customerId}

// Get specific agreement details
GET /tmf-api/agreementManagement/v4/agreement/{agreementId}

// Update agreement status (customer approve/reject)
PATCH /tmf-api/agreementManagement/v4/agreement/{agreementId}/status

// Create new consent agreement (triggered by preference changes)
POST /tmf-api/agreementManagement/v4/agreement
```

#### **Purpose for Customer Dashboard:**
- **Display active consent agreements**
- **Allow customers to approve/reject agreements**
- **Automatic agreement creation when preferences change**
- **Agreement status tracking**

### **3. TMF688 - Event Management API** 🔴 **CRITICAL**

#### **Customer-Specific Endpoints Needed:**
```javascript
// Get customer's consent history/audit trail
GET /tmf-api/eventManagement/v4/event?customerId={customerId}

// Get specific event details
GET /tmf-api/eventManagement/v4/event/{eventId}

// Log new consent event (triggered by customer actions)
POST /tmf-api/eventManagement/v4/event
```

#### **Purpose for Customer Dashboard:**
- **Personal consent history display**
- **Audit trail for compliance**
- **Event logging for all customer actions**
- **Export functionality for personal records**

---

## **Secondary/Optional TMF APIs**

### **4. TMF620 - Product Catalog Management** ⚠️ **OPTIONAL**

#### **Customer Context Endpoints:**
```javascript
// Get products with consent requirements
GET /tmf-api/productCatalogManagement/v5/productOffering?consentRequired=true

// Get consent requirements for specific product
GET /tmf-api/productCatalogManagement/v5/productOffering/{productId}/consentRequirements
```

#### **Purpose for Customer Dashboard:**
- **Show which products require specific consents**
- **Display consent implications when considering new services**

### **5. TMF622 - Product Ordering** ⚠️ **OPTIONAL**

#### **Customer Context Endpoints:**
```javascript
// Get customer's orders with consent context
GET /tmf-api/productOrdering/v4/productOrder?customerId={customerId}

// Create order with consent capture
POST /tmf-api/productOrdering/v4/productOrder
```

#### **Purpose for Customer Dashboard:**
- **Show how orders relate to consent requirements**
- **Enable consent-aware product ordering**

---

## **Customer Dashboard API Integration Architecture**

### **Core Integration Pattern:**
```
Customer Dashboard
        ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TMF629        │    │   TMF651        │    │   TMF688        │
│ Customer Mgmt   │←→  │ Agreement Mgmt  │←→  │ Event Mgmt      │
│                 │    │                 │    │                 │
│ • Preferences   │    │ • Consent       │    │ • Audit Trail   │
│ • Profile       │    │   Agreements    │    │ • Activity Log  │
│ • Rights        │    │ • Status        │    │ • Export Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Customer Action Workflow:**
```
1. Customer Updates Consent Preference (UI)
        ↓
2. PATCH TMF629 /customer/{id}/consentPreferences
        ↓
3. POST TMF651 /agreement (auto-create agreement)
        ↓
4. POST TMF688 /event (log the consent change)
        ↓
5. Update Customer Dashboard (real-time feedback)
```

---

## **Specific Customer Dashboard Requirements**

### **Overview Tab Requirements:**
- **TMF629**: Get consent preference statistics
- **TMF651**: Count active agreements
- **TMF688**: Get recent activities (last 3 events)

### **Preferences Tab Requirements:**
- **TMF629**: Get/update consent preferences
- **TMF651**: Create/update agreements automatically
- **TMF688**: Log preference changes

### **History Tab Requirements:**
- **TMF688**: Get complete customer event history
- **TMF688**: Export audit trail functionality

### **Data Usage Tab Requirements:**
- **TMF629**: Get data categories and usage information
- **Custom API**: Data retention policies and procedures

### **Profile Tab Requirements:**
- **TMF629**: Get/display customer profile information

---

## **Customer-Specific API Security Requirements**

### **Authentication & Authorization:**
```javascript
// Customer can only access their own data
middleware.authenticateCustomer = (req, res, next) => {
  // Verify JWT token
  // Ensure customer can only access their own customerId
  // Block access to other customers' data
};

// Apply to all customer endpoints
app.use('/tmf-api/customerManagement/v4/customer/:customerId/*', 
        authenticateCustomer);
```

### **Data Isolation:**
- Customers can only view their own consent preferences
- Customers can only see their own agreements
- Customers can only access their own audit trail
- Admin and customer data are completely separated

---

## **Implementation Priority for Customer Dashboard**

### **Phase 1 (Week 1): Core Customer APIs** 🔴
1. **TMF629 Customer Management**: 
   - Get/update consent preferences
   - Get customer profile
2. **TMF651 Agreement Management**: 
   - Get customer agreements
   - Update agreement status
3. **TMF688 Event Management**: 
   - Get customer audit trail
   - Log customer actions

### **Phase 2 (Week 2): Enhanced Features** 🟡
1. **Data Subject Rights**: TMF629 data request endpoints
2. **Export Functionality**: TMF688 audit export
3. **Real-time Updates**: WebSocket integration

### **Phase 3 (Week 3): Optional Integration** 🟢
1. **Product Context**: TMF620 consent requirements
2. **Order Context**: TMF622 consent-aware ordering

---

## **Customer Dashboard Backend Service Requirements**

### **New Services Needed:**
```javascript
// Customer service for dashboard
class CustomerDashboardService {
  async getCustomerOverview(customerId) {
    // Aggregate data from TMF629, TMF651, TMF688
  }
  
  async updateConsentPreferences(customerId, preferences) {
    // Update TMF629, create TMF651 agreement, log TMF688 event
  }
  
  async getConsentHistory(customerId) {
    // Get events from TMF688 for this customer
  }
  
  async submitDataSubjectRequest(customerId, request) {
    // Create request via TMF629, log via TMF688
  }
}
```

---

## **Summary: Essential TMF APIs for Customer Dashboard**

### **Must Have (Core Functionality):**
1. ✅ **TMF629 Customer Management** - Consent preferences & profile
2. ✅ **TMF651 Agreement Management** - Consent agreements
3. ✅ **TMF688 Event Management** - Audit trail & logging

### **Should Have (Enhanced Features):**
4. ⚠️ **TMF620 Product Catalog** - Product consent requirements
5. ⚠️ **TMF622 Product Ordering** - Consent-aware ordering

### **Customer Dashboard Success Depends On:**
- **TMF629**: 80% of customer dashboard functionality
- **TMF651**: 15% for agreement management
- **TMF688**: 5% for audit trail and compliance

**Without TMF629, TMF651, and TMF688, the customer dashboard cannot function properly for consent management and PDPA compliance.**
