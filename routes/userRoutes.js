const express = require('express');
const router = express.Router();

const { registerUser, verifyOtp, getAllUsers,suspendUser,reactivateUser, deleteUser, updateUserProfile, getUserProfile, resendOtp, loginUser, forgotPassword, changePassword, getuserById, dashboard} = require('../controllers/userController');
const { registerValidator, verifyValidator, resendValidator, updateProfileValidator, loginValidator } = require('../middleware/validator');


//user routes
router.post('/register',registerValidator, registerUser);
router.post('/verify-otp',verifyValidator, verifyOtp);
router.post('/login',loginValidator, loginUser);
router.get('/dashboard', dashboard )
router.put('/update-profile',updateProfileValidator, updateUserProfile);
router.get('/profile', getUserProfile);
router.post('/resend-otp',resendValidator, resendOtp);
router.post('/forgot-password',resendValidator, forgotPassword); 
router.put('/change-password',loginValidator, changePassword);




//admin route
router.get('/user/:id', getuserById);
router.get('/all-users', getAllUsers);
router.put('/suspend-user/:id', suspendUser);
router.put('/reactivate-user/:id', reactivateUser); 
router.delete('/delete-user/:id', deleteUser);




module.exports = router;