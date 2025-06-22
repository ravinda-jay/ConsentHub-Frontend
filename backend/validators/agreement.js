const Joi = require('joi');

exports.agreementSchema = Joi.object({
  name: Joi.string().required(),
  agreementType: Joi.string().required(),
  description: Joi.string().optional(),
  statementOfIntent: Joi.string().optional(),
  version: Joi.string().optional().default('1.0'),
  documentNumber: Joi.number().optional(),

  agreementPeriod: Joi.object({
    startDateTime: Joi.string().isoDate().required(),
    endDateTime: Joi.string().isoDate().optional()
  }).optional(),

  agreementSpecification: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    href: Joi.string().uri().required(),
    '@referredType': Joi.string().valid('AgreementSpecification').required()
  }).optional(),

  agreementItem: Joi.array().items(
    Joi.object({
      productOffering: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          href: Joi.string().uri().required(),
          '@referredType': Joi.string().valid('ProductOffering').optional()
        })
      ).required(),
      termOrCondition: Joi.array().items(
        Joi.object({
          id: Joi.string().optional(),
          description: Joi.string().optional(),
          validFor: Joi.object({
            startDateTime: Joi.string().isoDate().optional(),
            endDateTime: Joi.string().isoDate().optional()
          }).optional()
        })
      ).optional()
    })
  ).required(),

  engagedParty: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      role: Joi.string().required(),
      href: Joi.string().uri().optional(),
      '@referredType': Joi.string().valid('Organization').optional()
    })
  ).required(),

  relatedParty: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().optional(),
      role: Joi.string().required(),
      href: Joi.string().uri().optional(),
      '@referredType': Joi.string().valid('Organization').optional()
    })
  ).required(),

  '@type': Joi.string().optional().default('Agreement'),
  '@baseType': Joi.string().optional(),
  '@schemaLocation': Joi.string().uri().optional()
});