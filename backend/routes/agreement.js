const express = require('express');
const router = express.Router();
const controller = require('../controllers/agreement');

router.post('/', controller.createAgreement);
router.get('/', controller.getAllAgreements);
router.get('/:id', controller.getAgreementById);
router.patch('/:id', controller.updateAgreement);
router.delete('/:id', controller.deleteAgreement);

module.exports = router;