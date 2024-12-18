const express = require('express');
const router = express.Router();

const {
    getMedicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} = require('../controllers/medicalrecordsController');

router.get('/medicalrecords', getMedicalRecords);
router.post('/medicalrecords', addMedicalRecord);
router.put('/medicalrecords/:id', updateMedicalRecord);
router.delete('/medicalrecords/:id', deleteMedicalRecord);



module.exports = router;
