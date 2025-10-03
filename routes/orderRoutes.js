const express = require('express');
const router = express.Router();
const {getOrderById, updateOrderStatus, getOrdersByStatus, getUserOrderHistory} = require('../controllers/orderController');


router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/orders/status', getOrdersByStatus);
router.get('/orders/:userId', getUserOrderHistory);

module.exports = router;