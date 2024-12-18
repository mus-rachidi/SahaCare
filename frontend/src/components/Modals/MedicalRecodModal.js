import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FaTimes } from 'react-icons/fa';
import Uploader from '../../components/Uploader';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

function MedicalRecodModal({ closeModal, isOpen, datas, patientId }) {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // For the image modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [recordDate, setRecordDate] = useState('');
  const { id } = useParams();

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

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true); // Open the image modal
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false); // Close the image modal
    setSelectedImage(null);
  };

  const handleImageUpload = (imageUrl) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/medicalRecords/${patientId}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setRecordDate(data[0].record_date);
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    fetchMedicalRecords();
  }, [patientId]);

  useEffect(() => {
    fetchPatientImages();
  }, [id]);

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} width={'max-w-4xl'}>
      <div className="flex-colo gap-6">
        {/* Complaints */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Complaints:
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-9"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: '#fafafa',
              maxHeight: '150px', // Limit height
              overflowY: 'auto', // Enable scrolling
              wordWrap: 'break-word', // Ensure long words wrap
            }}
          >
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
              {datas?.complaints || 'N/A'}
            </p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Diagnosis:
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-9"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: '#fafafa',
              maxHeight: '150px', // Limit height
              overflowY: 'auto', // Enable scrolling
              wordWrap: 'break-word', // Ensure long words wrap
            }}
          >
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
              {datas?.diagnosis || 'N/A'}
            </p>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Vital Signs:
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-9"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: '#fafafa',
              maxHeight: '150px', // Limit height
              overflowY: 'auto', // Enable scrolling
              wordWrap: 'break-word', // Ensure long words wrap
            }}
          >
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
              {datas?.vital_signs || 'N/A'}
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Note:
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-9"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: '#fafafa',
              maxHeight: '150px', // Limit height
              overflowY: 'auto', // Enable scrolling
              wordWrap: 'break-word', // Ensure long words wrap
            }}
          >
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
              {datas?.note || 'N/A'}
            </p>
          </div>
        </div>

        {/* Treatment */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              Treatment:
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-9"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              backgroundColor: '#fafafa',
              maxHeight: '150px', // Limit height
              overflowY: 'auto', // Enable scrolling
              wordWrap: 'break-word', // Ensure long words wrap
            }}
          >
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
              {datas?.treatment || 'N/A'}
            </p>
          </div>
        </div>

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
                      onClick={() => openImageModal(fullImageUrl)}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No attachments uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <Modal closeModal={closeImageModal} isOpen={isImageModalOpen} width={'max-w-5xl'}>
          <div className="flex justify-center items-center">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                className="absolute top-0 right-0 p-2 text-white bg-black bg-opacity-50 rounded-full"
                onClick={closeImageModal}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

export default MedicalRecodModal;
