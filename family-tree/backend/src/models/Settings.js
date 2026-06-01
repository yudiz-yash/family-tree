const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  qrCodeImage: { type: String, default: '' },
  paymentAmount: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
