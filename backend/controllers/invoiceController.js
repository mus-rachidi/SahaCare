const { promisePool } = require('../config/db');

// Get all invoices
const getAllInvoices = async (req, res) => {
    try {
        const [rows] = await promisePool.query("SELECT * FROM Invoices");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices", error });
    }
};

// Get a specific invoice by ID
const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await promisePool.query("SELECT * FROM Invoices WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoice", error });
    }
};

// Create a new invoice
const createInvoice = async (req, res) => {
    const { patient_id, doctor_id, total_amount, created_date, due_date, status, services_rendered } = req.body;

    try {
        // Convert dates from "October 12, 2024" format to "YYYY-MM-DD"
        const createdDate = new Date(created_date).toISOString().split('T')[0]; // Gets "2024-10-12"
        const dueDate = new Date(due_date).toISOString().split('T')[0]; // Gets "2024-11-12"

        // Insert the new invoice, letting AUTO_INCREMENT manage the id
        await promisePool.query(
            "INSERT INTO Invoices (patient_id, doctor_id, created_date, due_date, total_amount, status, services_rendered) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [patient_id, doctor_id, createdDate, dueDate, total_amount, status, JSON.stringify(services_rendered)]
        );

        res.status(201).json({ message: "Invoice created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating invoice", error });
    }
};


// Update an existing invoice
const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, created_date, due_date, total_amount, status, services_rendered, payment_method } = req.body;
    try {
        const [result] = await promisePool.query(
            "UPDATE Invoices SET patient_id = ?, doctor_id = ?, created_date = ?, due_date = ?, total_amount = ?, status = ?, services_rendered = ?, payment_method = ? WHERE id = ?",
            [patient_id, doctor_id, created_date, due_date, total_amount, status, JSON.stringify(services_rendered), payment_method, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json({ message: "Invoice updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating invoice", error });
    }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await promisePool.query("DELETE FROM Invoices WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice", error });
    }
};

module.exports = {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
};
