const jwt = require('jsonwebtoken');
const Recipient = require("../models/recipientModel");
const User = require("../models/userModel");

async function verifyTokenToRequest(req, res, next) {
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
      const recipent = await Recipient.findOne({ userId });

      console.log("user is "+user);

      if (!user || !recipent) {
        console.log("User or Reciepent not found");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.id = recipent.id;
      req.user = user;
      req.resp = recipent;
      console.log("Recipent information:", req.resp);
      next();
    } catch (error) {
      console.error('Error in middleware:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}

module.exports = verifyTokenToRequest;
