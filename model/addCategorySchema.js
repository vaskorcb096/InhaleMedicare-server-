const mongoose = require("mongoose");
const dotenv=require("dotenv");
const addCategorySchema = new mongoose.Schema({
 
  category: {
    type:String,
    required: true,
  },
 

 
});
const Category = mongoose.model("CATEGORY", addCategorySchema);
module.exports = Category;
