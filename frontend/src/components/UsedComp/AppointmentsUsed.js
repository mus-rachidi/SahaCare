import { useState, useEffect } from 'react';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { AppointmentTable } from '../Tables';

function AppointmentsUsed({ doctor, patientId }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [doctorNames, setDoctorNames] = useState({});

  // Fetch appointments data from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments?patientId=${patientId}`);
        const appointments = await response.json();
        setAppointmentsData(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  // Fetch patient and doctor names based on their IDs
  useEffect(() => {
    const fetchNames = async () => {
      const patientPromises = appointmentsData.map(async (item) => {
        if (item.patient_id) {
          const response = await fetch(`http://localhost:5000/api/patients/${item.patient_id}`);
          const patientData = await response.json();
          return { id: item.patient_id, FullName: patientData.FullName };
        }
        return null;
      });

      const doctorPromises = appointmentsData.map(async (item) => {
        if (item.doctor_id) {
          const response = await fetch(`http://localhost:5000/api/doctors/${item.doctor_id}`);
          const doctorData = await response.json();
          return { id: item.doctor_id, fullName: doctorData.fullName };
        }
        return null;
      });

      const patients = await Promise.all(patientPromises);
      const doctors = await Promise.all(doctorPromises);

      setPatientNames(Object.fromEntries(patients.filter(Boolean).map(p => [p.id, p.FullName])));
      setDoctorNames(Object.fromEntries(doctors.filter(Boolean).map(d => [d.id, d.fullName])));
    };

    if (appointmentsData.length > 0) {
      fetchNames();
    }
  }, [appointmentsData]);

  const handleEventClick = (event) => {
    setData(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({});
  };

  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          datas={data}
          isOpen={open}
          closeModal={handleClose}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointments</h1>
      <div className="w-full overflow-x-scroll">
        <AppointmentTable
          data={appointmentsData}
          patientNames={patientNames} // Pass patient names here
          doctorNames={doctorNames}   // Pass doctor names here
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
