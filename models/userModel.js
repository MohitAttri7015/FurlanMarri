const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        name: { type: String },
        category: { type: String},
        price: { type: mongoose.Schema.Types.Decimal128 },
        mainImage: { type: String },
        quantity: { type: Number, default: 1 }
    }],
    orders: {
        type: Array,
        default: []
    },
    resetCode: String,
    resetCodeExpire: Date

})


module.exports = mongoose.model("user", userSchema);