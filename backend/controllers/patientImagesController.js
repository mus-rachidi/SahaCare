const { promisePool } = require('../config/db');


const getPatientImages = async (req, res) => {
    const { patientId } = req.params;
    try {
        const [rows] = await promisePool.query('SELECT * FROM patient_images WHERE patient_id = ?', [patientId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patient images', details: error.message });
    }
};

const addPatientImage = async (req, res) => {
    const { patient_id } = req.body;
    console.log(req.body)
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/images/${req.file.filename}`; 
    try {
        const [result] = await promisePool.query(
            'INSERT INTO patient_images (patient_id, image_url) VALUES (?, ?)', 
            [patient_id, imageUrl]
        );
        res.status(201).json({ id: result.insertId, imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error saving patient image', details: error.message });
    }
};

const deletePatientImage = async (req, res) => {
    const { image_url } = req.body; 
    if (!image_url) {
        return res.status(400).json({ message: 'Image URL is required' });
    }
    
    try {
        const [result] = await promisePool.query('DELETE FROM patient_images WHERE image_url = ?', [image_url]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting image', details: error.message });
    }
};


module.exports = {
    getPatientImages,
    addPatientImage,
    deletePatientImage,
};
