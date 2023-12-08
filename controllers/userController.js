const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/userModel'); // Import the User model
const Donor = require('../models/donorModel');
const Recipient = require('../models/recipientModel');
// User registration logic
const registerUser = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  console.log("request recieved");
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract user data from the request
  const { username, password, email, userType,phone ,bloodGroup} = req.body;

  try {
    // Check if a user with the same email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if a user with the same username already exists
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res.status(400).json({ error: 'User with this username already exists' });
    }
    const exitstingPhoneUser = await User.findOne({ phone });
    
    if (exitstingPhoneUser) {
      return res.status(400).json({ error: 'User with this phone no already exists' });
    }

    console.log("hello world2");
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);
    
    // Create a new user instance
    const user = new User({ username, password: hashedPassword, email, userType ,phone,bloodGroup});
    await user.save();
    if(userType=="Donor")
    {
      const donor = new Donor({ userId: user._id, donationHistory: [] });
      donor.save();
    }
    else
    {
      const recp = new Recipient({userId:user._id,bloodRequests:[]});
      recp.save();
    }
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

    res.status(200).json({ "token":token,"message":"Register Succeful" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
};

// User login logic
const loginUser = async (req, res) => {
  // Extract login credentials from the request
  const { username, password } = req.body;

  try {
    // Find the user by username
    const User = mongoose.model('User');
    const user = await User.findOne({ username });

    // If the user does not exist, return an error
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate a JWT token for the user using the configured secret key and expiration time
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

    const data = {
      "token":token,
      "userType":user.userType
    };

    res.status(200).json({data});
    //const token = generateToken(user._id);

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};


const getUserType = async (req, res) => {
  const userId = req.userId; 
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userType = user.userType; // Assuming userType is a property in your User model
    res.status(200).json({ userType });
  } catch (error) {
    console.error('Error getting user type:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


const getUserById = async (req, res) => {
  const { jwt: token, userType } = req.body;
  console.log("this userid function is called");
  try {
    // Verify the JWT token
    const decoded = await jwt.verify(token, config.jwtSecret); // Replace 'your_secret_key' with your actual secret key

    // Find the user based on the decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the donor associated with the user
  
    if(userType=="Donor")
    {
      const donor = await Donor.findOne({ userId: user.userId }).populate('userId', 'username email phone'); // Adjust population fields as needed
      res.status(200).json({ user, donor, message: 'User and donor retrieved successfully' });
    }
    else
    {
      console.log("user id"+decoded.userId);
      const recp = await Recipient.findOne({ userId: decoded.userId }); 
      console.log("reciepent information");
      console.log(recp);
      res.status(200).json({ user,recp, message: 'User and donor retrieved successfully' });
      
    }
  } catch (error) {
    console.error('Error while fetching donor:', error);
    res.status(400).json({ error: 'Failed to get donor' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUserById
};
