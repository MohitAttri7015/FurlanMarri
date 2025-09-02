const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  mainImage: { type: String, required: true },
  name: { type: String, required: true },
  nameDesc: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true},
  category: { type: String, required: true},
  fullImage: { type: String },
  watchVideos: { type: String },
  zoomImage: { type: String, required: true},

  case: {
    caseSize: { type: String },
    material: { type: String },
    dimensions1: { type: String },
    dimensions2: { type: String },
    finishers: { type: String },
    detail1: { type: String },
    detail2: { type: String },
    waterResistance: { type: String }, 
    glass: { type: String }           
  },

  straps: {
    strapName: { type: String },
    strap1: { type: String },
    strap2: { type: String },
    quickReleaseSystem: { type: String },
    size: { type: String },
    buckles: { type: String }
  },

  designedForDetails: [
    {
      designImage: { type: String, required: true }, 
      designName: { type: String, required: true },
      designValue: { type: String, required: true },
      designDesc: { type: String, required: true }
    }
  ],

  Gallery: {
    type: [String],
    required: false
  },

  bestSellers: { type: String, required: false }

});

module.exports = mongoose.model("product", productSchema);
