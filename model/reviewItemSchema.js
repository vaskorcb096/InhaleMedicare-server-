const mongoose = require("mongoose");
const dotenv = require("dotenv");
const revieItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
 
  description: {
    type: String,
    required: true,
  },
  date: {
    type:String,
    required: true,
    
  },
  image: {
    type:String,
    required: true,
  },
  user_name: {
    type:String,
    required: true,
  },
  
});
const Review = mongoose.model("REVIEW", revieItemSchema);
module.exports = Review;
