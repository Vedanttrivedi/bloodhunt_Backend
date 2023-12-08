

const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/register', [
  check('username').notEmpty().isString(),
  check('password').notEmpty().isString(),
  check('email').notEmpty().isEmail(),
  check('userType').notEmpty().isIn(['Donor', 'Reciepent', 'Admin']),
  
], registerUser);

router.post('/login', loginUser);
router.post('/getUser', getUserById);


module.exports = { userRoutes: router };
