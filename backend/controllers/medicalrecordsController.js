const { promisePool } = require('../config/db');
const moment = require('moment');

// Get all medical records
const getMedicalRecords = async (req, res) => {
    try {
        // Extract patient_id from query parameters
        const { patient_id } = req.query;

        let query = 'SELECT * FROM medical_records';
        const queryParams = [];

        // If patient_id is provided, filter the records by patient_id
        if (patient_id) {
            query += ' WHERE patient_id = ?';
            queryParams.push(patient_id);
        }

        const [rows] = await promisePool.query(query, queryParams);

        const formattedRecords = rows.map(record => ({
            ...record,
            record_date: moment(record.record_date).format("YYYY-MM-DD HH:mm"), 
        }));

        res.json(formattedRecords);
    } catch (error) {
        console.error("Error fetching medical records:", error);
        res.status(500).json({ error: 'Error fetching medical records' });
    }
};


// Add a new medical record
const addMedicalRecord = async (req, res) => {
    const { patient_id, doctor_id, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, note } = req.body;
    const record_date = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
        const [result] = await promisePool.query(
            'INSERT INTO medical_records (patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, note]
        );

        res.status(201).json({ id: result.insertId, message: 'Medical record added successfully', record_date: record_date });
    } catch (error) {
        console.error("Error adding medical record:", error);
        res.status(500).json({ error: 'Error adding medical record' });
    }
};

// Update an existing medical record
const updateMedicalRecord = async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, record_date, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, note } = req.body;

    try {
        const finalRecordDate = record_date ? new Date(record_date) : new Date();

        await promisePool.query(
            'UPDATE medical_records SET patient_id = ?, doctor_id = ?, record_date = ?, diagnosis = ?, treatment = ?, medicine = ?, dosage = ?, quantity = ?, complaints = ?, vital_signs = ?, note = ? WHERE record_id = ?',
            [patient_id, doctor_id, finalRecordDate, diagnosis, treatment, medicine, dosage, quantity, complaints, vital_signs, note, id]
        );
        res.json({ message: 'Medical record updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating medical record' });
    }
};

// Delete a medical record
const deleteMedicalRecord = async (req, res) => {
  const { id } = req.params;
  try {
      // Delete the record
      await promisePool.query('DELETE FROM medical_records WHERE record_id = ?', [id]);

      // Check if the table is empty and reset auto-increment if it is
      const [rows] = await promisePool.query('SELECT COUNT(*) AS count FROM medical_records');
      if (rows[0].count === 0) {
          await resetAutoIncrement();
      }

      res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting medical record' });
  }
};

const resetAutoIncrement = async () => {
  try {
      await promisePool.query('ALTER TABLE medical_records AUTO_INCREMENT = 1');
  } catch (error) {
      console.error("Error resetting auto increment:", error);
  }
};

module.exports = {
    getMedicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    resetAutoIncrement
};
