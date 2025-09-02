const express = require('express');
const router = express.Router();
const ownerModel = require('../models/ownerModel');
const productModel = require('../models/productModel');
const bcrypt = require('bcryptjs');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');
const upload = require('../config/multer');


const env = process.env.NODE_ENV || 'development';



if (env === 'development') {
    router.post("/create", async (req, res) => {
        try {
            let owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(400).send('Owner already exists');
            }

            let { fullname, email, password } = req.body;

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status(500).send('Error generating salt');
                }

                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(500).send('Error hashing password');
                    }

                    let createdOwner = await ownerModel.create({
                        fullname,
                        email,
                        password: hash
                    });
   
                    res.status(201);

                });
            })

        } catch (err) {
            res.status(500).send("Error creating owner: " + err.message);

        }
    });
}


router.get('/createProduct', isLoggedIn, isOwner, (req, res) => {
    res.render("createProduct", { user: req.user });
});



router.post('/createProducts', (req, res, next) => {
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'fullImage', maxCount: 1 },
        { name: 'zoomImage', maxCount: 1 },
        { name: 'designImage', maxCount: 10 },
        { name: 'watchVideos', maxCount: 1 },
        { name: 'Gallery', maxCount: 10 },
        { name: 'bestSellers', maxCount: 4 }
    ])(req, res, function (err) {
        if (err) {
            // Handle Multer errors (unexpected fields etc.)
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                console.error(`❌ Unexpected field: "${err.field}"`);
                return res.status(400).json({
                    success: false,
                    error: "Unexpected field",
                    field: err.field
                });
            }
            console.error("❌ Multer error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        next();
    });
}, async (req, res) => {

    try {

        let { name, nameDesc, price, category, caseSize, material, dimensions1, dimensions2,
            finishers, detail1, detail2, waterResistance, glass, strapName,
            strap1, strap2, quickReleaseSystem, size, buckles,
            designedForDetails
        } = req.body;

        const caseDetails = { caseSize, material, dimensions1, dimensions2, finishers, detail1, detail2, waterResistance, glass };
        const strapDetails = { strapName, strap1, strap2, quickReleaseSystem, size, buckles };


        //Handle single images
        const mainImage = req.files['mainImage']?.[0].filename || '';
        const fullImage = req.files['fullImage']?.[0].filename || '';
        const zoomImage = req.files['zoomImage']?.[0].filename || '';
        const bestSellers = req.files['bestSellers']?.[0].filename || '';

        //Handle single video
        const watchVideos = req.files['watchVideos']?.[0].filename || '';

        //Handle multile images
        const designedForArray = designedForDetails
            ? JSON.parse(designedForDetails).map((item, idx) => ({
                designName: item.designName || '',
                designValue: item.designValue || '',
                designDesc: item.designDesc || '',
                designImage: req.files['designImage']?.[idx]?.filename || ''
            })) : [];

        const galleryArray = req.files['Gallery']?.map(file => file.filename) || [];


        const createdProduct = await productModel.create({
            mainImage,
            fullImage,
            zoomImage,
            bestSellers,
            watchVideos,
            name,
            nameDesc,
            price,
            category,
            case: caseDetails,
            straps: strapDetails,
            designedForDetails: designedForArray,
            Gallery: galleryArray
        });

        await createdProduct.save();
        req.flash('success_msg', '✅ Product sucessfully created.');
        res.redirect('/');

    } catch (err) {
        console.error("❌ Product creation error:", err);

        // Check if it’s a mongoose validation error
        if (err.name === 'ValidationError') {
            for (let field in err.errors) {
                console.error(`⚠️ Validation failed for "${field}":`, err.errors[field].message);
            }
        }

        // Log incoming data for debugging
        // console.log("📩 Body received:", req.body);
        // console.log("📸 Files received:", Object.keys(req.files || {}));

        res.status(500).send('Error creating product: ' + err.message);
    }


});


module.exports = router;