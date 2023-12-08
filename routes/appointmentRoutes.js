const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const verifyTokenToBook = require('../middlewares/donorMiddleware');

router.post('/appointments/', verifyTokenToBook,AppointmentController.createAppointment);

router.put('/appointments/:appointmentId', AppointmentController.updateAppointment);

router.get('/appointments/:appointmentId', AppointmentController.getAppointmentById);

router.get('/appointmentsList', verifyTokenToBook,AppointmentController.listAppointments);

router.delete('/appointments/:appointmentId', AppointmentController.deleteAppointment);

module.exports = { appointmentRoutes: router };