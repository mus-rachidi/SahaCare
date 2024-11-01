const { promisePool } = require('../config/db'); 

const getAppointments = async (req, res) => {
    const { patientId, search } = req.query; 
    try {
        let sql = "SELECT * FROM appointments";
        let params = [];

        if (patientId) {
            sql += " WHERE patient_id = ?";
            params.push(patientId);
        } else if (search) {
            sql += " WHERE patient_id LIKE ? OR doctor_id LIKE ?";
            params.push(`%${search}%`, `%${search}%`);
        }

        const [rows] = await promisePool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).send("Error fetching appointments");
    }
};


// Add a new appointment
const addAppointment = async (req, res) => {
    const { time, from, to, hours, status, date, patient_id, doctor_id } = req.body; 
    const query = `
        INSERT INTO appointments (time, from_time, to_time, hours, status, date, patient_id, doctor_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await promisePool.query(query, [time, from, to, hours, status, date, patient_id, doctor_id]);  // Make sure to use patient_id and doctor_id here
        res.status(201).json({ id: result.insertId, message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Database insert failed:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};


// Update an appointment
const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { time, from, to, hours, status, date } = req.body; // Removed patientId and doctorId

    const query = `
        UPDATE appointments 
        SET time = ?, from_time = ?, to_time = ?, hours = ?, status = ?, date = ?
        WHERE id = ?
    `;

    try {
        const [result] = await promisePool.query(query, [time, from, to, hours, status, date, id]); // Updated parameter array
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Database update failed:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM appointments WHERE id = ?';

    try {
        const [result] = await promisePool.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Database delete failed:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};
// Check if the time slot is available
const checkTimeSlot = async (req, res) => {
    const { from, to, doctor_id, date } = req.query;

    const query = `
        SELECT * FROM appointments 
        WHERE doctor_id = ? AND date = ? AND (
            (from_time < ? AND to_time > ?) OR
            (from_time < ? AND to_time > ?) OR
            (from_time >= ? AND to_time <= ?)
        )
    `;

    try {
        const [rows] = await promisePool.query(query, [doctor_id, date, to, from, from, to, from, to]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'The selected time slot is already reserved.' });
        }
        res.status(200).json({ message: 'Time slot is available.' });
    } catch (err) {
        console.error("Error checking time slot:", err);
        res.status(500).send("Error checking time slot");
    }
};

module.exports = {
    checkTimeSlot,
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
};
