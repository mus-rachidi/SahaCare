import React, { useEffect, useState } from 'react';
import Layout from '../../Layout';
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button, Checkbox } from '../../components/Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import Uploader from '../../components/Uploader';
import { useNavigate } from 'react-router-dom';
function NewMedicalRecode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [recordData, setRecordData] = useState({
    complaints: '',
    diagnosis: '',
    vitalSigns: '',
    note: '',
  });
  const [servicesData, setServicesData] = useState([]);
  const [treatmeants, setTreatmeants] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`);
      if (!response.ok) throw new Error('Error fetching patient data');
      const data = await response.json();
      setPatientData(data);
    } catch (error) {
      toast.error('Error fetching patient data');
    }
  };

  const fetchServicesData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/services`);
      if (!response.ok) throw new Error('Error fetching services data');
      const data = await response.json();
      setServicesData(data);
      const initialTreatments = data.map(service => ({ name: service.name, checked: false }));
      setTreatmeants(initialTreatments);
    } catch (error) {
      toast.error('Error fetching services data');
    }
  };

  const fetchPatientImages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/${id}/images`);
      if (!response.ok) throw new Error('Error fetching patient images');
      const data = await response.json();
      setImages(data.map(image => image.image_url)); // Update to match the correct key
    } catch (error) {
      toast.error('Error fetching patient images');
    }
  };

  const onChangeTreatmeants = (e) => {
    const { name, checked } = e.target;
    setTreatmeants((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, checked } : item
      )
    );
  };


  const saveMedicalRecord = async () => {

    const recordDate = new Date().toISOString().split('T')[0];
    const selectedTreatments = treatmeants
      .filter((t) => t.checked)
      .map((t) => t.name)
      .join(', ');

    try {
      const response = await fetch(`http://localhost:5000/api/medicalrecords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: id,
          doctor_id: null,
          record_date: recordDate,
          diagnosis: recordData.diagnosis,
          treatment: selectedTreatments,
          medicine: '',
          dosage: '',
          complaints: recordData.complaints,
          vital_signs: recordData.vitalSigns,
          note: recordData.note, // Fixed typo for `note`
        }),
      });

      if (!response.ok) throw new Error('Error saving medical record');
      toast.success('Medical record saved successfully');

      // Navigate back after successful save
      navigate(`/patients/preview/${id}`);
    } catch (error) {
      toast.error('Error saving medical record');
    }
  };

  const handleImageUpload = (imageUrl) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  const confirmDeleteImage = (imageUrl) => {
    setImageToDelete(imageUrl);
    setIsDeleteConfirmOpen(true);
  };

  const handleImageDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageToDelete }),
      });
      if (!response.ok) throw new Error('Error deleting image');
      toast.success('Image deleted successfully');
      setImages((prevImages) => prevImages.filter(image => image !== imageToDelete));
      closeDeleteConfirm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setImageToDelete(null);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  useEffect(() => {
    fetchPatientData();
    fetchServicesData();
    fetchPatientImages();
  }, [id]);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to={`/patients/preview/${id}`}
          className="bg-white border border-subMain border-dashed rounded-lg p-3 text-md text-gray-700 hover:text-gray-900"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-2xl font-bold">New Medical Record</h1>
      </div>

      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        {/* Patient Information Section */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-border p-6 lg:sticky top-28 flex flex-col items-center gap-4">
          <img
            src="/images/a.png"
            alt="Patient"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="text-center">
            <h2 className="text-lg font-semibold">{patientData.FullName}</h2>
            <p className="text-sm text-textGray">{patientData.email}</p>
            <p className="text-sm">{patientData.phone}</p>
            <span className="text-xs text-subMain bg-text font-medium py-1 px-4 rounded-full border border-subMain">
              {patientData.age}
            </span>
          </div>
        </div>

        {/* Medical Record Form Section */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-border p-6 space-y-6">
          <div className="space-y-5">
            {/* Complaints Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Complaints</label>
              <input
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-subMain"
                placeholder="Bad breath, toothache, ..."
                value={recordData.complaints}
                onChange={(e) => setRecordData({ ...recordData, complaints: e.target.value })}
              />
            </div>

            {/* Diagnosis Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Diagnosis</label>
              <input
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-subMain"
                placeholder="Gingivitis, Periodontitis, ..."
                value={recordData.diagnosis}
                onChange={(e) => setRecordData({ ...recordData, diagnosis: e.target.value })}
              />
            </div>

            {/* Vital Signs Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Vital Signs</label>
              <input
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-subMain"
                placeholder="Blood pressure, Pulse, ..."
                value={recordData.vitalSigns}
                onChange={(e) => setRecordData({ ...recordData, vitalSigns: e.target.value })}
              />
            </div>
            {/* Note Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Note</label>
              <textarea
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-subMain"
                placeholder="Note...."
                rows="6" // Adjust the rows for the desired height
                value={recordData.note}
                onChange={(e) => setRecordData({ ...recordData, note: e.target.value })}
              />
            </div>

            {/* Treatment Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Treatment</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {servicesData.map((item) => (
                  <Checkbox
                    label={item.name}
                    checked={treatmeants.find((i) => i.name === item.name)?.checked || false}
                    onChange={onChangeTreatmeants}
                    name={item.name}
                    key={item.id}
                  />
                ))}
              </div>
            </div>

   
            {/* Save Button */}
            <div className="flex gap-4 mt-6">
              <Link
                to={`/patients/preview/${id}`}
                className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-lg text-center"
              >
                Back
              </Link>
              <Button
                label="Save"
                Icon={HiOutlineCheckCircle}
                onClick={saveMedicalRecord}
                className="w-full bg-subMain hover:bg-subMainDark text-white font-semibold py-3 rounded-lg"
              />
            </div>

          </div>
        </div>
      </div>
    </Layout>

  );
}

export default NewMedicalRecode;
