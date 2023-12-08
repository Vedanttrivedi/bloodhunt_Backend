const Donor =require('../models/donorModel');
const Appointment = require('../models/appointmentModel');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {appointmentDate, location} = req.body;
    const currentDate = new Date();

    if (appointmentDate < currentDate) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past' });
    }

    // Check if the user already has an appointment at the given time
    const existingAppointment = await Appointment.findOne({
      donorId:req.donor._id,
      status: 'pending',
      appointmentDate: { $gte: currentDate },
      requestedDate:currentDate
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'User already has a pending appointment' });
    }

    const appointment = new Appointment({
      donorId:req.id,
      requestedDate:currentDate,
      appointmentDate:appointmentDate,
      location:location,
      description:"booked"
    });
    const donor = await Donor.findById(req.id);
    const newAppointment = {
      bloodGroup: donor.bloodGroup, // Assuming bloodGroup is stored in the donor document
      donationDate: appointmentDate,
    };
  
    donor.donationHistory.push(newAppointment);
  
    await donor.save();
    await appointment.save();
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    console.error('Error while creating appointment:', error);
    res.status(400).json({ error: 'Failed to create appointment' });
  }
};

// Update an existing appointment
const updateAppointment = async (req, res) => {
  try {
    const { donorId, requestedDate, status, appointmentDate, location, description, adminId } = req.body;
    const appointmentId = req.params.appointmentId; // Extract the appointment's ID from the URL
    const currentDate = new Date();

    if (appointmentDate < currentDate) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past' });
    }

    // Check if the user already has an appointment at the given time
    const existingAppointment = await Appointment.findOne({
      donorId,
      status: 'pending',
      appointmentDate: { $gte: currentDate },
      _id: { $ne: appointmentId }, // Exclude the current appointment
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'User already has a pending appointment' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        donorId,
        requestedDate,
        status,
        appointmentDate,
        location,
        description,
        adminId,
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error while updating appointment:', error);
    res.status(400).json({ error: 'Failed to update appointment' });
  }
};


// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error while fetching appointment:', error);
    res.status(400).json({ error: 'Failed to get appointment' });
  }
};

// List all appointments
const listAppointments = async (req, res) => {
  try {
    const donorId = req.id; 
    console.log("list appointments called");
    const appointments = await Appointment.find({ donorId: donorId })
      .sort({ appointmentDate: 1 }); // Sort by appointmentDate in ascending order
    console.log(appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error while listing appointments:', error);
    res.status(400).json({ error: 'Failed to list appointments' });
  }
};
//add bloo
// Delete an appointment
const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error while deleting appointment:', error);
    res.status(400).json({ error: 'Failed to delete appointment' });
  }
};


module.exports = {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  listAppointments,
  deleteAppointment,
};
