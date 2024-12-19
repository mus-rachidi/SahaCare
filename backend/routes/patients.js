const express = require("express");
const router = express.Router();
const { getPatients, getPaymentSummary, addPatient, getPatientCounts, updatePatient, deletePatient, getPatientById, updatePatientAmountAndStatus, updateAllPatientData } = require("../controllers/patientsController");

router.get("/patients/", getPatients);
router.post("/patients/", addPatient);
router.put("/patients/:id", updatePatient);
router.put("/patients/:id/update-all", updateAllPatientData);  // New route for updating all patient data
router.delete("/patients/:id", deletePatient);
router.get("/patients/:id", getPatientById);
router.get("/counts", getPatientCounts);
router.put("/patients/:id/amount-status", updatePatientAmountAndStatus);
router.get("/payment-summary", getPaymentSummary);

module.exports = router;
