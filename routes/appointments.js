// // Add appointment
// router.post("/add", async (req, res) => {
//   try {
//     const { date, doctor, time } = req.body;

//     const newAppointment = new Appointment({
//       date,
//       doctor,
//       time
//     });

//     await newAppointment.save();

//     res.json({ success: true, message: "Appointment Saved!" });

//   } catch (error) {
//     console.log("Appointment Add Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


// import express from "express";
// import Appointment from "../models/Appointment.js";

// const router = express.Router();

// Create new appointment with clash check
// const express = require("express");
// const router = express.Router();
// const Appointment = require("../models/Appointment");

// router.post("/add", async (req, res) => {
//   try {
//     const { doctor, date, month, time } = req.body;

//     // Check if doctor is already booked at same date+time
//     const exists = await Appointment.findOne({ doctor, date, month, time });

//     if (exists) {
//       return res.json({
//         success: false,
//         message: "Doctor is already booked for this time."
//       });
//     }

//     // Otherwise create appointment
//     await Appointment.create({ doctor, date, month, time });

//     res.json({
//       success: true,
//       message: "Appointment booked successfully!"
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// module.exports = router;


// // Get all appointments
// router.get("/get", async (req, res) => {
//   try {
//     const data = await Appointment.find().sort({ _id: -1 });
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// app.delete('/appointments/delete', async (req, res) => {
//   try {
//     const { id } = req.body;
//     // Delete logic here
//     res.json({ success: true, message: "Appointment deleted" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// });



// app.put('/appointments/update', async (req, res) => {
//   try {
//     const { id, date, doctor, time } = req.body;
//     // Update logic here
//     res.json({ success: true, message: "Appointment updated" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// });




const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Add appointment
router.post("/add", async (req, res) => {
  try {
    const { doctor, date, month, time } = req.body;

    // Check if doctor is already booked at same date+time
    const exists = await Appointment.findOne({ doctor, date, month, time });

    if (exists) {
      return res.json({
        success: false,
        message: "Doctor is already booked for this time."
      });
    }

    // Otherwise create appointment
    await Appointment.create({ doctor, date, month, time });

    res.json({
      success: true,
      message: "Appointment booked successfully!"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Get all appointments
router.get("/get", async (req, res) => {
  try {
    const data = await Appointment.find().sort({ _id: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete appointment
router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    
    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: "Appointment deleted successfully" 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update appointment
router.put("/update", async (req, res) => {
  try {
    const { id, date, doctor, time } = req.body;
    
    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }

    // Check for conflicts with other appointments (excluding current one)
    const existingAppointment = await Appointment.findOne({
      doctor,
      date,
      time,
      _id: { $ne: id } // exclude current appointment
    });

    if (existingAppointment) {
      return res.json({
        success: false,
        message: "Doctor is already booked for this time slot."
      });
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { doctor, date, time },
      { new: true } // return updated document
    );

    res.json({ 
      success: true, 
      message: "Appointment updated successfully",
      data: updatedAppointment
    });
  } catch (error) {
    console.error("Update error:", error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;