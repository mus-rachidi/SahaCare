const { promisePool } = require('../config/db');

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT p.id, pa.FullName AS patient_name, p.data, p.amount, p.status, p.created_at
            FROM payments p
            JOIN Patients pa ON p.patient_id = pa.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve payments", error: err.message });
    }
};

// Get a specific payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await promisePool.query(`
            SELECT p.id, pa.FullName AS patient_name, p.data, p.amount, p.status, p.created_at
            FROM payments p
            JOIN Patients pa ON p.patient_id = pa.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve payment", error: err.message });
    }
};

// Create a new payment
const createPayment = async (req, res) => {
    const { FullName, data } = req.body;

    try {
        const [result] = await promisePool.query(`
            INSERT INTO payments (FullName, data) 
            VALUES (?, ?)
        `, [FullName, data]);

        res.status(201).json({ message: "Payment created successfully", paymentId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Failed to create payment", error: err.message });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [result] = await promisePool.query(`
            UPDATE payments SET status = ? WHERE id = ?
        `, [status, id]);

        if (result.affectedRows > 0) {
            res.json({ message: "Payment status updated successfully" });
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to update payment status", error: err.message });
    }
};

// Delete a payment
const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await promisePool.query(`
            DELETE FROM payments WHERE id = ?
        `, [id]);

        if (result.affectedRows > 0) {
            res.json({ message: "Payment deleted successfully" });
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to delete payment", error: err.message });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePaymentStatus,
    deletePayment // Added deletePayment to exports
};
