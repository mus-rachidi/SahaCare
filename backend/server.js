const express = require("express");
const cors = require("cors");
const patientsRoutes = require("./routes/patients");
const doctorsRoutes = require("./routes/doctors");
const receptionsRoutes = require("./routes/receptions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", patientsRoutes);
app.use("/api", doctorsRoutes);
app.use('/api', receptionsRoutes);
const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
