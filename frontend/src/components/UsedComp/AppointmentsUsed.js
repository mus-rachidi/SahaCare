import { useState, useEffect } from 'react';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { AppointmentTable } from '../Tables';

function AppointmentsUsed({ doctor }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [appointmentsData, setAppointmentsData] = useState([]); // State for fetched data

  // Fetch appointments data from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments'); // Adjust API endpoint as needed
        const appointments = await response.json();
        setAppointmentsData(appointments);
        console.log("Fetched Appointments Data:", appointments); // Print data to console
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // onClick event handler
  const handleEventClick = (event) => {
    setData(event);
    setOpen(!open);
  };

  // handle modal close
  const handleClose = () => {
    setOpen(!open);
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
          doctor={doctor}
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
