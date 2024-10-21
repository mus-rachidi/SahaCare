const express = require("express");
const router = express.Router();
const { getPatients, addPatient, getPatientCounts, updatePatient, deletePatient, getPatientById, updatePatientAmountAndStatus} = require("../controllers/patientsController");

router.get("/patients/", getPatients);
router.post("/patients/", addPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);
router.get("/patients/:id", getPatientById);
router.get("/counts", getPatientCounts);
router.put('/patients/:id/amount-status', updatePatientAmountAndStatus);
module.exports = router;

