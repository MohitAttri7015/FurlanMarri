const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


module.exports = async function (req, res, next) {
    if(!req.cookies.token){
        req.flash("error_msg","❌ you need to login first");
        return res.redirect('/users/login');
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({
            email: decoded.email
        }).select("-password");

        req.user = user;

        next();
    } catch (err) {
        req.flash("error", "something went wrong, login again");
        res.redirect('/users/login');
    }
};