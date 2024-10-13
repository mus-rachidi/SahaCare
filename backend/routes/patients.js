const express = require("express");
const router = express.Router();
const { getPatients, addPatient, getPatientCounts, updatePatient, deletePatient, getPatientById } = require("../controllers/patientsController");

router.get("/patients/", getPatients);
router.post("/patients/", addPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);
router.get("/patients/:id", getPatientById);
router.get("/counts", getPatientCounts);

module.exports = router;

