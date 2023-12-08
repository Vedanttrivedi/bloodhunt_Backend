const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodRequests: [
    {
      bloodGroup: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      requestDate: {
        type: Date,
        required: true,
      },
      fulfilled: {  
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
