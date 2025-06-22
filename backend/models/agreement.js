const mongoose = require('mongoose');

const TermOrConditionSchema = new mongoose.Schema({
  id: String,
  description: String,
  validFor: {
    startDateTime: Date,
    endDateTime: Date
  }
});

const AgreementItemSchema = new mongoose.Schema({
  productOffering: [{
    id: String,
    name: String,
    href: String,
    '@referredType': { type: String, default: 'ProductOffering' }
  }],
  termOrCondition: [TermOrConditionSchema]
});

const RelatedPartySchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  href: String,
  '@referredType': { type: String, default: 'Organization' }
});

const AgreementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  agreementType: { type: String, required: true },
  description: String,
  statementOfIntent: String,
  documentNumber: Number,
  agreementItem: [AgreementItemSchema],
  agreementPeriod: {
    startDateTime: Date,
    endDateTime: Date
  },
  agreementSpecification: {
    id: String,
    name: String,
    href: String,
    '@referredType': { type: String, default: 'AgreementSpecification' }
  },
  engagedParty: [RelatedPartySchema],
  relatedParty: [RelatedPartySchema],
  '@type': { type: String, default: 'Agreement' },
  '@baseType': String,
  '@schemaLocation': String,
  href: String,
  createdDate: { type: Date, default: Date.now },
  updatedDate: Date,
  audit: [{
    timestamp: Date,
    action: String,
    by: String
  }]
});

module.exports = mongoose.model('Agreement', AgreementSchema);