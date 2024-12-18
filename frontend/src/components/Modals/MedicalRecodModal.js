import React, { useState, useEffect } from 'react';
import Modal from './Modal';
function MedicalRecodModal({ closeModal, isOpen, datas, patientId }) {
  const [recordDate, setRecordDate] = useState('');

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/medicalRecords/${patientId}`);  // Use patientId
        const data = await response.json();
        if (data && data.length > 0) {
          setRecordDate(data[0].record_date);
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    fetchMedicalRecords();
  }, [patientId]);  // Re-run when patientId changes

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={recordDate || 'Loading...'}  
      width={'max-w-4xl'}
    >
      <div className="flex-colo gap-6">
        {/* Complaints */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Complaints:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {datas?.complaints || 'N/A'}
            </p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Diagnosis:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {datas?.diagnosis || 'N/A'}
            </p>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Vital Signs:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {datas?.vital_signs || 'N/A'}
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Note:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {datas?.note || 'N/A'}
            </p>
          </div>
        </div>

        {/* Treatment */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Treatment:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {datas?.treatment || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MedicalRecodModal;
