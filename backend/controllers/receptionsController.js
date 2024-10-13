const bcrypt = require('bcrypt');
const { promisePool } = require('../config/db'); // Adjust the path as necessary
const { Parser } = require('json2csv');

// Helper function to get the next available ID
const getNextAvailableId = async () => {
    const [Receptions] = await promisePool.query('SELECT id FROM Receptions ORDER BY id ASC');
    if (Receptions.length === 0) return 1; // If no Receptions, start at ID 1

    // Find the smallest missing ID
    const existingIds = Receptions.map(reception => reception.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
        nextId++;
    }
    return nextId;
};

// Reassign IDs to maintain sequential order
const reassessIds = async () => {
    const [Receptions] = await promisePool.query('SELECT * FROM Receptions ORDER BY id ASC');
    for (let i = 0; i < Receptions.length; i++) {
        const reception = Receptions[i];
        // Update the ID only if it does not match the expected sequential ID
        if (reception.id !== (i + 1)) {
            await promisePool.query('UPDATE Receptions SET id = ? WHERE id = ?', [i + 1, reception.id]);
        }
    }
};

// Get all Receptions
const getAllReceptions = async (req, res) => {
    try {
        const [Receptions] = await promisePool.query('SELECT * FROM Receptions ORDER BY id ASC');
        res.status(200).json(Receptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Reception by ID
const getReceptionsById = async (req, res) => {
    const { id } = req.params;
    try {
        const [Receptions] = await promisePool.query('SELECT * FROM Receptions WHERE id = ?', [id]);
        if (Receptions.length > 0) {
            res.status(200).json(Receptions[0]);
        } else {
            res.status(404).json({ message: 'Receptions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new Reception
const createReceptions = async (req, res) => {
    const { fullName, title, email, phone, image, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get the next available ID
        const nextId = await getNextAvailableId();
        const [result] = await promisePool.query(
            'INSERT INTO Receptions (id, fullName, title, email, phone, image, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nextId, fullName, title, email, phone, image, hashedPassword]
        );

        const newReceptions = { id: nextId, fullName, title, email, phone, image };
        res.status(201).json(newReceptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Reception by ID
const updateReceptions = async (req, res) => {
    const { id } = req.params;
    const { fullName, title, email, phone, image } = req.body;
    try {
        const [result] = await promisePool.query(
            'UPDATE Receptions SET fullName = ?, title = ?, email = ?, phone = ?, image = ? WHERE id = ?',
            [fullName, title, email, phone, image, id]
        );
        if (result.affectedRows > 0) {
            const updatedReceptions = { id, fullName, title, email, phone, image };
            res.status(200).json(updatedReceptions);
        } else {
            res.status(404).json({ message: 'Receptions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Reception by ID
const deleteReceptions = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await promisePool.query('DELETE FROM Receptions WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            await reassessIds(); // Reassign IDs after deletion
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Receptions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login a Reception
const loginReceptions = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [Receptions] = await promisePool.query('SELECT * FROM Receptions WHERE email = ?', [email]);
        if (Receptions.length > 0) {
            const isMatch = await bcrypt.compare(password, Receptions[0].password);
            if (isMatch) {
                res.status(200).json({ message: 'Login successful', Receptions: Receptions[0] });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'Receptions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export Receptions to CSV
const exportReceptionsToCSV = async (req, res) => {
    try {
        const [Receptions] = await promisePool.query('SELECT * FROM Receptions ORDER BY id ASC');

        // Convert JSON to CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(Receptions);

        // Set the headers for CSV file
        res.header('Content-Type', 'text/csv');
        res.attachment('Receptions.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export the functions in your module
module.exports = {
    getAllReceptions,
    getReceptionsById,
    createReceptions,
    updateReceptions,
    deleteReceptions,
    loginReceptions,
    exportReceptionsToCSV,
};
