const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp, getAllUsers,suspendUser,reactivateUser, deleteUser} = require('../controller/userController');


//user routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);



//admin route
router.get('/all-users', getAllUsers);
router.put('/suspend-user/:id', suspendUser);
router.put('/reactivate-user/:id', reactivateUser); 
router.delete('/delete-user/:id', deleteUser);






module.exports = router;