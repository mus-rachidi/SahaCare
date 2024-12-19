import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Select } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import Access from '../Access';
import Uploader from '../Uploader';

function AddDoctorModal({ closeModal, isOpen, doctor }) {
  const [title, setTitle] = useState(sortsDatas.title[0]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(''); // Handle image upload
  const [access, setAccess] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          title: title.name,
          email,
          phone,
          password,
          image, // Include image URL/path
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add doctor');
        return;
      }

      const newDoctor = await response.json();
      toast.success('Doctor added successfully');
      console.log('New Doctor:', newDoctor);
      closeModal(); // Close the modal on success
    } catch (error) {
      toast.error('An error occurred while adding the doctor');
      console.error(error);
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={doctor ? 'Edit Doctor' : 'Add Doctor'}
      width={'max-w-3xl'}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3 flex-col col-span-6 mb-6">
          <p className="text-sm">Profile Image</p>
          <Uploader setImage={setImage} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <label>
            <span className="text-sm">Full Name</span>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </label>

          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Title</p>
            <Select
              selectedPerson={title}
              setSelectedPerson={setTitle}
              datas={sortsDatas.title}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {title.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <label>
            <span className="text-sm">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            <span className="text-sm">Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </label>
        

        <label>
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </label>
</div>
        <div className="w-full">
          <Access setAccess={setAccess} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>
          <Button label="Save" Icon={HiOutlineCheckCircle} type="submit" />
        </div>
      </form>
    </Modal>                  
  );
}

export default AddDoctorModal;
