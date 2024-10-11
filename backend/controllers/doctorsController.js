// // controllers/doctorsController.js

// const { promisePool } = require('../config/db'); // Adjust the path as necessary

// // Get all doctors
// const getAllDoctors = async (req, res) => {
//     try {
//         const [doctors] = await promisePool.query('SELECT * FROM doctors');
//         res.status(200).json(doctors);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get a doctor by ID
// const getDoctorById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const [doctor] = await promisePool.query('SELECT * FROM doctors WHERE id = ?', [id]);
//         if (doctor.length > 0) {
//             res.status(200).json(doctor[0]);
//         } else {
//             res.status(404).json({ message: 'Doctor not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Create a new doctor
// const createDoctor = async (req, res) => {
//     const { title, email, phone, image } = req.body;
//     try {
//         const [result] = await promisePool.query(
//             'INSERT INTO doctors (title, email, phone, image) VALUES (?, ?, ?, ?)',
//             [title, email, phone, image]
//         );
//         const newDoctor = { id: result.insertId, title, email, phone, image };
//         res.status(201).json(newDoctor);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update a doctor by ID
// const updateDoctor = async (req, res) => {
//     const { id } = req.params;
//     const { title, email, phone, image } = req.body;
//     try {
//         const [result] = await promisePool.query(
//             'UPDATE doctors SET title = ?, email = ?, phone = ?, image = ? WHERE id = ?',
//             [title, email, phone, image, id]
//         );
//         if (result.affectedRows > 0) {
//             const updatedDoctor = { id, title, email, phone, image };
//             res.status(200).json(updatedDoctor);
//         } else {
//             res.status(404).json({ message: 'Doctor not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a doctor by ID
// const deleteDoctor = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const [result] = await promisePool.query('DELETE FROM doctors WHERE id = ?', [id]);
//         if (result.affectedRows > 0) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ message: 'Doctor not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//     getAllDoctors,
//     getDoctorById,
//     createDoctor,
//     updateDoctor,
//     deleteDoctor
// };
