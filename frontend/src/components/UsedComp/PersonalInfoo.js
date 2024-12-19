import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate here
import { toast } from 'react-hot-toast';
import { IoArrowBackOutline } from 'react-icons/io5';

function PatientInfoo() {
  const { id } = useParams(); // Get the patient ID from the URL
  const navigate = useNavigate(); // Use useNavigate here
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    FullName: '',
    gender: '',
    age: '',
    phone: '',
    email: '',
    services: '',
    price: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatient(data);
        setFormData({
          FullName: data.FullName,
          gender: data.gender,
          age: data.age,
          phone: data.phone,
          email: data.email,
          services: data.services,
          price: data.price,
        });
      } catch (error) {
        toast.error('Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}/update-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the updated data
      });

      if (!response.ok) {
        throw new Error('Failed to update patient data');
      }

      toast.success('Patient data updated successfully');
      navigate(`/patients/preview/${id}`); // Use navigate instead of history.push
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Loading patient information...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">No patient information available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-700 border-b pb-4 mb-4">Patient Information</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600">Full Name:</label>
              <input
                type="text"
                name="FullName"
                value={formData.FullName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Gender:</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Services:</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-600">Price (MAD):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mt-4 flex justify-between">
              {/* <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                onClick={() => navigate(`/patients/preview/${id}`)} // Use navigate here
              >
                <IoArrowBackOutline /> Back
              </button> */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update Patient Info
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientInfoo;
