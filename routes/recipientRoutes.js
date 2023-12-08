// recipientRoutes.js
const express = require('express');
const { check, param } = require('express-validator');
const {
  addRecipient,
  updateRecipientById,
  getRecipientById,
  listRecipients,
  deleteRecipientById,
  //requestBloodBottles,
} = require('../controllers/recipientController');

const router = express.Router();

// Add a new recipient
router.post('/add', [
  check('userId').isMongoId(),
  check('name').notEmpty().isString(),
  check('aadharNumber').notEmpty().isString(),
], addRecipient);

// Update recipient by ID
router.put('/update/:recipientId', [
  param('recipientId').isMongoId().withMessage('Invalid recipientId'),
  check('name').optional().isString().withMessage('Name must be a string'),
  check('aadharNumber').optional().isString().withMessage('Aadhar Number must be a string'),
], updateRecipientById);

// Get recipient by ID
router.get('/get/:recipientId', getRecipientById);

// List recipients
router.get('/list', listRecipients);

// Delete recipient by ID
router.delete('/delete/:recipientId', deleteRecipientById);

// Request blood bottles
router.post('/requestBloodBottles/:recipientId', [
  param('recipientId').isMongoId().withMessage('Invalid recipientId'),
  check('bloodGroup').notEmpty().isString(),
  check('quantity').notEmpty().isInt().withMessage('Quantity must be an integer'),
]
// , requestBloodBottles
);

module.exports = {recipientRoutes : router};
