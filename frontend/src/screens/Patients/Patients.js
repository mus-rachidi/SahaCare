import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { memberData } from '../../components/Datas';
import { Link, useNavigate } from 'react-router-dom';
import { BiPlus, BiTime } from 'react-icons/bi';
import { BsCalendarMonth } from 'react-icons/bs';
import { MdFilterList, MdRefresh } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/Form';
import { PatientTable } from '../../components/Tables';

function Patients() {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredData, setFilteredData] = useState(memberData); // State for filtered data
  const [patientCounts, setPatientCounts] = useState({ today: 0, monthly: 0, yearly: 0 }); // State for patient counts
  const navigate = useNavigate();

  // Fetch patient counts from the backend
  useEffect(() => {
    const fetchPatientCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/counts');
        const data = await response.json();
        setPatientCounts(data); // Set the patient counts from backend
      } catch (error) {
        toast.error('Error fetching patient counts');
      }
    };

    fetchPatientCounts();
  }, []); // Empty dependency array to run once on component mount

  // Define the boxes array with fetched data
  const boxes = [
    {
      id: 1,
      title: 'Today Patients',
      value: patientCounts.today.toString(),
      color: ['bg-subMain', 'text-subMain'],
      icon: BiTime,
    },
    {
      id: 2,
      title: 'Monthly Patients',
      value: patientCounts.monthly.toString(),
      color: ['bg-orange-500', 'text-orange-500'],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: 'Yearly Patients',
      value: patientCounts.yearly.toString(),
      color: ['bg-green-500', 'text-green-500'],
      icon: MdFilterList,
    },
  ];

  // Function to handle the search
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setFilteredData(data); // Update state with fetched data
    } catch (error) {
      toast.error("Error fetching patients");
    }
  };

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload(); // Refresh the current page
  };

  // Preview payment function
  const previewPayment = (id) => {
    navigate(`/patients/preview/${id}`);
  };

  return (
    <Layout>
      <Link
        to="/patients/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-2xl font-bold text-gray-800">Patients</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
  {boxes.map((box) => (
    <div
      key={box.id}
      className="bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex items-center gap-4 rounded-lg border border-gray-200 p-6"
    >
      <div className="w-3/4">
        <h2 className="text-sm font-medium text-gray-600">{box.title}</h2>
        <h2 className="text-2xl my-4 font-semibold text-gray-900">{box.value}</h2>
        <p className="text-xs text-gray-500">
          Total Patients <span className={box.color[1]}>{box.value}</span>{' '}
          {box.title === 'Today Patients'
            ? 'today'
            : box.title === 'Monthly Patients'
            ? 'this month'
            : 'this year'}
        </p>
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${box.color[0]}`}
      >
        <box.icon className="text-xl" />
      </div>
    </div>
  ))}
</div>


      <div
  data-aos="fade-up"
  data-aos-duration="1000"
  data-aos-delay="10"
  data-aos-offset="200"
  className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
>
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <input
      type="text"
      placeholder='Search by full name'
      className="col-span-3 h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
      onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }} // Trigger search on Enter key
    />
    <Button
      label="Fillter"
      Icon={MdFilterList}
      onClick={handleSearch} // Call the search function here
      className="h-14"
    />
    <Button
      label="Refresh"
      Icon={MdRefresh}
      onClick={handleRefresh} // Call the refresh function here
      className="h-14"
    />
  </div>
  {/* Fixed height and overflow for scrollable patient list */}
  <div className="mt-8 w-full h-96 overflow-y-auto">
  <PatientTable
  data={filteredData}
  setData={setFilteredData}  // Pass the state setter here
  functions={{
    preview: previewPayment,
  }}
  used={false}
/>

  </div>
</div>

    </Layout>
  );
}

export default Patients;
