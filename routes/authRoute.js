const express = require("express");
const {signup, login, forget, UpdateProfileController} = require("../controllers/authController")
const router = express.Router()
const {auth, isUser, isAdmin, test} = require('../middleware/authMiddleware')
const userModel = require('../models/userModel');

// creating signup route and login

router.post('/signup',signup)
router.post('/login',login)
router.post('/forget',forget)

//test route

router.get("/test", auth , (req, res) => {
    res.json({
        success: true,
        message: "welcome to protected route for test"
    })
})

// protected routes 

router.get('/user', auth, isUser, (req,res)=> {
    res.json({
        success: true,
        message: "This is protected route for the student"
    })
})

router.get('/admin', auth, isAdmin, (req,res)=> {
    res.json({
        success: true,
         ok: true,
        message: "This is protected route for the admin"
    })
})

router.put('/profile', auth, UpdateProfileController)

// Admin: Get all users
router.get('/all-users', auth, isAdmin, async (req, res) => {
  try {
    const users = await userModel.find({}, 'name email role');
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

module.exports = router;