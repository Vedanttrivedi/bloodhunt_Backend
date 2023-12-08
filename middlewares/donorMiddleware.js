const jwt = require('jsonwebtoken');
const Donor = require("../models/donorModel");
const User = require("../models/userModel");

async function verifyTokenToBook(req, res, next) {
  const token = req.headers.authorization;
  console.log("Received request with token:", token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, "874EWDISDK38EDUSKDJSKDJSD", async (err, decoded) => {
    if (err) {
      console.log("Unauthorized access attempt");
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const userId = decoded && decoded.userId; 
      if (!userId) {
        console.log("No user ID found in token payload");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.findById(userId);
      const donor = await Donor.findOne({ userId });

      console.log("user is "+user);

      if (!user || !donor) {
        console.log("User or donor not found");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.id = donor.id;
      req.user = user;
      req.donor = donor;
      console.log("Donor information:", req.donor);
      next();
    } catch (error) {
      console.error('Error in middleware:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}

module.exports = verifyTokenToBook;
