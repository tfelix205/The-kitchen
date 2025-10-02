const joi = require('joi');


exports.registerValidator = (req, res, next) => {
  const schema = joi.object({
    firstName: joi.string().min(3).trim().required().pattern(/^[A-Za-z\s]+$/).messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 3 characters long',
      'string.pattern.base': 'First name can only contain letters'
    }),
    lastName: joi.string().min(3).trim().required().pattern(/^[A-Za-z\s]+$/).messages({
      'string.empty': 'last name is required',
      'string.min': 'last name must be at least 3 characters long',
      'string.pattern.base': 'last name can only contain letters'
    }),
    email: joi.string().email().trim().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    phone: joi.string().trim().pattern(/^[0-9]{11}$/).required().messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 11 digits',
    }),
    
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*#?&-])[A-Za-z\d@$!%_*#?&]{6,}$/).required().messages({
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, a number, and a special character (@$!%_*#?&)',
    }),
    // confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
    //   'any.only': 'Passwords do not match',
    //   'string.empty': 'Confirm password is required',
    // }),
    // profile: joi.optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: 'Validation error: ' + error.message
    });
  }

  next();
};


exports.verifyValidator = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    otp: joi.string().trim().required().messages({
      'string.empty': 'OTP is required',
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: 'Validation error: ' + error.message
    });
  }

  next();
};


exports.resendValidator = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      message: 'Validation error: ' + error.message
    });
  }

  next();
};

exports.updateProfileValidator = (req, res, next) => {
  const schema = joi.object({
    firstName: joi.string().min(3).trim().optional().pattern(/^[A-Za-z\s]+$/).messages({
        'string.min': 'First name must be at least 3 characters long',
        'string.pattern.base': 'First name can only contain letters'
    }),
    lastName: joi.string().min(3).trim().optional().pattern(/^[A-Za-z\s]+$/).messages({     
        'string.min': 'Last name must be at least 3 characters long',
        'string.pattern.base': 'Last name can only contain letters'
    }),
    phone: joi.string().trim().pattern(/^[0-9]{11}$/).optional().messages({
        'string.pattern.base': 'Phone number must be 11 digits',
    }),
    // profile: joi.optional()
  });   

    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return res.status(400).json({
        message: 'Validation error: ' + error.message
      });
    }   
    next();
};


exports.loginValidator = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({    
        'string.empty': 'Email is required',    
        'string.email': 'Please provide a valid email address',    
    }),    
    password: joi.string().required().messages({    
        'string.empty': 'Password is required',    
    })    
  });   
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error: ' + error.message
      });
    }
    next();
};
