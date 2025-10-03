const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');

exports.getUserOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all orders of that user
    const orders = await orderModel.find({ userId })
      .populate('items.productId', 'name price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No order history found' });
    }

   
    const pending = orders.filter(order => order.status === 'pending');
    const successful = orders.filter(order => order.status === 'successful');
    const failed = orders.filter(order => order.status === 'failed');

    const past = successful.slice(1); 

    res.status(200).json({
      message: 'Order history fetched successfully',
      history: {
        pending,
        successful,
        failed,
        past
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};



//   try {
//     const userId = req.user?._id;
//     const { status } = req.query; // e.g., ?status=pending or ?status=successful
//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized: User not found' });
//     }
//     const filter = { userId };
//     if (status && ['pending', 'successful', 'failed'].includes(status)) {
//       filter.status = status;
//     }
//     const orders = await orderModel.find(filter)
//       .populate('userId', 'name email')
//       .populate('items.productId', 'name price');
//     res.status(200).json({ orders });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };
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
      { status: status },
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


