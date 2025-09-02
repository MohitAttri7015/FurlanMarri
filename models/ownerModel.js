const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    products: [{
        type: Array,
        default: []
    }]
});


module.exports = mongoose.model("owner", ownerSchema);