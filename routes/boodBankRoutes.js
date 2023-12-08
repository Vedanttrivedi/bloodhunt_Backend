const express = require('express');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const { addBloodBottles, updateBloodBottles,addBloodBanks, requestBlood } = require('../controllers/bloodBankController');
const reciepent = require("../models/recipientModel");
const router = express.Router();
const verifyTokenToRequest = require('../middlewares/recipentmiddleware');
//add blood bank
router.post('/add',addBloodBanks);
// Route for donor to donate blood
router.post('/donateBlood', [
  check('bloodGroup').notEmpty().isString(),
  check('quantity').notEmpty().isInt().withMessage('Quantity must be an integer'),
], async (req, res) => {
  const { bloodGroup, quantity } = req.body;

  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add blood bottles to the inventory
    await addBloodBottles([{ bloodGroup, quantity }]);
    res.status(201).json({ message: 'Blood donated successfully' });
  } catch (error) {
    console.error('Error donating blood:', error);
    res.status(500).json({ error: 'Failed to donate blood' });
  }
});

// Route for recipient to receive blood
const Recipient = require('../models/recipientModel'); 

router.post('/receiveBlood', [
  check('bloodGroup').notEmpty().isString(),
  check('quantity').notEmpty().isInt().withMessage('Quantity must be an integer'),
], verifyTokenToRequest,requestBlood );


module.exports = {bloodBankRoutes :router};
