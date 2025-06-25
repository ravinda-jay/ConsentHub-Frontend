require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const agreementRoutes = require('./routes/agreement');
const cors = require('cors'); // Add this line

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Enable CORS for all origins
app.use(cors()); // Add this line

app.use(bodyParser.json());
app.use('/agreements', agreementRoutes);

app.listen(PORT, () => {
  console.log(`TMF651 Agreement API listening on http://localhost:${PORT}`);
});