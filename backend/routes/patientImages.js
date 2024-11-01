const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
    getPatientImages,
    addPatientImage,
    deletePatientImage,
} = require('../controllers/patientImagesController');

const uploadDir = path.join(__dirname, '../public/images/upload');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

router.get('/:patientId/images', getPatientImages);
router.post('/images/', upload.single('file'), addPatientImage);
router.use('/medicalrecords/images', express.static(path.join(__dirname, '../public/images/upload')));
router.delete('/images', deletePatientImage); // Keep it as a separate route for better clarity
module.exports = router;
