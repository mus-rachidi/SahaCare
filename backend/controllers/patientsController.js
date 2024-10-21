const { promisePool } = require("../config/db"); // Assuming `promisePool` is exported from a database setup module
const moment = require('moment'); // Make sure to install moment.js

// Get all patients
// Get all patients or search by full name
const getPatients = async (req, res) => {
    const { search } = req.query; // Extract the search query from the request parameters

    try {
        let sql = "SELECT * FROM Patients";
        let params = [];

        // If there's a search query, modify the SQL to filter results
        if (search) {
            sql += " WHERE FullName LIKE ?";
            params.push(`%${search}%`); // Use LIKE to match the search term in FullName
        }

        sql += " ORDER BY id ASC"; // Always order by id

        const [rows] = await promisePool.query(sql, params); // Pass params to the query
        res.json(rows);
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).send("Error fetching patients");
    }
};

// Add a new patient
const addPatient = async (req, res) => {
    const { FullName, image, admin, email, phone, age, gender, blood, totalAppointments } = req.body;

    try {
        // Convert admin to an integer (0 or 1)
        const adminValue = admin === 'True' || admin === true ? 1 : 0;

        // Get the current date and format it for the database
        const currentDate = moment(); // Get the current date and time
        const formattedDate = currentDate.format("YYYY-MM-DD"); // Format for the database
        const displayDate = currentDate.format("MMMM D, YYYY"); // Format for display

        // Step 1: Fetch all current patient IDs
        const [patients] = await promisePool.query("SELECT id FROM Patients");
        const existingIds = patients.map(patient => patient.id);

        // Step 2: Determine the next available ID
        let nextId = 1; // Start looking from ID 1
        while (existingIds.includes(nextId)) {
            nextId++; // Increment until we find an unused ID
        }

        // Step 3: Insert the new patient with the next available ID
        await promisePool.query(
            `INSERT INTO Patients (id, FullName, image, admin, email, phone, age, gender, blood, totalAppointments, date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nextId, FullName, image, adminValue, email, phone, age, gender, blood, totalAppointments, formattedDate]
        );

        // Return both the formatted date for display if needed
        res.status(201).json({ message: 'Patient added successfully', displayDate });
    } catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ error: "Error adding patient" });
    }
};

// Update a patient by ID
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { FullName, age, gender, phone, email, blood, totalAppointments } = req.body;
    const sqlUpdate = `
        UPDATE Patients
        SET FullName = ?, age = ?, gender = ?, phone = ?, email = ?, blood = ?, totalAppointments = ?
        WHERE id = ?
    `;

    try {
        const [result] = await promisePool.query(sqlUpdate, [FullName, age, gender, phone, email, blood, totalAppointments, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Patient not found");
        }
        res.send("Patient updated successfully");
    } catch (err) {
        console.error("Error updating patient:", err);
        res.status(500).send("Error updating patient");
    }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    try {
        const [result] = await promisePool.query("DELETE FROM Patients WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' }); // Respond with JSON if no patient found
        }

        // Step 1: Reorder IDs after deletion
        await reorderPatientIds();

        res.status(200).json({ message: 'Patient deleted successfully' }); // Respond with JSON upon success
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ message: 'Error deleting patient' }); // Respond with JSON on error
    }
};

// Function to reorder patient IDs after a deletion
const reorderPatientIds = async () => {
    const [patients] = await promisePool.query("SELECT id FROM Patients ORDER BY id ASC");
    const updates = patients.map((patient, index) => {
        const newId = index + 1; // New ID should be index + 1
        return promisePool.query("UPDATE Patients SET id = ? WHERE id = ?", [newId, patient.id]);
    });
    await Promise.all(updates); // Wait for all updates to complete
};

// Get a patient by ID
const getPatientById = async (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM Patients WHERE id = ?";

    try {
        const [rows] = await promisePool.query(sqlGet, [id]);
        if (rows.length === 0) {
            return res.status(404).send("Patient not found");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching patient:", err);
        res.status(500).send("Error fetching patient");
    }
};

const getPatientCounts = async (req, res) => {
    console.log("GET /api/patients/counts endpoint hit"); // Log when endpoint is called

    try {
        const todayCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE DATE(date) = CURDATE()"
        );
        console.log("Today Count Result:", todayCountResult); // Log query result

        const monthlyCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())"
        );
        console.log("Monthly Count Result:", monthlyCountResult); // Log query result

        const yearlyCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE YEAR(date) = YEAR(CURDATE())"
        );
        console.log("Yearly Count Result:", yearlyCountResult); // Log query result

        res.json({
            today: todayCountResult[0][0].count,
            monthly: monthlyCountResult[0][0].count,
            yearly: yearlyCountResult[0][0].count,
        });
    } catch (err) {
        console.error("Error fetching patient counts:", err); // Log error
        res.status(500).send("Error fetching patient counts");
    }
};

// Update only the amount and status for a patient by ID
const updatePatientAmountAndStatus = async (req, res) => {
    const { id } = req.params; // Get the patient ID from the request parameters
    const { amount, status } = req.body; // Get the amount and status from the request body

    // SQL query to update only amount and status fields
    const sqlUpdate = `
        UPDATE Patients
        SET amount = ?, status = ?
        WHERE id = ?
    `;

    try {
        // Execute the query with the new amount, status, and the patient ID
        const [result] = await promisePool.query(sqlUpdate, [amount, status, id]);

        // If no rows were affected, the patient was not found
        if (result.affectedRows === 0) {
            return res.status(404).send("Patient not found");
        }

        // Respond with success message
        res.send("Patient amount and status updated successfully");
    } catch (err) {
        // Handle any errors during the update
        console.error("Error updating patient amount and status:", err);
        res.status(500).send("Error updating patient amount and status");
    }
};


module.exports = { updatePatientAmountAndStatus,getPatients,getPatientCounts, addPatient, updatePatient, deletePatient, getPatientById };
