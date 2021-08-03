const mongoose = require("mongoose");
const dotenv=require("dotenv");
const addProductSchema = new mongoose.Schema({
 
  name: {
    type:String,
    required: true,
  },
  Category: {
    type:String,
    required: true,
  },
  price: {
    type:Number,
    required: true,
  },
  countInStock: {
    type:Number,
    required: true,
  },
  brand: {
    type:String,
    required: true,
  },
  numReviews: {
    type:Number,
    required: true,
  },
  description: {
    type:String,
    required: true,
  },
  image:{
    type:String,
    required:true,
    
  },
  productReview:[
    {
        post:{
          type: String,
        },
        email:{
          type: String, 
        },
        date:{
          type: String, 
        },
        image: {
          type:String,
          required: true,
        },
        user_name:{
          type:String,
          required: true,
        }

    },

],
 

 
      /*name: 'Wheel Chair',
      category: 'Chair',
     // image:images05,
      price: 550,
      countInStock: 10,
      brand: 'Blandon',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      inCart:false,
      */
});
const Product = mongoose.model("PRODUCT", addProductSchema);
module.exports = Product;
