const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');
const transporter = require('../config/email');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');


module.exports.registerUser = async function (req, res) {
    try {
        let { firstName, lastName, email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash('error_msg', '⚠️ User already exists, please log in.');
            return res.redirect('/users/login');
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).send('Error generating salt');
            }


            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).send('Error hashing password');
                }


                await userModel.create({
                    firstName,
                    lastName,
                    email,
                    password: hash
                });


                req.flash('success_msg', '✅ Account created successfully! Now you can login.');
                res.redirect('/users/login');
            })
        })
    } catch (err) {
        res.send(err.message);
    }

};


module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        let owner = await ownerModel.findOne({ email: email });
        if (owner) {
            let isMatch = await bcrypt.compare(password, owner.password);
            if (!isMatch) {
                req.flash('error_msg', '❌ Incorrect password.');
                return res.redirect('/users/login');
            }

            let token = generateToken(owner);
            res.cookie('token', token, { httpOnly: true });
            res.cookie('loggedIn', 'true', { httpOnly: false });
            res.cookie('isOwner', 'true', { httpOnly: false });

            req.flash('success_msg', '👑 Welcome back, Owner!');
            return res.redirect('/');
        }


        let user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash('error_msg', '❌ No account found with this email.');
            return res.redirect('/users/SignUp');
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', '❌ Incorrect password.');
            return res.redirect('/users/login')
        }

        let token = generateToken(user);
        res.cookie('token', token, { httpOnly: true }); //JavaScript on the client cannot read this cookie, making it safer against XSS attacks.
        res.cookie('loggedIn', 'true', { httpOnly: false });
        res.cookie('isOwner', 'false', { httpOnly: false });

        req.flash('success_msg', '🎉 Welcome back!');
        res.redirect('/');

    } catch (err) {
        res.send(err.message);
    }
};


module.exports.logout = async (req, res) => {
    res.cookie('token', '', { httpOnly: true, maxAge: 0 });
    res.cookie('loggedIn', 'false', { httpOnly: false, maxAge: 0 });
    res.cookie('isOwner', 'false', { httpOnly: false, maxAge: 0 });
    req.flash('success_msg', '👋 You have successfully logged out. See you again soon!');
    res.redirect('/');
};



module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) return req.flash('error_msg', '❌ email not found');

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetCode = code;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");



        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your reset code is: ${code}`
        });


        req.flash('success_msg', '✅ Code is sent to your email');
        res.redirect('/users/login');
    }

    catch (err) {
        console.error(err);
        req.flash('error_msg', '❌ Failed to send email. Try again.');
        res.redirect('/users/login');
    }

};