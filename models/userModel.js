const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    trim: true,
    max: [11, 'Phone number cannot exceed 11 digits']
    
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' 
    },
    otp: {
    type: String,
    select: false 
    },
    otpExpiry: {
    type: Date,
    select: false 
    },

}, {
  timestamps: true
});

// this function will hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// i'm adding a method to compare passwords for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// convert to JSON and remove password field before sending the user object in responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};



const userModel = mongoose.model('User', userSchema);
module.exports = userModel;