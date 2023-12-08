const Donor = require('../models/donorModel');
const { validationResult } = require('express-validator');

const addDonor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, name, aadharNumber, mobileNumber, donationHistory } = req.body;

    const existingDonor = await Donor.findOne({ userId });
    if (existingDonor) {
      return res.status(400).json({ error: 'Donor with the same userId already exists' });
    }

    const donor = new Donor({ userId, name, aadharNumber, mobileNumber, donationHistory, createdAt: new Date() });

    await donor.save();
    res.status(201).json({ message: 'Donor added successfully' });
  } catch (error) {
    console.error('Error while adding donor:', error);
    res.status(400).json({ error: 'Failed to add donor' });
  }
};

const updateDonor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, aadharNumber, mobileNumber, donationHistory } = req.body;
    const donorId = req.params.donorId; 

    const updatedDonor = await Donor.findByIdAndUpdate(
      donorId,
      {
        name,
        aadharNumber,
        mobileNumber,
        donationHistory,
        updatedAt: new Date(),
      },
      { new: true } 
    );

    if (!updatedDonor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor updated successfully' });
  } catch (error) {
    console.error('Error while updating donor:', error);
    res.status(400).json({ error: 'Failed to update donor' });
  }
};
const getDonorById = async (req, res) => {
  const donorId = req.params.donorId;

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json(donor);
  } catch (error) {
    console.error('Error while fetching donor:', error);
    res.status(400).json({ error: 'Failed to get donor' });
  }
};

const listDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    console.error('Error while listing donors:', error);
    res.status(400).json({ error: 'Failed to list donors' });
  }
};

const deleteDonor = async (req, res) => {
  const donorId = req.params.donorId;

  try {
    const deletedDonor = await Donor.findByIdAndDelete(donorId);
    if (!deletedDonor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error while deleting donor:', error);
    res.status(400).json({ error: 'Failed to delete donor' });
  }
};

module.exports = {
  addDonor,
  updateDonor,
  getDonorById,
  listDonors,
  deleteDonor,
};
