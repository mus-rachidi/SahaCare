// routes/Receptions.js

const express = require('express');
const { 
    getAllReceptions, 
    getReceptionsById, 
    createReceptions, 
    updateReceptions, 
    deleteReceptions,
    exportReceptionsToCSV
} = require('../controllers/receptionsController');

const router = express.Router();

router.get('/receptions/export', exportReceptionsToCSV);// GET all Receptions
router.get('/receptions/', getAllReceptions);

// GET a specific Reception by ID
router.get('/receptions/:id', getReceptionsById);

// POST a new Reception
router.post('/receptions/', createReceptions);

// PUT update a Reception by ID
router.put('/receptions/:id', updateReceptions);

// DELETE a Reception by ID
router.delete('/receptions/:id', deleteReceptions);

module.exports = router;
