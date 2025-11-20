// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
