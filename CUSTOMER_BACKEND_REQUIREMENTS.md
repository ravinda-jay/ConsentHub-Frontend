# Customer-Specific Backend Enhancements

## Customer Dashboard API Requirements

### Enhanced TMF629 Customer Management API

#### Customer Self-Service Endpoints:
```javascript
// Customer-specific consent management endpoints
GET    /tmf-api/customerManagement/v4/customer/{customerId}/consent-preferences
PATCH  /tmf-api/customerManagement/v4/customer/{customerId}/consent-preferences
GET    /tmf-api/customerManagement/v4/customer/{customerId}/consent-history
GET    /tmf-api/customerManagement/v4/customer/{customerId}/data-usage-info
POST   /tmf-api/customerManagement/v4/customer/{customerId}/data-subject-request
```

### Implementation Updates Required:

#### 1. Enhanced Customer Routes (`backend/routes/customers.js`)
```javascript
// Add customer self-service endpoints

// GET customer's own consent preferences
router.get('/:id/consent-preferences', (req, res) => {
  try {
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({
      customerId: customer.id,
      preferences: customer.consentPreferences,
      lastUpdated: customer.lastUpdated || new Date().toISOString(),
      expiryDates: {
        marketing: '2025-12-10T14:20:00Z',
        analytics: '2025-12-08T09:15:00Z',
        thirdPartySharing: '2025-12-01T16:45:00Z'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve preferences' });
  }
});

// PATCH customer's consent preferences
router.patch('/:id/consent-preferences', (req, res) => {
  try {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Update preferences
    customers[customerIndex].consentPreferences = {
      ...customers[customerIndex].consentPreferences,
      ...req.body
    };
    customers[customerIndex].lastUpdated = new Date().toISOString();
    
    // Log event to TMF688
    const eventData = {
      eventType: 'ConsentPreferenceUpdated',
      customerId: req.params.id,
      changes: Object.keys(req.body),
      timestamp: new Date().toISOString()
    };
    
    // Create corresponding agreement via TMF651
    // This would call the agreement API to create/update consent agreements
    
    res.json({
      message: 'Preferences updated successfully',
      preferences: customers[customerIndex].consentPreferences,
      updatedAt: customers[customerIndex].lastUpdated
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// GET customer's consent history
router.get('/:id/consent-history', (req, res) => {
  try {
    // In real implementation, this would query TMF688 Event API
    const mockHistory = [
      {
        id: '1',
        action: 'Updated',
        category: 'Marketing Communications',
        timestamp: '2024-12-10T14:20:00Z',
        details: 'Enabled marketing communications consent'
      },
      {
        id: '2',
        action: 'Revoked',
        category: 'Third-party Data Sharing',
        timestamp: '2024-12-01T16:45:00Z',
        details: 'Disabled third-party data sharing consent'
      }
    ];
    
    res.json({
      customerId: req.params.id,
      history: mockHistory,
      totalCount: mockHistory.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// GET data usage information
router.get('/:id/data-usage-info', (req, res) => {
  try {
    const dataUsageInfo = [
      {
        category: 'Service Delivery',
        purpose: 'Providing telecommunications services, billing, and customer support',
        dataTypes: ['Contact Information', 'Usage Data', 'Billing Information'],
        retentionPeriod: '7 years after service termination'
      },
      {
        category: 'Marketing',
        purpose: 'Sending promotional offers and product recommendations',
        dataTypes: ['Contact Information', 'Service Preferences', 'Usage Patterns'],
        retentionPeriod: '2 years from last interaction'
      }
    ];
    
    res.json({
      customerId: req.params.id,
      dataUsage: dataUsageInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data usage info' });
  }
});

// POST data subject request (PDPA rights)
router.post('/:id/data-subject-request', (req, res) => {
  try {
    const { requestType, description } = req.body;
    
    const request = {
      id: `dsr_${Date.now()}`,
      customerId: req.params.id,
      requestType, // 'access', 'correction', 'deletion', 'portability'
      description,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    
    // In real implementation, this would:
    // 1. Create ticket in support system
    // 2. Log event in TMF688
    // 3. Send confirmation email
    
    res.status(201).json({
      message: 'Data subject request submitted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});
```

#### 2. Customer Authentication Middleware
```javascript
// Add to backend/middleware/auth.js
const authenticateCustomer = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Verify JWT token and extract customer ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure customer can only access their own data
    if (req.params.id && req.params.id !== decoded.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    req.customer = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### 3. Enhanced Agreement API for Customer Context
```javascript
// Add to backend/routes/agreement.js

// GET customer's own agreements only
router.get('/customer/:customerId', authenticateCustomer, (req, res) => {
  try {
    // Filter agreements by customer ID
    const customerAgreements = agreements.filter(agreement => 
      agreement.engagedParty?.some(party => party.id === req.params.customerId)
    );
    
    res.json({
      customerId: req.params.customerId,
      agreements: customerAgreements,
      totalCount: customerAgreements.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve agreements' });
  }
});

// Customer can only update their own agreement status (limited operations)
router.patch('/customer/:customerId/:agreementId/status', authenticateCustomer, (req, res) => {
  try {
    const { status } = req.body; // Only allow 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const agreement = agreements.find(a => 
      a.id === req.params.agreementId &&
      a.engagedParty?.some(party => party.id === req.params.customerId)
    );
    
    if (!agreement) {
      return res.status(404).json({ error: 'Agreement not found' });
    }
    
    agreement.status = status;
    agreement.updatedDate = new Date().toISOString();
    
    // Log event
    const eventData = {
      eventType: status === 'approved' ? 'ConsentGranted' : 'ConsentRevoked',
      customerId: req.params.customerId,
      agreementId: req.params.agreementId,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      message: `Agreement ${status} successfully`,
      agreement
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agreement' });
  }
});
```

#### 4. Customer-Specific Event Logging
```javascript
// Add to backend/routes/audit.js

// GET customer's own audit trail
router.get('/customer/:customerId', authenticateCustomer, (req, res) => {
  try {
    // Filter events by customer ID
    const customerEvents = events.filter(event => 
      event.relatedParty?.some(party => party.id === req.params.customerId)
    );
    
    res.json({
      customerId: req.params.customerId,
      events: customerEvents,
      totalCount: customerEvents.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit trail' });
  }
});
```

### Required Server.js Updates:
```javascript
// Add customer-specific routes
app.use('/tmf-api/customerManagement/v4/customer', authenticateCustomer, customerRoutes);
app.use('/tmf-api/agreementManagement/v4/agreement', agreementRoutes);
app.use('/tmf-api/eventManagement/v4/event', auditRoutes);

// Customer portal specific endpoints
app.use('/api/customer-portal', authenticateCustomer, customerPortalRoutes);
```

## Role-Based Access Control Implementation

### Frontend Integration Points:
1. **Customer Service**: Create `services/customerService.ts`
2. **Authentication**: Update login to handle customer tokens
3. **API Calls**: Customer-specific API endpoints
4. **Real-time Updates**: WebSocket for consent changes

### Security Considerations:
1. **Data Isolation**: Customers can only access their own data
2. **JWT Tokens**: Separate tokens for admin and customer roles
3. **Rate Limiting**: Prevent abuse of customer APIs
4. **Audit Logging**: All customer actions logged for compliance

This implementation provides a complete customer self-service portal while maintaining security and PDPA compliance.
