const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const Doctor = mongoose.model("DOCTOR", DoctorSchema);
module.exports = Doctor;
