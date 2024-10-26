import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import {
  Button,
  Checkbox,
  DatePickerComp,
  Input,
  Select,
  Textarea,
  TimePickerComp,
} from '../Form';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

function AddAppointmentModal({ closeModal, isOpen, datas }) {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [shares, setShares] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [open, setOpen] = useState(false);

  // Fetch doctors data from the API
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
        setSelectedDoctor(formattedDoctors[0]);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctorsData();
  }, []);

  // Fetch patients data from the API
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

  const onChangeShare = (e) => {
    setShares({ ...shares, [e.target.name]: e.target.checked });
  };
  const handleSave = async () => {
    const timeDifference = (endTime - startTime) / (1000 * 60); // in minutes
    if (timeDifference < 30) {
        toast.error('The appointment duration must be at least 30 minutes.');
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

    const appointmentData = {
        time: startTime.toLocaleTimeString('en-US', { hour12: false }),
        from: startTime.toLocaleTimeString('en-US', { hour12: false }),
        to: endTime.toLocaleTimeString('en-US', { hour12: false }),
        hours: (endTime - startTime) / (1000 * 60 * 60),
        status: "Pending",
        date: startDate.toISOString().split('T')[0],
        patient_id: selectedPatient.id,
        doctor_id: selectedDoctor.id,
    };

    // Check if the time slot is available
    try {
        const checkResponse = await fetch(`http://localhost:5000/api/appointments/check?from=${appointmentData.from}&to=${appointmentData.to}&doctor_id=${appointmentData.doctor_id}&date=${appointmentData.date}`);
        
        if (!checkResponse.ok) {
            const checkErrorData = await checkResponse.json();
            toast.error(checkErrorData.error); // Show the specific error message
            return; // Exit if the time is not available
        }

        // If the time slot is available, save the appointment
        const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        if (!response.ok) throw new Error('Failed to save appointment');
        const responseData = await response.json();
        toast.success(responseData.message || 'Appointment saved successfully');
        closeModal();
    } catch (error) {
        console.error('Error saving appointment:', error);
        toast.error('Failed to save appointment');
    }
};


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
            <Select
              selectedPerson={selectedPatient}
              setSelectedPerson={setSelectedPatient}
              datas={patients}
            >
              <div className={`w-full flex-btn text-textGray text-sm p-4 border font-light rounded-lg ${!selectedPatient ? 'border-red-600' : 'border-border'} focus:border focus:border-subMain`}>
                {selectedPatient?.name || 'Select Patient'} <BiChevronDown className="text-xl" />
              </div>
            </Select>
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

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">
              Doctor <span className="text-red-600">*</span>
            </p>
            <Select
              selectedPerson={selectedDoctor}
              setSelectedPerson={setSelectedDoctor}
              datas={doctors}
            >
              <div className={`w-full flex-btn text-textGray text-sm p-4 border font-light rounded-lg ${!selectedDoctor ? 'border-red-600' : 'border-border'} focus:border focus:border-subMain`}>
                {selectedDoctor?.name || 'Select Doctor'} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.title ? 'Discard' : 'Cancel'}
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
