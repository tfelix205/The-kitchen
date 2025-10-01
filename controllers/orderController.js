const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const userId = await userModel.findById(req.user._id);
    if(!userId) {
      return res.status(401).json({ message: 'Can not access order history' });
    }
    if(!items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const newOrder = new orderModel({
      items,
      totalAmount,
      userId,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json({ 
        message: 'Order created successfully', 
        order: newOrder 
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Internal server error',
        error: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate('userId', 'name email');
    res.status(200).json({
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
         message: 'Internal server error',
         error: error.message
    });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).populate('items.productId', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'successful', 'failed'].includes(status)) {
      return res.status(400).json({
         message: 'Invalid status value' 
        });
    }
    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
         message: 'Order not found'
         });
    }
    res.status(200).json({
        message: 'Order status updated', order
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message 
    });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!['pending', 'successful', 'failed'].includes(status)) {
      return res.status(400).json({
         message: 'Invalid status value'
      });
    }
    const orders = await orderModel.find({ status }).populate('userId', 'name email');
    res.status(200).json({
        orders: orders
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await orderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ 
        message: 'Order not found' 
    });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
         message: 'Internal server error',
         error: error.message
          });
  }
};
