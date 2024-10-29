import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import {
  Button,
  DatePickerComp,
} from '../Form';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
function AddAppointmentModal({ closeModal, isOpen, datas }) {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTermPatient, setSearchTermPatient] = useState('');
  const [searchTermDoctor, setSearchTermDoctor] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = String(Math.floor(i / 2)).padStart(2, '0');
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hours}:${minutes}`;
  });
  useEffect(() => {
    const fetchDoctorsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors');
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        const formattedDoctors = data.map((doctor) => ({
          id: doctor.id,
          name: `${doctor.title} ${doctor.fullName}`,
        }));
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctorsData();
  }, []);

  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        const formattedPatients = data.map((patient) => ({
          id: patient.id,
          name: patient.FullName,
        }));
        setPatients(formattedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    };
    fetchPatientsData();
  }, []);

  useEffect(() => {
    if (datas && datas.id && patients.length > 0 && doctors.length > 0) {
      // Create a new Date object using UTC time from the appointment data
      const startDateTime = new Date(datas.start);
      const endDateTime = new Date(datas.end);

      // Convert the UTC time to Moroccan time (UTC+1)
      const moroccanStartDateTime = new Date(startDateTime.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour
      const moroccanEndDateTime = new Date(endDateTime.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour

      setStartDate(moroccanStartDateTime); // Set start date
      setStartTime(moroccanStartDateTime.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }).substring(0, 5)); // Set start time (HH:MM format)
      setEndTime(moroccanEndDateTime.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }).substring(0, 5)); // Set end time (HH:MM format)

      const patientToSelect = patients.find(patient => patient.id === datas.patient_id);
      setSelectedPatient(patientToSelect);

      const doctorToSelect = doctors.find(doctor => doctor.id === datas.doctor_id);
      setSelectedDoctor(doctorToSelect);
    }
  }, [datas, patients, doctors]);



  const handleDelete = async () => {
    if (!datas?.id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${datas.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      toast.success('Appointment deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const handleSave = async () => {
    const now = new Date();
    const selectedStartTime = new Date(startDate);
    // Convert startTime to a Date object
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    selectedStartTime.setHours(startHours, startMinutes, 0, 0);

    if (selectedStartTime < now) {
      toast.error('Appointment time must be later than the current date and time.');
      return;
    }

    const selectedEndTime = new Date(selectedStartTime); // Create a new date object for end time
    // Convert endTime to a Date object
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    selectedEndTime.setHours(endHours, endMinutes, 0, 0); // Set end time based on selected start time

    // Calculate the time difference in minutes
    const timeDifference = (selectedEndTime - selectedStartTime) / (1000 * 60);
    if (timeDifference <= 15) { // Ensure the difference is more than 15 minutes
      toast.error('The appointment duration must be more than 15 minutes.');
      return;
    }

    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    const appointmentDate = selectedStartTime.toISOString().split('T')[0];

    try {
      // Check if the time slot is already reserved
      const timeCheckResponse = await fetch(`http://localhost:5000/api/appointments/check?from=${selectedStartTime.toLocaleTimeString('en-US', { hour12: false })}&to=${selectedEndTime.toLocaleTimeString('en-US', { hour12: false })}&doctor_id=${selectedDoctor.id}&date=${appointmentDate}`);

      if (!timeCheckResponse.ok) {
        const errorData = await timeCheckResponse.json();
        toast.error(errorData.error);
        return;
      }

      const appointmentData = {
        time: selectedStartTime.toLocaleTimeString('en-US', { hour12: false }),
        from: selectedStartTime.toLocaleTimeString('en-US', { hour12: false }),
        to: selectedEndTime.toLocaleTimeString('en-US', { hour12: false }),
        hours: (selectedEndTime - selectedStartTime) / (1000 * 60 * 60),
        date: appointmentDate,
        patient_id: selectedPatient.id,
        doctor_id: selectedDoctor.id,
      };

      let response;
      let responseData;

      if (datas?.id) {
        response = await fetch(`http://localhost:5000/api/appointments/${datas.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
        });

        if (!response.ok) throw new Error('Failed to update appointment');
        responseData = await response.json();
        toast.success('Appointment updated successfully');
      } else {
        response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
        });

        if (!response.ok) throw new Error('Failed to save appointment');
        responseData = await response.json();
        toast.success(responseData.message || 'Appointment saved successfully');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Failed to save appointment');
    }
  };



  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTermPatient.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTermDoctor.toLowerCase())
  );

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas?.title ? (
        <h2 className="text-2xl font-semibold text-gray-800">
          Edit Appointment
        </h2>
      ) : (
        <h2 className="text-2xl font-semibold text-gray-800">
          New Appointment
        </h2>
      )}
    >
      <div className="flex flex-col gap-8 p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg"> {/* Larger padding, max-width, shadow for modal */}
        <div className="grid grid-cols-12 gap-4 items-center w-full">
          <div className="col-span-10">
            <label className="block text-base font-medium text-gray-900 mb-1">
              Patient Name <span className="text-red-500">*</span>
            </label>
            {datas?.id ? (
              <p className="border rounded-lg p-3 text-gray-700 bg-gray-50">{selectedPatient?.name || 'No patient selected'}</p>
            ) : (
              <input
                type="text"
                value={searchTermPatient}
                onChange={(e) => {
                  setSearchTermPatient(e.target.value);
                  setShowPatientDropdown(e.target.value !== '');
                }}
                placeholder="Search for a patient..."
                className="w-full border rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setShowPatientDropdown(true)}
                onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)}
              />
            )}
            {showPatientDropdown && !datas?.id && (
              <div className="absolute max-h-56 overflow-y-auto border rounded-lg mt-2 z-20 w-full bg-white shadow-md"> {/* Dropdown styling */}
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className={`p-3 cursor-pointer hover:bg-blue-50 ${selectedPatient?.id === patient.id ? 'bg-blue-100' : ''}`}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearchTermPatient(patient.name);
                      setShowPatientDropdown(false);
                    }}
                  >
                    {patient.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePickerComp
            label="Date of Visit"
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Start Time</label>
    <select
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
      style={{ scrollbarWidth: 'thin', overflowY: 'auto' }} // Optional for custom scroll
    >
      <option value="" disabled>Select time</option>
      {timeOptions.map((time) => (
        <option key={time} value={time}>{time}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">End Time</label>
    <select
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
      style={{ scrollbarWidth: 'thin', overflowY: 'auto' }} // Optional for custom scroll
    >
      <option value="" disabled>Select time</option>
      {timeOptions.map((time) => (
        <option key={time} value={time}>{time}</option>
      ))}
    </select>
  </div>
</div>


        <div className="grid grid-cols-12 gap-4 items-center w-full">
          <div className="col-span-10">
            <label className="block text-base font-medium text-gray-900 mb-1">
              Doctor Name <span className="text-red-500">*</span>
            </label>
            {datas?.id ? (
              <p className="border rounded-lg p-3 text-gray-700 bg-gray-50">{selectedDoctor?.name || 'No doctor selected'}</p>
            ) : (
              <input
                type="text"
                value={searchTermDoctor}
                onChange={(e) => {
                  setSearchTermDoctor(e.target.value);
                  setShowDoctorDropdown(e.target.value !== '');
                }}
                placeholder="Search for a doctor..."
                className="w-full border rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setShowDoctorDropdown(true)}
                onBlur={() => setTimeout(() => setShowDoctorDropdown(false), 200)}
              />
            )}
            {showDoctorDropdown && !datas?.id && (
              <div className="absolute max-h-36 overflow-y-auto border rounded-lg mt-2 z-20 w-full bg-white shadow-md">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`p-3 cursor-pointer hover:bg-blue-50 ${selectedDoctor?.id === doctor.id ? 'bg-blue-100' : ''}`}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSearchTermDoctor(doctor.name);
                      setShowDoctorDropdown(false);
                    }}
                  >
                    {doctor.name}
                  </div>
                ))}
              </div>

            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={datas?.id ? handleDelete : closeModal}
            className="bg-red-500 text-white font-semibold p-3 rounded-lg hover:bg-red-600 transition duration-150"
          >
            {datas?.id ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            icon={<HiOutlineCheckCircle />}
            onClick={handleSave}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 transition duration-150 rounded-lg p-3 font-semibold"
          />
        </div>
      </div>
    </Modal>



  );
}

export default AddAppointmentModal;
