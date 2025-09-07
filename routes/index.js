const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const loggedIn = require('../middlewares/isLoggedIn');
router.use(cookieParser());



router.get('/', async (req, res) => {
    const loggedIn = req.cookies.loggedIn === 'true';
    const isOwner = req.cookies.isOwner === 'true';

    let fiveProducts = await productModel.find().sort({_id: -1}).limit(5); // newest five product



    let bestSellersProducts = await productModel.find({
        bestSellers: { $exists: true, $ne: "" } //find that the bestSellers feild exists and it is not empty.
    });

   
    
    res.render("Index", { loggedIn, isOwner, fiveProducts , bestSellersProducts});
});


router.get("/cart", loggedIn, async (req, res) => {

    
    let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

    // console.log(user);
    res.render("Cart", { user });
})


// DELETE cart item
router.get('/removeFromCart/:productId', loggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash('error_msg', '⚠️ User not found');
            return res.redirect('/cart');
        }

        // Remove the item from the cart using filter that it can store only the products that are not equal to the req.params.productId
        user.cart = user.cart.filter(
            item => item.productId.toString() !== req.params.productId
        );

        await user.save();

        req.flash('success_msg', '✅ Item removed from cart successfully');
        res.redirect('/cart');
    } catch (err) {
        console.log(err.message);
        req.flash('error_msg', '⚠️ Something went wrong');
        res.redirect('/cart');
    }
});





router.get('/addtoCart/:productId', loggedIn, async (req, res) => {
    
    try{
        let user = await userModel.findOne({ email: req.user.email });
        console.log(user);
        let product = await productModel.findById(req.params.productId);
        console.log(product);

        if(!user || !product){
            req.flash('error_msg', '⚠️ Something went wrong');
            return res.redirect('/');
        }

        // check if already in cart
        let itemIndex = user.cart.findIndex(
            item => item.productId.toString() === product._id.toString()
        );

        if(itemIndex > -1){
            user.cart[itemIndex].quantity = (user.cart[itemIndex].quantity || 1) + 1;
        }
        else {
            user.cart.push({
                productId: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                mainImage: product.mainImage,
                quantity: 1
            })
        }

        await user.save();

        req.flash('success_msg', '✅ Product added to cart successfully');
        res.redirect(`/products/productDetail/${product._id}`);
    } catch (err) {
        console.log(err.message);
        req.flash('error_msg', '⚠️ Something went wrong');
        res.redirect('/');
    }

});




router.get('/cart/increase/:productId', loggedIn, async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const idx = user.cart.findIndex(it => it.productId.toString() === productId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Cart item not found' });

    user.cart[idx].quantity = (user.cart[idx].quantity || 1) + 1;

    await user.save();

    const item = user.cart[idx];
    const itemTotal = item.price * item.quantity;
    const subtotal = user.cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const shipping = 18; 
    const total = subtotal + shipping;

    const round = n => Number(n.toFixed(2));
    res.json({
      success: true,
      quantity: item.quantity,
      itemTotal: round(itemTotal),
      subtotal: round(subtotal),
      total: round(total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/cart/decrease/:productId', loggedIn, async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const idx = user.cart.findIndex(it => it.productId.toString() === productId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if ((user.cart[idx].quantity || 1) > 1) {
      // ✅ decrease only if > 1
      user.cart[idx].quantity = user.cart[idx].quantity - 1;
      await user.save();
    }


    const item = user.cart[idx];
    const itemTotal = item.price * item.quantity;
    const subtotal = user.cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const shipping = 18;
    const total = subtotal + shipping;

    const round = n => Number(n.toFixed(2));
    return res.json({
      success: true,
      quantity: item.quantity,     
      itemTotal: round(itemTotal),
      subtotal: round(subtotal),
      total: round(total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




router.get("/contactUs", (req, res) => {

    res.render("ContactUs");
})


router.get("/services", (req, res) => {

    res.render("Services");
})



router.get('/removeItem/:id', async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '✅ Item removed.');
    res.redirect('/');   
} catch (err) { 
    req.flash('error_msg', '⚠️ Erro while removing item.');
    console.error(err);
    res.redirect('/');   
  }
});


module.exports = router;