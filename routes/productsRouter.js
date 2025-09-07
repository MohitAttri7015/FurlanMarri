const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

router.get('/productDetail/:id', async (req, res) => {
    try {
        let productId = req.params.id;

        const selectedProduct = await productModel.findById(productId);

        if (!selectedProduct) {
            return res.status(404).send('Product not found');
        }


        let randomTwoProducts = await productModel.aggregate([
            { $sample: { size: 2 } }
        ]);


        res.render('ProductDetail', { selectedProduct, randomTwoProducts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


router.get('/allWatches', async (req, res) => {
    try {

        const allProducts = await productModel.find();

        res.render('AllWatches', { allProducts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})


router.get('/allCollection', async (req, res) => {

    res.render('AllCollection');

})


router.get('/mechaquart', async (req, res) => {

    try {

        const onlyMechaquartz = await productModel.find({ category: "MECHAQUARTZ" });

        res.render('Mechaquartz', { onlyMechaquartz });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

})



router.get('/CornesDeVache', async (req, res) => {

    try {

        const CornesDeVaches = await productModel.find({ category: "CORNES DE VACHE" });

        res.render('CORNESDEVACHE', { CornesDeVaches });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

})



router.get('/DiscoVolante', async (req, res) => {

    try {

        const DiscoVolantes = await productModel.find({ category: "DISCO VOLANTE" });

        res.render('DiscoVolante', { DiscoVolantes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

})


module.exports = router;