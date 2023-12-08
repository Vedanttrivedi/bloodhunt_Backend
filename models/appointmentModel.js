const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  requestedDate: Date,
  status: String,
  appointmentDate: Date,
  location: String,
  description: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; // Export the Appointment model
