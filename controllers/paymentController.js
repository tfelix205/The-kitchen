const userModel = require('../models/user');
const menuModel = require('../models/product');
const paymentModel = require('../models/payment');
const axios = require('axios');
const otpGen = require('otp-generator');


exports.initializePayment = async (req, res) => {
  try {
    const { userId, menuId } = req.params;
    const user = await userModel.findById(userId);
    const menu = await menuModel.findById(menuId);
    const ref = otpGen.generate(12, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!menu) {
      return res.status(404).json({
        message: 'Menu not found'
      })
    };

    const paymentInfo = {
      amount: menu.price,
      currency: 'NGN',
      reference: ref,
      customer: {
        email: user.email,
        name: `${user.firstName}`
      },
    //   redirect_url: 'https://www.google.com'
    }

    const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentInfo, {
      headers: {
        Authorization: `Bearer ${process.env.KORA}`
      }
    });

    if (data.status && data.status === true) {
      const payment = new paymentModel({
        userId: user._id,
        menuId: menu._id,
        price: menu.price,
        reference: data.data.reference
      })

      await payment.save();
      res.status(200).json({
        message: 'Payment successful',
        data: {
          reference: data.data.reference,
          checkout_url: data.data.checkout_url
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error initializing payment',
      error: error.message
    })
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    const payment = await paymentModel.findOne({ reference: reference });

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    };

    const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,{
      headers: {
        Authorization: `Bearer ${process.env.KORA}`
      }
    });

    
    

    if (data.status === true && data.data.status === 'success') {
      Object.assign(payment, { status: 'Successful' });
      await payment.save();
      res.status(200).json({
        message: 'Payment successful'
      })
    } else if(data.status === true && data.data.status === 'processing') {
      Object.assign(payment, { status: 'Pending' });
      await payment.save();
      res.status(200).json({
        message: 'Payment failed'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message
    })
  }
};