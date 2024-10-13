import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Button, Switchi, Textarea } from '../Form'; // Removed Input from here
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AddEditServiceModal({ closeModal, isOpen, datas }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (datas?.name) {
      setName(datas?.name);
      setPrice(datas?.price);
      setDescription(datas?.description);
      setStatus(datas?.status === 'enable'); // Use 'enable' instead of 'enabled'
    }
  }, [datas]);

  const handleSave = async () => {
    try {
      const url = datas?.id 
        ? `http://localhost:5000/api/services/${datas.id}` 
        : 'http://localhost:5000/api/services';

      const method = datas?.id ? 'PUT' : 'POST';
      const body = JSON.stringify({
        name,
        price,
        date: '2024-10-12', // Adjust this date as necessary
        status: status ? 'enable' : 'disable', // Correct values
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        toast.success(datas?.id ? 'Service updated successfully' : 'Service created successfully');
        closeModal();
      } else {
        const errorData = await response.json(); // Log error details
        console.error('Error details:', errorData);
        throw new Error('Failed to save service');
      }
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas?.name ? 'Edit Service' : 'New Service'}
      width={'max-w-3xl'}
    >
      <div className="flex-colo gap-6">
        {/* Changed Input to input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (Tsh)</label>
          <input
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          color={true}
          rows={5}
        />

        {/* Status Switch */}
        <div className="flex items-center gap-2 w-full">
          <Switchi
            label="Status"
            checked={status}
            onChange={() => setStatus(!status)}
          />
          <p className={`text-sm ${status ? 'text-subMain' : 'text-textGray'}`}>
            {status ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.name ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddEditServiceModal;
