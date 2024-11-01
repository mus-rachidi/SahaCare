const express = require("express");
const { getMedicines, createMedicine, updateMedicine, deleteMedicine } = require("../controllers/medicinesControllers");

const router = express.Router();

router.get("/medicines", getMedicines);
router.post("/medicines", createMedicine);
router.put("/medicines/:id", updateMedicine);
router.delete("/medicines/:id", deleteMedicine);

module.exports = router;
