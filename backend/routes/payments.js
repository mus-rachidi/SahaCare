const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/payments', paymentController.getAllPayments);

// Get a payment by ID
router.get('/payments/:id', paymentController.getPaymentById);

// Create a new payment
router.post('/payments', paymentController.createPayment);

// Update payment status (e.g., mark as Paid or Cancelled)
router.put('/payments/:id', paymentController.updatePaymentStatus);

// Delete a payment
router.delete('/payments/:id', paymentController.deletePayment); // Added deletePayment route

module.exports = router;
