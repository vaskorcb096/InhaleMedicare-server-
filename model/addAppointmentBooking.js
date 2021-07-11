const mongoose = require("mongoose");
const dotenv = require("dotenv");
const appointmentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },

  preferredDoctors:{
    type: String,
    required: true,
  },
  purposeOfAppointment:{
    type: String,
    required: true, 
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
const Appointment = mongoose.model("APPOINTMENT", appointmentSchema);
module.exports = Appointment;
