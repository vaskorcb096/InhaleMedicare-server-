const mongoose = require("mongoose");
const dotenv=require("dotenv");
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  
  },
  llink: {
    type: String,
    required: true,
  },
})
const Service = mongoose.model("SERVICESEC", serviceSchema);
module.exports = Service;
