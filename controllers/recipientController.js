// recipientController.js
const Recipient = require('../models/recipientModel');
//const BloodBank = require('../models/bloodBankModel');

// Add a new recipient
// const addRecipient = async (req, res) => {
//   try {
//     const { userId, name, aadharNumber } = req.body;
//     const recipient = new Recipient({ userId, name, aadharNumber });
//     await recipient.save();
//     res.status(201).json({ message: 'Recipient added successfully', recipient });
//   } catch (error) {
//     console.error('Error adding recipient:', error);
//     res.status(500).json({ error: 'Error adding recipient' });
//   }
// };
const addRecipient = async (req, res) => {
    try {
      const { userId, name, aadharNumber } = req.body;
  
      // Check if the recipient already exists
      const existingRecipient = await Recipient.findOne({ userId });
      if (existingRecipient) {
        return res.status(400).json({ error: 'Recipient already exists' });
      }
  
      const recipient = new Recipient({ userId, name, aadharNumber });
      await recipient.save();
      res.status(201).json({ message: 'Recipient added successfully', recipient });
    } catch (error) {
      console.error('Error adding recipient:', error);
      res.status(500).json({ error: 'Error adding recipient' });
    }
  };

// Update recipient by ID
const updateRecipientById = async (req, res) => {
  try {
    const { name, aadharNumber } = req.body;
    const recipientId = req.params.recipientId;
    const recipient = await Recipient.findByIdAndUpdate(
      recipientId,
      { name, aadharNumber, updatedAt: new Date() },
      { new: true }
    );
    if (recipient) {
      res.status(200).json({ message: 'Recipient updated successfully', recipient });
    } else {
      res.status(404).json({ error: 'Recipient not found' });
    }
  } catch (error) {
    console.error('Error updating recipient:', error);
    res.status(500).json({ error: 'Error updating recipient' });
  }
};

// Get recipient by ID
const getRecipientById = async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const recipient = await Recipient.findById(recipientId);
    if (recipient) {
      res.status(200).json({ recipient });
    } else {
      res.status(404).json({ error: 'Recipient not found' });
    }
  } catch (error) {
    console.error('Error getting recipient:', error);
    res.status(500).json({ error: 'Error getting recipient' });
  }
};

// List all recipients
const listRecipients = async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.status(200).json({ recipients });
  } catch (error) {
    console.error('Error listing recipients:', error);
    res.status(500).json({ error: 'Error listing recipients' });
  }
};

// Delete recipient by ID
const deleteRecipientById = async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const recipient = await Recipient.findByIdAndDelete(recipientId);
    if (recipient) {
      res.status(200).json({ message: 'Recipient deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recipient not found' });
    }
  } catch (error) {
    console.error('Error deleting recipient:', error);
    res.status(500).json({ error: 'Error deleting recipient' });
  }
};

//  Request blood bottles
// const requestBloodBottles = async (req, res) => {
//   try {
//     const recipientId = req.params.recipientId;
//     const { bloodGroup, quantity } = req.body;

//     // Check if the blood bottles are available in the blood bank
//     const bloodBank = await BloodBank.findOne({ 'availableBloodBottles.bloodGroup': bloodGroup });
//     if (!bloodBank) {
//       return res.status(404).json({ error: 'Blood group not available in the blood bank' });
//     }

//     // Check if the requested quantity is available
//     const availableBottles = bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup).quantity;
//     if (quantity > availableBottles) {
//       return res.status(400).json({ error: 'Requested quantity not available in the blood bank' });
//     }

//     // Update blood bank inventory
//     bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup).quantity -= quantity;
//     await bloodBank.save();

//     // Update recipient's bloodRequests
//     const requestDate = new Date();
//     await Recipient.findByIdAndUpdate(
//       recipientId,
//       {
//         $push: {
//           bloodRequests: {
//             bloodGroup,
//             quantity,
//             requestDate,
//             fulfilled: false,
//           },
//         },
//       },
//       { new: true }
//     );

//     res.status(200).json({ message: 'Blood bottle request successful' });
//   } catch (error) {
//     console.error('Error requesting blood bottles:', error);
//     res.status(500).json({ error: 'Error requesting blood bottles' });
//   }
// };

module.exports = {
  addRecipient,
  updateRecipientById,
  getRecipientById,
  listRecipients,
  deleteRecipientById,
  //requestBloodBottles,
};
