const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Define routes for services
router.get('/services', serviceController.getAllServices); // GET all services
router.get('/services/:id', serviceController.getServiceById); // GET a specific service by ID
router.post('/services', serviceController.addService); // Add a new service
router.put('/services/:id', serviceController.updateService); // Update an existing service
router.delete('/services/:id', serviceController.deleteService); // Delete a service

module.exports = router;
