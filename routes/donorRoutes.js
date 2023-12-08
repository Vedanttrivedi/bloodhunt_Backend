const express = require('express');
const { check,param } = require('express-validator');
const { updateDonor,getDonorById,listDonors,deleteDonor,addDonor} = require('../controllers/donorController');

const router = express.Router();

// Add a new donor
router.post('/add', [
  check('userId').isMongoId(),
  check('name').notEmpty().isString(),
  check('aadharNumber').notEmpty().isString(),
  check('mobileNumber').notEmpty().isString(),
], addDonor);

router.put('/update/:donorId', [
  param('donorId').isMongoId().withMessage('Invalid donorId'),
  check('name').optional().isString().withMessage('Name must be a string'),
  check('aadharNumber').optional().isString().withMessage('Aadhar Number must be a string'),
  check('mobileNumber').optional().isString().withMessage('Mobile Number must be a string'),
], updateDonor);

// Delete Donor
router.delete('/delete/:donorId', deleteDonor);

// List Donors
router.get('/list', listDonors);

// Get Donor by ID
router.get('/get/:donorId', getDonorById);


module.exports = { donorRoutes: router };
