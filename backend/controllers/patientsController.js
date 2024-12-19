const { promisePool } = require("../config/db"); // Assuming `promisePool` is exported from a database setup module
const moment = require('moment'); // Make sure to install moment.js

// Get all patients or search by full name
const getPatients = async (req, res) => {
    const { search } = req.query;

    try {
        let sql = "SELECT * FROM Patients";
        let params = [];

        if (search) {
            sql += " WHERE FullName LIKE ?";
            params.push(`%${search}%`);
        }

        sql += " ORDER BY id ASC";

        const [rows] = await promisePool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).send("Error fetching patients");
    }
};


// Update a patient by ID
const updatePatient = async (req, res) => {
    const { amount, status, PaymentDate } = req.body;
    const { id } = req.params;

    const sqlUpdate = `
        UPDATE Patients
        SET amount = ?, 
            status = ?, 
            PaymentDate = ?
        WHERE id = ?
    `;

    try {
        const [result] = await promisePool.query(sqlUpdate, [amount, status, PaymentDate, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Patient not found");
        }
        res.send("Payment updated successfully");
    } catch (err) {
        console.error("Error updating payment:", err);
        res.status(500).send("Error updating payment");
    }
};



// Delete a patient by ID
const deletePatient = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    try {
        // Delete the patient from the Patients table
        const [result] = await promisePool.query("DELETE FROM Patients WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' }); // Respond with JSON if no patient found
        }

        res.status(200).json({ message: 'Patient deleted successfully' }); // Respond with JSON upon success
    } catch (error) {
        console.error('Error deleting patient:', error.message); // Log the error message
        res.status(500).json({ message: 'Error deleting patient' }); // Respond with JSON on error
    }
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
    // console.log("GET /api/counts endpoint hit"); // Log when endpoint is called

    try {
        const todayCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE DATE(PaymentDate) = CURDATE()"
        );
        // console.log("Today Count Result:", todayCountResult); // Log query result

        const monthlyCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE MONTH(PaymentDate) = MONTH(CURDATE()) AND YEAR(PaymentDate) = YEAR(CURDATE())"
        );
        // console.log("Monthly Count Result:", monthlyCountResult); // Log query result

        const yearlyCountResult = await promisePool.query(
            "SELECT COUNT(*) AS count FROM Patients WHERE YEAR(PaymentDate) = YEAR(CURDATE())"
        );
        // console.log("Yearly Count Result:", yearlyCountResult); // Log query result

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

const getPaymentSummary = async (req, res) => {
    console.log("GET /api/payment-summary endpoint hit"); // Log when endpoint is called

    try {
        const sql = `
            SELECT
                SUM(CASE WHEN DATE(PaymentDate) = CURDATE() THEN amount ELSE 0 END) AS dailyTotal,
                SUM(CASE WHEN MONTH(PaymentDate) = MONTH(CURDATE()) AND YEAR(PaymentDate) = YEAR(CURDATE()) THEN amount ELSE 0 END) AS monthlyTotal,
                SUM(CASE WHEN YEAR(PaymentDate) = YEAR(CURDATE()) THEN amount ELSE 0 END) AS yearlyTotal
            FROM Patients
        `;

        const [rows] = await promisePool.query(sql);
        res.json(rows[0]); 
    } catch (err) {
        console.error("Error fetching payment summary:", err);
        res.status(500).json({ error: "Error fetching payment summary" });
    }
};

// Update only the amount and status for a patient by ID
const updatePatientAmountAndStatus = async (req, res) => {
    const { id } = req.params;
    const { amount, status } = req.body; // Removed PaymentDate as it's handled in the backend

    const maxStatusLength = 20; // Set according to your database definition

    console.log(`Received request to update patient with ID: ${id}`);
    console.log(`Amount: ${amount}, Status: ${status}`);

    // Validate status length
    if (status.length > maxStatusLength) {
        return res.status(400).send(`Status is too long. Maximum length is ${maxStatusLength}.`);
    }

    // SQL query to update amount, status, and PaymentDate fields
    const sqlUpdate = `
        UPDATE Patients
        SET amount = ?, status = ?, PaymentDate = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    try {
        // Log the SQL query
        console.log(`Executing SQL: ${sqlUpdate} with values: [${amount}, ${status}, ${id}]`);

        const [result] = await promisePool.query(sqlUpdate, [amount, status, id]);

        // Log the result of the query
        console.log(`Query result:`, result);

        if (result.affectedRows === 0) {
            return res.status(404).send("Patient not found");
        }

        res.send("Patient amount, status, and payment date updated successfully");
    } catch (err) {
        // Log the error details
        console.error("Error updating patient amount, status, and payment date:", err.message);
        console.error("Full error object:", err);
        res.status(500).send("Error updating patient amount, status, and payment date");
    }
};

// Define the maximum length for phone numbers
const maxPhoneLength = 20; // Adjust based on your needs

const addPatient = async (req, res) => {
    const { FullName, image, admin, email, phone, age, gender, totalAppointments, services, price } = req.body;

    // Validate phone number length
    if (phone.length > maxPhoneLength) {
        return res.status(400).send(`Phone number is too long. Maximum length is ${maxPhoneLength}.`);
    }

    try {
        const adminValue = admin === 'True' || admin === true ? 1 : 0;
        const currentDate = moment();
        const formattedDate = currentDate.format("YYYY-MM-DD - HH:mm");

        // Fetch current patient IDs
        const [patients] = await promisePool.query("SELECT id FROM Patients");
        const existingIds = patients.map(patient => patient.id);

        // Determine the next available ID
        let nextId = 1;
        while (existingIds.includes(nextId)) {
            nextId++;
        }

        // Insert the new patient with the next available ID
        await promisePool.query(
            `INSERT INTO Patients (id, FullName, image, admin, email, phone, age, gender, totalAppointments, PaymentDate, services, price)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nextId, FullName, image, adminValue, email, phone, age, gender, totalAppointments, formattedDate, services, price]
        );

        res.status(201).json({ message: 'Patient added successfully' });
    } catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ error: "Error adding patient" });
    }
};

const updateAllPatientData = async (req, res) => {
    const { id } = req.params;
    const { FullName, image, admin, email, phone, age, gender, totalAppointments, services, price } = req.body;

    // Validate phone number length
    if (phone.length > maxPhoneLength) {
        return res.status(400).send(`Phone number is too long. Maximum length is ${maxPhoneLength}.`);
    }

    // Set admin value based on the input
    const adminValue = admin === 'True' || admin === true ? 1 : 0;

    const sqlUpdate = `
        UPDATE Patients
        SET FullName = ?, 
            image = ?, 
            admin = ?, 
            email = ?, 
            phone = ?, 
            age = ?, 
            gender = ?, 
            totalAppointments = ?, 
            services = ?, 
            price = ?
        WHERE id = ?
    `;

    try {
        // Execute the update query
        const [result] = await promisePool.query(sqlUpdate, [FullName, image, adminValue, email, phone, age, gender, totalAppointments, services, price, id]);

        // Check if any rows were affected (i.e., if the patient was found)
        if (result.affectedRows === 0) {
            return res.status(404).send("Patient not found");
        }

        // Send success response
        res.send("Patient data updated successfully");
    } catch (err) {
        console.error("Error updating patient data:", err);
        res.status(500).send("Error updating patient data");
    }
};


module.exports = { 
    updateAllPatientData,
    updatePatientAmountAndStatus,
    getPatients,
    getPatientCounts,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    getPaymentSummary
};
