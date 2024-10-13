const { promisePool } = require("../config/db");

const getMedicines = async (req, res) => {
    try {
        const [medicines] = await promisePool.query("SELECT * FROM Medicines");
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createMedicine = async (req, res) => {
    const { name, price, status, inStock, measure } = req.body;
    try {
        const [result] = await promisePool.query(
            "INSERT INTO Medicines (name, price, status, inStock, measure) VALUES (?, ?, ?, ?, ?)",
            [name, price, status, inStock, measure]
        );
        res.status(201).json({ id: result.insertId, name, price, status, inStock, measure });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMedicine = async (req, res) => {
    const { id } = req.params;
    const { name, price, status, inStock, measure } = req.body;
    try {
        const [result] = await promisePool.query(
            "UPDATE Medicines SET name = ?, price = ?, status = ?, inStock = ?, measure = ? WHERE id = ?",
            [name, price, status, inStock, measure, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Medicine updated successfully." });
        } else {
            res.status(404).json({ message: "Medicine not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await promisePool.query("DELETE FROM Medicines WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Medicine deleted successfully." });
        } else {
            res.status(404).json({ message: "Medicine not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
};
