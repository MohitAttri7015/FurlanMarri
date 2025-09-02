const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')('development:mongoose');

mongoose.connect(`${config.get("MONGODB_URI") || 'mongodb://127.0.0.1:27017'}/ecommerce`)
.then(function(){
    dbgr("Connected to MongoDB");
})
.catch(function(err){
    dbgr("Error connecting to MongoDB:", err);
})

module.exports = mongoose.connection;