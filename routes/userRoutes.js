const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp } = require('../controller/userController');

router.post('/register', registerUser);



module.exports = router;