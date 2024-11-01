import React, { useEffect, useState } from 'react';
import Layout from '../../Layout';
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button, Checkbox } from '../../components/Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import Uploader from '../../components/Uploader';

function NewMedicalRecode() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [recordData, setRecordData] = useState({
    complaints: '',
    diagnosis: '',
    vitalSigns: '',
    quantity: '',
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
      .filter(t => t.checked)
      .map(t => t.name)
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
          quantity: recordData.quantity || 0,
          complaints: recordData.complaints,
          vital_signs: recordData.vitalSigns,
        }),
      });
      if (!response.ok) throw new Error('Error saving medical record');
      toast.success('Medical record saved successfully');
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
  
          {/* Attachment Section */}
          <div className="space-y-4">
        <label className="text-sm font-semibold">Attachments</label>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((imageUrl, i) => {
              const fullImageUrl = `http://localhost:5000/api/medicalrecords${imageUrl}`;
              return (
                <div className="relative" key={i}>
                  <img
                    src={fullImageUrl}
                    alt={`Uploaded file ${i + 1}`}
                    className="w-full h-40 rounded-lg object-cover cursor-pointer"
                    onClick={() => openModal(fullImageUrl)}
                  />
                  <button
                    onClick={() => confirmDeleteImage(imageUrl)}
                    className="bg-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-1 -right-1 shadow-md hover:shadow-lg"
                  >
                    <FaTimes className="text-red-500" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No attachments uploaded yet.</p>
          )}
        </div>
        <Uploader setImage={handleImageUpload} patientId={id} />
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-white rounded-full p-1"
            >
              <FaTimes className="text-red-500 text-lg" />
            </button>
            <img
              src={selectedImage}
              alt="Expanded view"
              className="w-auto max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this image?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteConfirm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImageDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
  
          {/* Save Button */}
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={saveMedicalRecord}
            className="w-full mt-6 bg-subMain hover:bg-subMainDark text-white font-semibold py-3 rounded-lg"
          />
        </div>
      </div>
    </div>
  </Layout>
  
  );
}

export default NewMedicalRecode;
