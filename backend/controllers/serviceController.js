const { promisePool } = require('../config/db'); // Import the promisePool from the db config

// Get all services
// Get all services with optional search
const getAllServices = async (req, res) => {
    const { search } = req.query; // Get the search query from the request
    let query = 'SELECT * FROM services';
    let queryParams = [];

    // If a search term is provided, filter by name or other fields
    if (search) {
        query += ' WHERE name LIKE ?';
        queryParams.push(`%${search}%`);
    }

    try {
        const [results] = await promisePool.query(query, queryParams);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get a specific service by ID
const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await promisePool.query('SELECT * FROM services WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new service
const addService = async (req, res) => {
    const { name, price, date, status } = req.body;
    try {
        const [result] = await promisePool.query('INSERT INTO services (name, price, date, status) VALUES (?, ?, ?, ?)', [name, price, date, status]);
        res.status(201).json({ message: 'Service added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    const { id } = req.params;
    const { name, price, date, status } = req.body;
    try {
        const [result] = await promisePool.query('UPDATE services SET name = ?, price = ?, date = ?, status = ? WHERE id = ?', [name, price, date, status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await promisePool.query('DELETE FROM services WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export the functions
module.exports = {
    getAllServices,
    getServiceById,
    addService,
    updateService,
    deleteService
};
