const express = require("express");
const { getMedicines, createMedicine, updateMedicine, deleteMedicine } = require("../controllers/medicinesControllers");

const router = express.Router();

// Get all medicines
router.get("/medicines", getMedicines);

// Create a new medicine
router.post("/medicines", createMedicine);

// Update a medicine
router.put("/medicines/:id", updateMedicine);

// Delete a medicine
router.delete("/medicines/:id", deleteMedicine);

module.exports = router;
