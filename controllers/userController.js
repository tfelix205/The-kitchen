const userModel = require('../models/userModel');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {signupMail} = require('../utils/signup_mail');
const {sendEmail} = require('../utils/sendgrid');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
    try {
         const { firstName,lastName, email, password, phone} = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 1e6).toString().padStart(6, '0');

    const user = new userModel({
      firstName,
      lastName,
      email,
      password,
      phone,
      otp: otp,
      otpExpiry: Date.now() + 30 * 60 * 1000
      
    });
    // const mailing = {
    //     email: user.email,
    //     subject: 'Your OTP Code',
    //     html: signupMail({otp:user?.otp, firstName:user?.firstName}) 
    // };
    // await sendEmail(mailing);
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 const msg = {
  to: user.email, // Change to your recipient
  from: process.env.email, // Change to your verified sender
  subject: "verification code",
  text: "welcome to risebite",
  html: signupMail(otp, firstName),
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
    const mailing = {
        email: user.email,
        subject: 'Your OTP Code',
        html: signupMail(otp, firstName) 


    }
    await sendEmail(mailing);
    console.log('OTP sent to email:', otp);

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        
      }
    });
        
    } catch (error) {
        res.status(500).json({ message: 'Registration failed: ', error: error.message });
    }
};



exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    // Validate inputs
    if (!otp) {
      return res.status(400).json({ message: ' OTP is required' });
    }

    // Find the user by email
    const user = await userModel.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP expired' });
    }


  
    // Check if OTP matches
    if (otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({ message: 'User verified successfully' });

  } catch (error) {
    return res.status(500).json({
      message: 'Error verifying user: ' + error.message
    });
  }
};


exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
console.log(user);

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      })
    };

    const otp = Math.round(Math.random() * 1e6).toString().padStart(6, "0");
    Object.assign(user, {otp: otp, otpExpiry: Date.now() + 1000 * 60 * 30});

     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 const msg = {
  to: user.email, // Change to your recipient
  from: process.env.email, // Change to your verified sender
  subject: "verification code",
  text: "welcome to risebite",
  html: signupMail(otp, user.firstName),
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

      
    await user.save();
    res.status(200).json({
      message: 'Otp sent, kindly check your email'
    })
  } catch (error) {
    res.status(500).json({
      mesaage: 'Error resending otp' + error.message
    })
  }
};


exports.loginUser = async (req, res) => {
    try {
       
        const {email, password} = req.body;
      
        const checkUser = await userModel.findOne({email:email.toLowerCase().trim()})
     
        const checkPassword = await bcrypt.compare(password, checkUser.password)

   
        if (!checkUser || !checkPassword) {
            return res.status(400).json(`invalid credentials`)
        }

        if (!checkUser.isVerified) {
            return res.status(401).json(`please verify your email to proceed`)
        }

        if (!checkUser.isActive) {
            return res.status(400).json(`your account has been suspended \n please contact the customer support`)
        }


        const token = jwt.sign({id:checkUser._id}, "otolo", {expiresIn: "24h"})
        
           

       

       res.status(200).json({
        message: `Login successful`,
        data: checkUser,
        token
       })
        
    } catch (error) {
        res.status(500).json({
            message: `internal server error`,
            error: error.message
        }) 
    }
};


exports.getuserById = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await userModel.findById(userId).select('-password -otp -otpExpiry');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } 
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password -otp -otpExpiry');
    if (users.length === 0) {
        return res.status(200).json({ message: 'No User Registered' });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password -otp -otpExpiry'); 
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); 
    }
    res.status(200).json({ user });
  }
    catch (error) { 
    res.status(500).json({ message: 'Server error', error: error.message });
  } 
};


exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;    
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;    
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } 
};


exports.suspendUser = async (req, res) => {
  try {
   const User = await userModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true } 
    );
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = false;
    await user.save();
    res.status(200).json({ message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.reactivateUser = async (req, res) => {
  try {
    const User = await userModel.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true } 
    );

    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } 
    const otp = Math.floor(100000 + Math.random() * 1e6).toString().padStart(6, '0');
    user.otp = otp;
    user.otpExpiry = Date.now() + 30 * 60 * 1000; 
    await user.save();

    const mailing = {
        email: user.email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 30 minutes.</p>`
    };
    await sendEmail(mailing);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }   
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } 
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    } 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }   
};
