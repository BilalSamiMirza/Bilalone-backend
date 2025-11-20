const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // Update Profile
// router.put('/update-profile', async (req, res) => {
//   try {
//     const { email, name, currentPassword, newPassword } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // If changing password, verify current password first
//     if (newPassword) {
//       if (!currentPassword) {
//         return res.status(400).json({ message: 'Current password is required to change password' });
//       }
      
//       const isCurrentPasswordValid = await user.comparePassword(currentPassword);
//       if (!isCurrentPasswordValid) {
//         return res.status(400).json({ message: 'Current password is incorrect' });
//       }

//       // Update password - this will trigger the pre-save hook to hash it
//       user.password = newPassword;
//     }

//     // Update name
//     if (name) user.name = name;

//     // Save updated user
//     await user.save();

//     res.status(200).json({ 
//       message: 'Profile updated successfully', 
//       user: { 
//         name: user.name, 
//         email: user.email
//       } 
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });
// module.exports = router;


// Update Profile - EXPLICIT VERSION
router.put('/update-profile', async (req, res) => {
  try {
    const { email, name, currentPassword, newPassword } = req.body;

    console.log('Update request received:', { email, name });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store original values for comparison
    const originalName = user.name;
    let updatesMade = false;

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      updatesMade = true;
      console.log('Password will be updated');
    }

    // Update name if changed
    if (name && name !== originalName) {
      user.name = name;
      updatesMade = true;
      console.log('Name updated from', originalName, 'to', name);
    }

    if (!updatesMade) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    // Save updated user
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser.name);

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: { 
        name: savedUser.name, 
        email: savedUser.email
      } 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;