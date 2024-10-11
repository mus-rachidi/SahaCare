import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import Uploder from '../Uploader';
import { sortsDatas } from '../Datas';
import { Button, Select } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

function PersonalInfo({ titles }) {
  const navigate = useNavigate(); // Initialize navigate here
  const titleRef = useRef(sortsDatas.title[0]);
  const genderRef = useRef(sortsDatas.genderFilter[0]);
  const fullNameRef = useRef('John Doe'); // Default value
  const phoneRef = useRef('123-456-7890'); // Default value
  const emailRef = useRef('example@example.com'); // Default value
  const addressRef = useRef('123 Main St'); // Default value
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');

  const handleDobChange = (event) => {
    const date = new Date(event.target.value);
    setDob(event.target.value);
    const today = new Date();
    const calculatedAge = today.getFullYear() - date.getFullYear();
    const monthDifference = today.getMonth() - date.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
      setAge(calculatedAge - 1);
    } else {
      setAge(calculatedAge);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const patientData = {
      FullName: fullNameRef.current.value || 'John Doe', // Default name
      image: 'http://example.com/image.jpg', // Default image URL
      admin: false, // Default admin status
      email: emailRef.current.value || 'example@example.com', // Default email
      phone: phoneRef.current.value || '123-456-7890', // Default phone number
      age: age || 0, // Default age
      gender: genderRef.current.name || 'Not specified', // Default gender
      address: addressRef.current.value || '123 Main St', // Default address
      totalAppointments: 0, // Default total appointments
      date: dob || '2024-01-01', // Default date (or you can set it to the current date)
    };
    

    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        navigate('/patients'); // Now navigate is defined
      } else {
        toast.error('Error: ' + result.message);
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Uploader */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-sm text-gray-700">Profile Image</p>
        <Uploder />
      </div>
      {/* Select Title */}
      {titles && (
        <div className="flex flex-col w-full gap-3">
          <p className="text-black text-sm">Title</p>
          <Select
            selectedPerson={titleRef.current}
            setSelectedPerson={(person) => (titleRef.current = person)}
            datas={sortsDatas.title}
          >
            <div className="w-full flex items-center justify-between text-gray-500 text-sm p-4 border border-gray-300 rounded-lg focus:border-blue-500">
              {titleRef.current?.name} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>
      )}

      {/* Full Name */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Full Name</p>
        <input 
          ref={fullNameRef} 
          type="text" 
          placeholder="Full Name" 
          required 
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500" 
        />
      </div>

      {/* Phone Number */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Phone Number</p>
        <input 
          ref={phoneRef} 
          type="tel" 
          placeholder="Phone Number" 
           
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500" 
        />
      </div>
      
      {/* Email */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Email</p>
        <input 
          ref={emailRef} 
          type="email" 
          placeholder="Email" 
           
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500" 
        />
      </div>

      {/* Address */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Address</p>
        <input 
          ref={addressRef} 
          type="text" 
          placeholder="Address" 
           
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500" 
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Gender</p>
        <Select
          selectedPerson={genderRef.current}
          setSelectedPerson={(person) => (genderRef.current = person)}
          datas={sortsDatas.genderFilter}
        >
          <div className="w-full flex items-center justify-between text-gray-500 text-sm p-4 border border-gray-300 rounded-lg focus:border-blue-500">
            {genderRef.current?.name} <BiChevronDown className="text-xl" />
          </div>
        </Select>
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Date of Birth</p>
        <input
          type="date"
          value={dob}
          onChange={handleDobChange}
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500"
          
        />
      </div>

      {/* Display Age */}
      <div className="flex items-center">
        <p className="text-gray-700">Age: {age}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Link 
          to="/patients" // Use Link for navigation
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md flex items-center justify-center"
        >
          <IoArrowBackOutline className="mr-2" /> Cancel
        </Link>
        <Button
          label={'Save Changes'}
          Icon={HiOutlineCheckCircle}
          type="submit"
        />
      </div>
    </form>
  );
}

export default PersonalInfo;
