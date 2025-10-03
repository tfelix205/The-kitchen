const { initializePayment, verifyPayment } = require('../controllers/paymentController');

const router = require('express').Router();

router.get('/make-payment/:userId/:menuId', initializePayment);

router.get('/verify-payment', verifyPayment);

module.exports = router;