const express = require('express');
const router = express.Router();
const { crearPago } = require('../controllers/paymentController');

router.post('/pagar', crearPago);

module.exports = router;

