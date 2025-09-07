const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const {connectDB} = require('./config/mongooseConnection');
const expressSession = require('express-session');
const flash = require('connect-flash');
const index = require('./routes/index');
const ownerRouter = require('./routes/ownerRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const isLoggedIn = require('./middlewares/isLoggedIn');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
require('dotenv').config();


(async () => {
  await connectDB();              
  app.listen(3000, () => {
    console.log("Server running on 3000");
  });
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
  })
);
app.use(flash());
const userModel = require('./models/userModel');

app.use(async (req, res, next) => {
  // console.log('loggedIn:', req.cookies.loggedIn, 'isOwner:', req.cookies.isOwner);
  res.locals.loggedIn = req.cookies.loggedIn === 'true';
  res.locals.isOwner = req.cookies.isOwner === 'true';
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  try {
    const token = req.cookies.token;

    if (token) {
      const decode = jwt.verify(token, process.env.JWT_KEY);

      const currentUser = await userModel.findById(decode.id).populate("cart");

      req.user = currentUser;
      res.locals.user = currentUser;
      // console.log("✅ Logged in as:", currentUser?.email);

    } else {
      req.user = null;
      res.locals.user = null;
    }

  } catch (err){
    console.error("❌ JWT Error:", err.message);
    req.user = null;
    res.locals.user = null;
  }
   
  next();
});

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/owners', ownerRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);