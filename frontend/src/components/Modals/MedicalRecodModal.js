import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '../Form';
import { FiEye } from 'react-icons/fi';
import { MedicineDosageTable } from '../Tables';
import { medicineData } from '../Datas';
import { useNavigate } from 'react-router-dom';

function MedicalRecodModal({ closeModal, isOpen, datas }) {
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const navigate = useNavigate();

  // Function to handle tooth selection
  const handleToothClick = (toothNumber) => {
    setSelectedTeeth((prevSelectedTeeth) =>
      prevSelectedTeeth.includes(toothNumber)
        ? prevSelectedTeeth.filter((tooth) => tooth !== toothNumber) // Deselect
        : [...prevSelectedTeeth, toothNumber] // Select
    );
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="12 May 2021"
      width={'max-w-4xl'}
    >
      <div className="flex-colo gap-6">
        {datas?.data?.slice(0, 3).map((data) => (
          <div key={data.id} className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12 md:col-span-3">
              <p className="text-sm font-medium">{data.title}:</p>
            </div>
            <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
              <p className="text-xs text-main font-light leading-5">
                {data.value}
              </p>
            </div>
          </div>
        ))}
        
        {/* Tooth Chart */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Tooth Chart:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <ToothChart onToothClick={handleToothClick} selectedTeeth={selectedTeeth} />
            <p>Selected Teeth: {selectedTeeth.join(', ')}</p>
          </div>
        </div>

        {/* View Invoice */}
        <div className="flex justify-end items-center w-full">
          <div className="md:w-3/4 w-full">
            <Button
              label="View Invoice"
              Icon={FiEye}
              onClick={() => {
                closeModal();
                navigate(`/invoices/preview/198772`);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Tooth Chart Component with Image
const ToothChart = ({ onToothClick, selectedTeeth }) => {
  const teeth = Array.from({ length: 32 }, (_, i) => i + 1); // Create 32 teeth for adult

  return (
    <div className="grid grid-cols-8 gap-2">
      {teeth.map((toothNumber) => (
        <div
          key={toothNumber}
          className={`relative p-4 cursor-pointer ${
            selectedTeeth.includes(toothNumber) ? 'bg-blue-400' : 'bg-white'
          }`}
          onClick={() => onToothClick(toothNumber)}
        >
          {/* Here you can use a background image for the tooth */}
          <img
            src={`/path-to-your-tooth-chart-images/tooth-${toothNumber}.png`}
            alt={`Tooth ${toothNumber}`}
            className="w-full h-full object-cover"
          />
          <p className="absolute top-1 left-1 text-sm text-black">
            {toothNumber}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecodModal;
