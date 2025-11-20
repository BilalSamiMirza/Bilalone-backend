const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  date: String,
  month: String,
  time: String,
  fullDate: Date // used for upcoming/history comparison
});

module.exports = mongoose.model("Appointment", appointmentSchema);
