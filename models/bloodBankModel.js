const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  location:String,
  availableBloodBottles: [
    {
      bloodGroup: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      donationDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

module.exports = BloodBank;
