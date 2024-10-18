const bcrypt = require('bcrypt');
const { promisePool } = require('../config/db'); // Adjust the path as necessary
const { Parser } = require('json2csv');

// Helper function to get the next available ID
const getNextAvailableId = async () => {
    const [doctors] = await promisePool.query('SELECT id FROM doctors ORDER BY id ASC');
    if (doctors.length === 0) return 1; // If no doctors, start at ID 1

    // Find the smallest missing ID
    const existingIds = doctors.map(doctor => doctor.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
        nextId++;
    }
    return nextId;
};

// Reassign IDs
const reassessIds = async () => {
    const [doctors] = await promisePool.query('SELECT * FROM doctors ORDER BY id ASC');
    for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];
        if (doctor.id !== (i + 1)) {
            await promisePool.query('UPDATE doctors SET id = ? WHERE id = ?', [i + 1, doctor.id]);
        }
    }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await promisePool.query('SELECT * FROM doctors ORDER BY id ASC');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a doctor by ID
const getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const [doctor] = await promisePool.query('SELECT * FROM doctors WHERE id = ?', [id]);
        if (doctor.length > 0) {
            res.status(200).json(doctor[0]);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new doctor
const createDoctor = async (req, res) => {
    const { fullName, title, email, phone, image, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const nextId = await getNextAvailableId();
        const [result] = await promisePool.query(
            'INSERT INTO doctors (id, fullName, title, email, phone, image, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nextId, fullName, title, email, phone, image, hashedPassword]
        );

        const newDoctor = { id: nextId, fullName, title, email, phone, image };
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a doctor by ID
const updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { fullName, title, email, phone, image } = req.body;
    try {
        const [result] = await promisePool.query(
            'UPDATE doctors SET fullName = ?, title = ?, email = ?, phone = ?, image = ? WHERE id = ?',
            [fullName, title, email, phone, image, id]
        );
        if (result.affectedRows > 0) {
            const updatedDoctor = { id, fullName, title, email, phone, image };
            res.status(200).json(updatedDoctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a doctor by ID
const deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await promisePool.query('DELETE FROM doctors WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            await reassessIds(); // Reassign IDs after deletion
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [doctor] = await promisePool.query('SELECT * FROM doctors WHERE email = ?', [email]);
        if (doctor.length > 0) {
            const isMatch = await bcrypt.compare(password, doctor[0].password);
            if (isMatch) {
                res.status(200).json({ message: 'Login successful', doctor: doctor[0] });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Export doctors to CSV
const exportDoctorsToCSV = async (req, res) => {
    try {
        const [doctors] = await promisePool.query('SELECT * FROM doctors ORDER BY id ASC');

        // Convert JSON to CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(doctors);

        // Set the headers for CSV file
        res.header('Content-Type', 'text/csv');
        res.attachment('doctors.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Change password
const changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        // Fetch doctor by ID
        const [doctor] = await promisePool.query('SELECT * FROM doctors WHERE id = ?', [id]);
        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, doctor[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        await promisePool.query('UPDATE doctors SET password = ? WHERE id = ?', [hashedPassword, id]);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Export the function in your module
module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    loginDoctor,
    changePassword,
    exportDoctorsToCSV,
};
