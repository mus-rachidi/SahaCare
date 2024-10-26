// routes/appointments.js
const express = require('express');
const {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentsController.js');

const router = express.Router();

// Routes for appointments
router.get('/appointments/', getAppointments);
router.post('/appointments/', addAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;
