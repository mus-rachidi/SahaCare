// routes/doctors.js

const express = require('express');
const { 
    getAllDoctors, 
    getDoctorById, 
    createDoctor, 
    updateDoctor, 
    deleteDoctor,
    exportDoctorsToCSV,
    loginDoctor,
    changePassword
} = require('../controllers/doctorsController');

const router = express.Router();
router.put('/doctors/:id/change-password', changePassword);
router.get('/doctors/export', exportDoctorsToCSV);// GET all doctors
router.get('/doctors/', getAllDoctors);

// GET a specific doctor by ID
router.get('/doctors/:id', getDoctorById);

// POST a new doctor
router.post('/doctors/', createDoctor);

// PUT update a doctor by ID
router.put('/doctors/:id', updateDoctor);

// DELETE a doctor by ID
router.delete('/doctors/:id', deleteDoctor);
router.post('/doctors/login', loginDoctor);
module.exports = router;
