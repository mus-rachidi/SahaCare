const { promisePool } = require('../config/db');

const getMedicalRecords = async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM medical_records');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching medical records' });
    }
};

const addMedicalRecord = async (req, res) => {
    const { patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs } = req.body;
    try {
      const [result] = await promisePool.query(
        'INSERT INTO medical_records (patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs]
      );
      res.status(201).json({ id: result.insertId, message: 'Medical record added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding medical record' });
    }
  };
  
  const updateMedicalRecord = async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs } = req.body;
    try {
      await promisePool.query(
        'UPDATE medical_records SET patient_id = ?, doctor_id = ?, record_date = ?, diagnosis = ?, treatment = ?, medicine = ?, dosage = ?, quantity = ?, complaints = ?, vital_signs = ? WHERE record_id = ?', 
        [patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, id]
      );
      res.json({ message: 'Medical record updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating medical record' });
    }
  };
  
const deleteMedicalRecord = async (req, res) => {
    const { id } = req.params;
    try {
        await promisePool.query('DELETE FROM medical_records WHERE record_id = ?', [id]);
        res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting medical record' });
    }
};

module.exports = {
    getMedicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
}