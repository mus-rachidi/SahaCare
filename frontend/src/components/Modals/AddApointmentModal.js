import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import {
  Button,
  DatePickerComp,
  TimePickerComp,
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
      setStartDate(new Date(datas.start));
      setStartTime(new Date(datas.start));
      setEndTime(new Date(datas.end));

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
    selectedStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  
    // Check if the selected start time is before the current date and time
    if (selectedStartTime < now) {
      toast.error('Appointment time must be later than the current date and time.');
      return;
    }
  
    const selectedEndTime = new Date(selectedStartTime); // Create a new date object for end time
    selectedEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0); // Set end time based on selected start time
  
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
      title={datas?.title ? 'Edit Appointment' : 'New Appointment'}
      width={'max-w-3xl'}
    >
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
            <label className="block text-sm font-medium text-gray-700">
              Patient Name <span className="text-red-600">*</span>
            </label>
            {datas?.id ? (
              <p className="border rounded p-2">{selectedPatient?.name || 'No patient selected'}</p>
            ) : (
              <input
                type="text"
                value={searchTermPatient}
                onChange={(e) => {
                  setSearchTermPatient(e.target.value);
                  setShowPatientDropdown(e.target.value !== ''); // Show dropdown when typing
                }}
                placeholder="Search for a patient..."
                className="w-full border rounded p-2"
                onFocus={() => setShowPatientDropdown(true)} // Show dropdown on focus
                onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)} // Hide dropdown after a short delay
              />
            )}
            {showPatientDropdown && !datas?.id && (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded mt-1">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedPatient?.id === patient.id ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearchTermPatient(patient.name); // Set the selected patient's name
                      setShowPatientDropdown(false); // Hide dropdown after selection
                    }}
                  >
                    {patient.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <DatePickerComp
            label="Date of visit"
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <TimePickerComp
            label="Start time"
            startDate={startTime}
            onChange={(date) => setStartTime(date)}
          />
          <TimePickerComp
            label="End time"
            startDate={endTime}
            onChange={(date) => setEndTime(date)}
          />
        </div>

        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
            <label className="block text-sm font-medium text-gray-700">
              Doctor Name <span className="text-red-600">*</span>
            </label>
            {datas?.id ? (
              <p className="border rounded p-2">{selectedDoctor?.name || 'No doctor selected'}</p>
            ) : (
              <input
                type="text"
                value={searchTermDoctor}
                onChange={(e) => {
                  setSearchTermDoctor(e.target.value);
                  setShowDoctorDropdown(e.target.value !== ''); // Show dropdown when typing
                }}
                placeholder="Search for a doctor..."
                className="w-full border rounded p-2"
                onFocus={() => setShowDoctorDropdown(true)} // Show dropdown on focus
                onBlur={() => setTimeout(() => setShowDoctorDropdown(false), 200)} // Hide dropdown after a short delay
              />
            )}
            {showDoctorDropdown && !datas?.id && (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded mt-1">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedDoctor?.id === doctor.id ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setSearchTermDoctor(doctor.name); // Set the selected doctor's name
                      setShowDoctorDropdown(false); // Hide dropdown after selection
                    }}
                  >
                    {doctor.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={datas?.id ? handleDelete : closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.id ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            icon={<HiOutlineCheckCircle />}
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddAppointmentModal;
