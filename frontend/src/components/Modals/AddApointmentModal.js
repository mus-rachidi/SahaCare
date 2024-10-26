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
import PatientMedicineServiceModal from './PatientMedicineServiceModal';

function AddAppointmentModal({ closeModal, isOpen, datas }) {
  const [services, setServices] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [shares, setShares] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [open, setOpen] = useState(false);

  // Fetch servicesData from the API
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServicesData(data);
        setServices(data[0]); // Set the initial selected service if needed
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      }
    };
    fetchServicesData();
  }, []);

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
        setSelectedDoctor(formattedDoctors[0]); // Set the initial selected doctor if needed
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctorsData();
  }, []);

  // Set data for edit mode
  useEffect(() => {
    if (datas?.title) {
      setServices(datas?.service);
      setStartTime(datas?.start);
      setEndTime(datas?.end);
      setShares(datas?.shareData);
    }
  }, [datas]);

  // onChange share
  const onChangeShare = (e) => {
    setShares({ ...shares, [e.target.name]: e.target.checked });
  };

  // Handle form submission
 // Handle form submission
const handleSave = async () => {
  const appointmentData = {
    time: startTime.toLocaleTimeString('en-US', { hour12: false }), // Format as HH:MM:SS
    from: startTime.toLocaleTimeString('en-US', { hour12: false }),
    to: endTime.toLocaleTimeString('en-US', { hour12: false }),
    hours: (endTime - startTime) / (1000 * 60 * 60), // Duration in hours
    status: status.name,
    date: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    patient_id: datas?.patientId || 5, // Use an actual patient ID if available
    doctor_id: selectedDoctor.id,
  };

  try {
    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) throw new Error('Failed to save appointment');
    toast.success('Appointment saved successfully');
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
      {open && (
        <PatientMedicineServiceModal
          closeModal={() => setOpen(!isOpen)}
          isOpen={open}
          patient={true}
        />
      )}
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
            <Input
              label="Patient Name"
              color={true}
              placeholder={
                datas?.title
                  ? datas.title
                  : 'Select Patient and patient name will appear here'
              }
            />
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-subMain flex-rows border border-dashed border-subMain text-sm py-3.5 sm:mt-6 sm:col-span-2 rounded"
          >
            <BiPlus /> Add
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Purpose of visit</p>
            <Select
              selectedPerson={services}
              setSelectedPerson={setServices}
              datas={servicesData}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {services?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
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
            <p className="text-black text-sm">Doctor</p>
            <Select
              selectedPerson={selectedDoctor}
              setSelectedPerson={setSelectedDoctor}
              datas={doctors}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {selectedDoctor?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Status</p>
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.status}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        <Textarea
          label="Description"
          placeholder={
            datas?.message
              ? datas.message
              : 'She will be coming for a checkup.....'
          }
          color={true}
          rows={5}
        />

        <div className="flex-col flex gap-8 w-full">
          <p className="text-black text-sm">Share with patient via</p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <Checkbox
              name="email"
              checked={shares.email}
              onChange={onChangeShare}
              label="Email"
            />
            <Checkbox
              name="sms"
              checked={shares.sms}
              onChange={onChangeShare}
              label="SMS"
            />
            <Checkbox
              checked={shares.whatsapp}
              name="whatsapp"
              onChange={onChangeShare}
              label="WhatsApp"
            />
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
