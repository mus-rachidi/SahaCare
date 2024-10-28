const express = require('express');
const {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    checkTimeSlot
} = require('../controllers/appointmentsController.js');

const router = express.Router();

router.get('/appointments/', getAppointments);
router.post('/appointments/', addAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);
router.get('/appointments/check', checkTimeSlot);

module.exports = router;
