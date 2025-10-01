const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, getAllUsers,suspendUser,reactivateUser, deleteUser, updateUserProfile, getUserProfile, resendOtp, loginUser} = require('../controllers/userController');
const { registerValidator, verifyValidator, resendValidator, updateProfileValidator, loginValidator } = require('../middleware/validator');


//user routes
router.post('/register',registerValidator, registerUser);
router.post('/login',loginValidator, loginUser);
router.post('/verify-otp',verifyValidator, verifyOtp);
router.put('/update-profile',updateProfileValidator, updateUserProfile);
router.get('/profile', getUserProfile);
router.post('/resend-otp',resendValidator, resendOtp);




//admin route
router.get('/all-users', getAllUsers);
router.put('/suspend-user/:id', suspendUser);
router.put('/reactivate-user/:id', reactivateUser); 
router.delete('/delete-user/:id', deleteUser);






module.exports = router;