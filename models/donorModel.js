const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donationHistory: [
    {
      bloodGroup: String,
      donationDate: Date,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model('Donor', donorSchema);
