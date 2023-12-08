const BloodBank = require('../models/bloodBankModel');

// Add blood bottles to the inventory
const requestBlood = async (req, res) => {
  const { bloodGroup, quantity, location } = req.body;
  const recipientId = req.id; // Assuming req.id contains the recipient's ID
  console.log("recienpent id "+recipientId);
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Update blood bottles in the inventory
    const updateSuccessful = await updateBloodBottles(bloodGroup, quantity);

    if (updateSuccessful) {
      // Update the recipient model
      const recipient = await Recipient.findById(recipientId);

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }
      console.log("after calling");
      // Add the received blood data to the recipient's bloodRequests array
      recipient.bloodRequests.push({
        bloodGroup,
        quantity,
        requestDate: new Date(), // Add the request date
        fulfilled: true, // Assuming the blood is received/fulfilled upon updating
      });
      console.log("after pushing");
      // Save the updated recipient data
      await recipient.save();

      res.status(201).json({ message: 'Blood received successfully' });
    } else {
      res.status(400).json({ error: 'Failed to receive blood. Check available quantity and blood group.' });
    }
  } catch (error) {
    console.error('Error receiving blood:', error);
    res.status(500).json({ error: 'Failed to receive blood' });
  }
}
const addBloodBottles = async (bloodData) => {
  try {
    const bloodBank = await BloodBank.findOne(); // Assuming there's only one record in the blood bank
    if (bloodBank) {
      // Iterate through the provided blood data
      bloodData.forEach(({ bloodGroup, quantity }) => {
        const existingBottle = bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup);

        if (existingBottle) {
          // Update the quantity and donation date
          existingBottle.quantity += quantity;
          existingBottle.donationDate = new Date();
        } else {
          // Add a new blood bottle
          bloodBank.availableBloodBottles.push({
            bloodGroup,
            quantity,
            donationDate: new Date(),
          });
        }
      });

      bloodBank.updatedAt = new Date();
      await bloodBank.save();
      console.log('Blood bottles added to the inventory successfully');
    }
  } catch (error) {
    console.error('Error adding blood bottles to the inventory:', error);
  }
};

// Update blood bottle quantity in the inventory
const updateBloodBottles = async (bloodGroup, quantity) => {
  try {
    const bloodBank = await BloodBank.findOne(); // Assuming there's only one record in the blood bank
    if (bloodBank) {
      const existingBottle = bloodBank.availableBloodBottles.find(bottle => bottle.bloodGroup === bloodGroup);

      if (existingBottle) {
        if (existingBottle.quantity >= quantity) {
          // Update the quantity and donation date
          existingBottle.quantity -= quantity;
          existingBottle.donationDate = new Date();

          bloodBank.updatedAt = new Date();
          await bloodBank.save();
          console.log('Blood bottles updated in the inventory successfully');
          return true; // Successfully updated
        } else {
          console.log('Not enough quantity available for the requested blood group');
          return false; // Insufficient quantity
        }
      } else {
        console.log('Blood group not found in the inventory');
        return false; // Blood group not found
      }
    }
  } catch (error) {
    console.error('Error updating blood bottles in the inventory:', error);
    return false; // Error updating
  }
};

// Controller function to add blood banks
const addBloodBanks = async (req, res) => {
  console.log("request recieved");
  try {
    const bloodBanksToAdd = req.body;

    // Using insertMany to add multiple blood banks at once
    const addedBloodBanks = await BloodBank.insertMany(bloodBanksToAdd);

    res.status(201).json({ success: true, data: addedBloodBanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  addBloodBottles,
  updateBloodBottles,
  addBloodBanks,requestBlood
};
