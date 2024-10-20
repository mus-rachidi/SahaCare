const express = require("express");
const cors = require("cors");
const patientsRoutes = require("./routes/patients");
const doctorsRoutes = require("./routes/doctors");
const receptionsRoutes = require("./routes/receptions");
const serviceRoutes = require('./routes/services');
const medicinesRoutes = require("./routes/medicines");
const invoiceRoutes = require("./routes/invoices");
const paymentRoutes = require('./routes/payments');  // <-- Add this line

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', serviceRoutes);
app.use("/api", patientsRoutes);
app.use("/api", doctorsRoutes);
app.use('/api', receptionsRoutes);
app.use('/api', medicinesRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', paymentRoutes);  // <-- Add this line

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
