require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const agreementRoutes = require('./routes/agreement');
const customerRoutes = require('./routes/customers');
const auditRoutes = require('./routes/audit');
const consentRoutes = require('./routes/consent');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB connection
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/consent-management',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local frontend
  'https://consent-management-system.vercel.app', // Deployed Vercel frontend
  'https://agreement-management-backend.onrender.com', // Render backend
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ TMF API Routes
app.use('/tmf-api/agreementManagement/v4/agreement', agreementRoutes);
app.use('/tmf-api/customerManagement/v4/customer', customerRoutes);
app.use('/tmf-api/eventManagement/v4/event', auditRoutes);
app.use('/api/consent', consentRoutes);

// ✅ Legacy route (optional)
app.use('/agreements', agreementRoutes);

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: ['TMF651-Agreement', 'TMF629-Customer', 'TMF688-Event'],
  });
});

// ✅ System info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    system: 'Consent Management System',
    version: '1.0.0',
    apis: [
      'TMF651 - Agreement Management',
      'TMF629 - Customer Management',
      'TMF688 - Event Management'
    ],
    compliance: 'PDPA Sri Lanka 2022'
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Consent Management System API running on http://localhost:${PORT}`);
  console.log(`📋 TMF651 Agreement API: http://localhost:${PORT}/tmf-api/agreementManagement/v4/agreement`);
  console.log(`👥 TMF629 Customer API: http://localhost:${PORT}/tmf-api/customerManagement/v4/customer`);
  console.log(`📊 TMF688 Event API: http://localhost:${PORT}/tmf-api/eventManagement/v4/event`);
  console.log(`🛡️  Consent API: http://localhost:${PORT}/api/consent`);
});
