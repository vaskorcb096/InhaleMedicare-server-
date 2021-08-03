const mongoose = require("mongoose");
const dotenv=require("dotenv");
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});
const Admin = mongoose.model("ADMIN", adminSchema);
module.exports = Admin;
