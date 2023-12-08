const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { userRoutes } = require('./routes/userRoutes');
const { donorRoutes } = require('./routes/donorRoutes'); // Import Donor Routes
const config = require('./config'); // Import the config file
const { appointmentRoutes } = require('./routes/appointmentRoutes');
const { recipientRoutes } = require('./routes/recipientRoutes'); // Import recipientRoutes
const { bloodBankRoutes } = require('./routes/boodBankRoutes');
const cors = require('cors');
const app = express();
const net = require("net");
mongoose.connect(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/donor', donorRoutes); 
app.use('/appointment',appointmentRoutes); 
app.use('/recipient', recipientRoutes); // Use the recipient routes
app.use('/bloodBank', bloodBankRoutes);


const PORT = config.port; 

const  server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(server.address());
});
