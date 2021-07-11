const mongoose = require("mongoose");
const dotenv=require("dotenv");
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
const Contact = mongoose.model("CONTACT", contactSchema);
module.exports = Contact;
