// // GET /api/user/profile
// app.get('/api/user/profile', async (req, res) => {
//   try {
//     const userId = req.userId; // get from auth token if needed
//     const user = await user.findById(userId); // Mongoose
//     if (!user) return res.status(404).json({ message: 'User not found' });
    
//     res.json({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       address: user.address,
//       patientId: user.patientId
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// GET /api/auth/getUserByEmail?email=...
app.get('/api/auth/getUserByEmail', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }); // MongoDB query
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
