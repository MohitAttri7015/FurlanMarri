const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ownerModel = require("../models/ownerModel");


module.exports = async function (req, res, next) {
    if(!req.cookies.token){
        req.flash("error_msg","you need to login first");
        return res.redirect('/users/login');
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        let user = await userModel.findOne({
            email: decoded.email
        }).select("-password");

        let owner = await ownerModel.findOne({ 
            email: decoded.email 
        }).select("-password");

        if (user){
            req.user = user;
            req.role = "user";
        } else if (owner){
            req.user = owner;
            req.role = "owner";
        } else{
            req.flash("error", "User not found");
            return res.redirect("/users/login");
        }


         if (req.role !== "owner") {
            req.flash("error_msg", "You are not authorized to access this page");
            return res.redirect("/");
        }

        next();

    } catch (err) {
        req.flash("error", "something went wrong, login again");
        res.redirect('/users/login');
    }
};