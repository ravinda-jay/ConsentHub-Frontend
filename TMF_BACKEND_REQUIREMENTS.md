# TM Forum API Backend Requirements for Consent Management System

## Overview
Based on your Dashboard implementation and the Consent Management System proposal, here are the specific TM Forum API backend services you need to implement:

## 1. TMF651 - Agreement Management API ✅ (Partially Implemented)

### Current Implementation
- Basic agreement CRUD operations via `agreementService`
- Agreement creation, retrieval, and deletion

### Required Enhancements
```javascript
// Backend endpoints needed:
POST   /tmf-api/agreementManagement/v4/agreement
GET    /tmf-api/agreementManagement/v4/agreement
GET    /tmf-api/agreementManagement/v4/agreement/{id}
PATCH  /tmf-api/agreementManagement/v4/agreement/{id}
DELETE /tmf-api/agreementManagement/v4/agreement/{id}

// Consent-specific agreement types:
- DataProcessingConsent
- MarketingConsent
- ThirdPartyDataSharing
- AnalyticsConsent
- SensitiveDataProcessing
```

### Key Features for Consent Management:
- **Consent Categories**: Different agreement types for various data usage
- **Status Tracking**: Active, Revoked, Expired, Pending
- **Audit Trail**: Complete history of consent changes
- **Customer Linking**: Associate agreements with specific customers
- **Expiration Management**: Auto-expire consents after specified periods

## 2. TMF620 - Product Catalog Management API ✅ (Currently Integrated)

### Current Implementation
- Product offering retrieval from: `https://tm-forum-production.up.railway.app/tmf-api/productCatalogManagement/v5/productOffering`

### Consent Management Extensions Needed:
```javascript
// Additional endpoints for consent-aware products:
GET /tmf-api/productCatalogManagement/v5/productOffering?consentRequired=true
GET /tmf-api/productCatalogManagement/v5/productOffering/{id}/consentRequirements

// Product characteristics for consent:
- requiredConsentTypes: ["marketing", "analytics", "thirdParty"]
- dataCollectionPurpose: "Service delivery, marketing, analytics"
- consentDuration: "12 months"
- sensitiveDataInvolved: true/false
```

## 3. TMF629 - Customer Management API (Needed)

### Required Implementation
```javascript
// Core customer endpoints:
POST   /tmf-api/customerManagement/v4/customer
GET    /tmf-api/customerManagement/v4/customer
GET    /tmf-api/customerManagement/v4/customer/{id}
PATCH  /tmf-api/customerManagement/v4/customer/{id}

// Consent-specific customer extensions:
GET    /tmf-api/customerManagement/v4/customer/{id}/agreements
GET    /tmf-api/customerManagement/v4/customer/{id}/consentPreferences
PATCH  /tmf-api/customerManagement/v4/customer/{id}/consentPreferences
```

### Customer Consent Profile:
- Customer consent preferences
- Opt-in/opt-out history
- Communication preferences
- Data subject rights requests

## 4. TMF688 - Event Management API (Needed for Audit Trail)

### Required Implementation
```javascript
// Event tracking for consent changes:
POST /tmf-api/eventManagement/v4/event

// Event types for consent management:
- ConsentGranted
- ConsentRevoked
- ConsentUpdated
- ConsentExpired
- DataSubjectRightRequest
- DataProcessingActivity
```

### Audit Trail Features:
- Real-time event logging
- Immutable audit records
- Event correlation and tracking
- Compliance reporting

## 5. TMF637 - Product Inventory Management API (Optional)

### Use Case for Consent Management
```javascript
// Track active services per customer requiring consent:
GET /tmf-api/productInventory/v4/product?customer.id={customerId}
GET /tmf-api/productInventory/v4/product/{id}/consentStatus
```

## 6. TMF622 - Product Ordering API (Needed for Consent Capture)

### Consent Integration Points
```javascript
// Capture consent during order process:
POST /tmf-api/productOrdering/v4/productOrder

// Order characteristics for consent:
- consentCaptured: true/false
- consentTimestamp: "2024-12-29T10:00:00Z"
- consentMethod: "web", "mobile", "ussd", "callCenter"
- consentDocumentId: "consent_doc_123"
```

## Backend Architecture Recommendations

### 1. Microservices Structure
```
consent-management-backend/
├── agreement-service/          # TMF651 implementation
├── customer-service/           # TMF629 implementation  
├── product-catalog-service/    # TMF620 implementation
├── event-service/             # TMF688 implementation
├── order-service/             # TMF622 implementation
├── notification-service/      # Real-time notifications
└── compliance-service/        # PDPA compliance checking
```

### 2. Database Schema Requirements

#### Agreements Table (TMF651)
```sql
CREATE TABLE agreements (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    agreement_type VARCHAR(100) NOT NULL, -- consent type
    status VARCHAR(50) NOT NULL,          -- Active, Revoked, Expired
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP,
    expiry_date TIMESTAMP,
    consent_method VARCHAR(50),           -- web, mobile, ussd
    purpose TEXT,                         -- data usage purpose
    legal_basis VARCHAR(100),             -- PDPA legal basis
    characteristics JSON                   -- additional metadata
);
```

#### Customers Table (TMF629)
```sql
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    preferred_language VARCHAR(10),       -- en, si, ta
    communication_preferences JSON,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP
);
```

#### Audit Events Table (TMF688)
```sql
CREATE TABLE audit_events (
    id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    customer_id VARCHAR(255),
    agreement_id VARCHAR(255),
    user_id VARCHAR(255),                 -- who made the change
    timestamp TIMESTAMP NOT NULL,
    details JSON,                         -- event-specific data
    ip_address VARCHAR(45),
    user_agent TEXT
);
```

### 3. API Security & Compliance

#### Authentication & Authorization
```javascript
// OAuth 2.0 / JWT implementation
headers: {
    'Authorization': 'Bearer <jwt_token>',
    'X-Customer-ID': '<customer_id>',     // for customer context
    'X-Consent-Required': 'true'          // flag consent-required operations
}
```

#### PDPA Compliance Headers
```javascript
// Request/Response headers for compliance
'X-Data-Purpose': 'marketing,analytics',
'X-Consent-Status': 'granted',
'X-Legal-Basis': 'consent',
'X-Retention-Period': '12months'
```

### 4. Integration Points for Your Dashboard

#### Current Frontend Integration
```javascript
// Your existing service calls:
agreementService.getAllAgreements()     // TMF651
fetch('.../productOffering')            // TMF620

// Additional services needed:
customerService.getCustomer(id)         // TMF629
eventService.getAuditTrail(customerId) // TMF688
orderService.createOrder(orderData)    // TMF622
```

#### Real-time Updates
```javascript
// WebSocket connections for live updates:
ws://api.consent-system.com/events     // Real-time consent changes
ws://api.consent-system.com/compliance // Live compliance status
```

## 5. Deployment Architecture

### Container Structure
```yaml
# docker-compose.yml
services:
  agreement-api:
    image: consent/agreement-service:latest
    ports: ["8001:8080"]
    environment:
      - DB_URL=postgresql://consent_db:5432/agreements
      
  customer-api:
    image: consent/customer-service:latest
    ports: ["8002:8080"]
    environment:
      - DB_URL=postgresql://consent_db:5432/customers
      
  event-api:
    image: consent/event-service:latest
    ports: ["8003:8080"]
    environment:
      - DB_URL=postgresql://consent_db:5432/events
      
  api-gateway:
    image: nginx:latest
    ports: ["80:80"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### API Gateway Configuration
```nginx
# Route TM Forum APIs through gateway
location /tmf-api/agreementManagement/ {
    proxy_pass http://agreement-api:8080/;
}

location /tmf-api/customerManagement/ {
    proxy_pass http://customer-api:8080/;
}

location /tmf-api/eventManagement/ {
    proxy_pass http://event-api:8080/;
}
```

## 6. Development Priority

### Phase 1 (Weeks 1-2): Core APIs
1. **TMF651 Agreement Management** - Enhanced consent agreement handling
2. **TMF629 Customer Management** - Customer profile and consent preferences
3. **TMF688 Event Management** - Basic audit trail logging

### Phase 2 (Weeks 3-4): Integration APIs  
1. **TMF622 Product Ordering** - Consent capture during ordering
2. **Enhanced TMF620** - Consent-aware product catalog
3. **Real-time notifications** - WebSocket implementation

### Phase 3 (Weeks 5-6): Advanced Features
1. **Compliance automation** - PDPA violation detection
2. **Data retention management** - Automatic consent expiration
3. **Multi-language support** - Sinhala/Tamil API responses

## 7. Testing Strategy

### API Testing Requirements
```javascript
// Jest/Supertest examples for TMF651
describe('Agreement Management API', () => {
  test('should create consent agreement', async () => {
    const agreement = {
      agreementType: 'MarketingConsent',
      customerId: 'cust_123',
      status: 'Active',
      purpose: 'Email marketing campaigns'
    };
    
    const response = await request(app)
      .post('/tmf-api/agreementManagement/v4/agreement')
      .send(agreement)
      .expect(201);
      
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('Active');
  });
});
```

This backend architecture will provide a robust foundation for your Consent Management System, ensuring full TM Forum API compliance while meeting PDPA regulatory requirements.
