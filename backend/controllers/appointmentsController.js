const { promisePool } = require('../config/db'); // Adjust the path as necessary

// Get all appointments
const getAppointments = async (req, res) => {
    const { search } = req.query;

    try {
        let sql = "SELECT * FROM appointments";
        let params = [];

        // If there's a search term, adjust the SQL query
        if (search) {
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
    const { time, from, to, hours, status, date, patient_id, doctor_id } = req.body;  // Correctly reference patient_id here
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
    const { time, from, to, hours, status, date, patientId, doctorId } = req.body;
    const query = `
        UPDATE appointments 
        SET time = ?, from_time = ?, to_time = ?, hours = ?, status = ?, date = ?, patient_id = ?, doctor_id = ?
        WHERE id = ?
    `;

    try {
        const [result] = await promisePool.query(query, [time, from, to, hours, status, date, patientId, doctorId, id]);
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

module.exports = {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
};