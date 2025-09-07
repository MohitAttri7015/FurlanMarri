const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Path = require('path');
const { registerUser, loginUser, logout, forgotPassword } = require('../controllers/authController');
router.use(cookieParser());


router.get('/SignUp', (req, res) => {
    const loggedIn = req.cookies.loggedIn || false;
    const isOwner = req.cookies.isOwner || false;

    
    res.render("SignUp", { loggedIn, isOwner });
});

router.post('/signup', registerUser);



router.get('/login', (req, res) => {
    const loggedIn = req.cookies.loggedIn || false;
    const isOwner = req.cookies.isOwner || false;
    res.render("Login", { loggedIn, isOwner });
});


router.get('/forgotPassword', (req, res) => {
    res.render("ForgotPassword");
})

router.post('/forgotPassword', forgotPassword)


router.post('/login', loginUser);

router.get('/logout', logout);


module.exports = router;