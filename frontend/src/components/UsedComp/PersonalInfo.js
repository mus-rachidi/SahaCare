import React, { useRef, useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Uploder from '../Uploader';
import { sortsDatas } from '../Datas';
import { Button, Select } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

function PersonalInfo({ titles }) {
  const [services, setServices] = useState([]);

  const navigate = useNavigate();
  const titleRef = useRef(sortsDatas.title[0]);
  const genderRef = useRef(null); // Initialize as null
  const fullNameRef = useRef('John Doe');
  const phoneRef = useRef('123-456-7890');
  const emailRef = useRef('example@example.com');
  const addressRef = useRef('123 Main St');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [genderDisplay, setGenderDisplay] = useState('Select Gender'); // State to display selected gender
  const [selectedService, setSelectedService] = useState(null);

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


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        setServices(data); // Assuming data is an array of services
      } catch (error) {
        toast.error('Failed to fetch services: ' + error.message);
      }
    };

    fetchServices();
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if gender is selected
    if (!genderRef.current) {
      toast.error('Please select a gender.'); // Show error if gender is not selected
      return;
    }

    const patientData = {
      FullName: fullNameRef.current.value || 'John Doe',
      image: 'http://example.com/image.jpg',
      admin: false,
      email: emailRef.current.value || 'example@example.com',
      phone: phoneRef.current.value || '123-456-7890',
      age: age || 0,
      gender: genderRef.current.name || 'Not specified', // Get the name of the selected gender
      address: addressRef.current.value || '123 Main St',
      price: price || 0,
      totalAppointments: 0,
      date: dob || '2024-01-01',
      services: selectedService?.name || 'Not specified',
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
        navigate('/patients');
      } else {
        toast.error('Error: ' + result.message);
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          setSelectedPerson={(person) => {
            genderRef.current = person; // Update genderRef with the selected person
            setGenderDisplay(person.name); // Update state to reflect selected gender
          }}
          datas={sortsDatas.genderFilter} // Ensure this only contains 'Male' and 'Female'
        >
          <div className="w-full flex items-center justify-between text-gray-500 text-sm p-4 border border-gray-300 rounded-lg focus:border-blue-500">
            {genderDisplay || 'Select Gender'} <BiChevronDown className="text-xl" />
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
          required
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500"
        />
      </div>

     {/* Services */}
    <div className="flex flex-col w-full gap-3">
      <p className="text-black text-sm">Services</p>
      <Select
        selectedPerson={selectedService}
        setSelectedPerson={(service) => {
          setSelectedService(service); // Update state with selected service
        }}
        datas={services} // Use the fetched services here
      >
        <div className="w-full flex items-center justify-between text-gray-500 text-sm p-4 border border-gray-300 rounded-lg focus:border-blue-500">
          {selectedService?.name || 'Select Service'} <BiChevronDown className="text-xl" />
        </div>
      </Select>
    </div>



      {/* Price */}
      <div className="flex flex-col w-full gap-3">
        <p className="text-black text-sm">Price (MAD)</p>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="input-class p-4 border border-gray-300 rounded-lg focus:border-blue-500"
          placeholder="Enter Price"
        />
      </div>

      {/* Display Age */}
      <div className="flex items-center">
        <p className="text-gray-700">Age: {age}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Link
          to="/patients"
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