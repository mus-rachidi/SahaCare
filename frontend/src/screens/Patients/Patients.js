import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { memberData } from '../../components/Datas';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/Form';
import { PatientTable } from '../../components/Tables';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState(''); // State for service filter
  const [filteredData, setFilteredData] = useState(memberData);
  const [patientCounts, setPatientCounts] = useState({ today: 0, monthly: 0, yearly: 0 });
  const [services, setServices] = useState([]); // State for services
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPatientData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      setFilteredData(data); // Set fetched patient data
    } catch (error) {
      toast.error('Error fetching patient data');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data); // Set fetched services
    } catch (error) {
      toast.error('Error fetching services');
    }
  };

  const fetchPatientCounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/counts');
      const data = await response.json();
      setPatientCounts(data);
    } catch (error) {
      toast.error('Error fetching patient counts');
    }
  };

  useEffect(() => {
    fetchPatientData();
    fetchServices(); // Fetch services
    fetchPatientCounts();
  }, [location]);

  const filterPatients = () => {
    let filtered = memberData; // Start with the original data

    if (serviceFilter) {
        filtered = filtered.filter(patient => patient.services === serviceFilter);
    }

    if (searchQuery) {
        filtered = filtered.filter(patient =>
            patient.FullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    setFilteredData(filtered); // Update filtered data
};


  // Handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterPatients(); // Call filter function
  };

  // Handle service filter change
  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setServiceFilter(selectedService);
    
    // Reset filter to all if "All" is selected
    if (selectedService === "") {
      setFilteredData(memberData); // Show all patients
    } else {
      filterPatients(); // Call filter function
    }
  };

  const handleRefresh = () => {
    fetchPatientData();
  };

  const previewPayment = (id) => {
    navigate(`/patients/preview/${id}`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text('Patients Report', 20, 10);

    doc.autoTable({
      head: [['ID', 'Name', 'Age', 'Service', 'Address', 'Phone']],
      body: filteredData.map(patient => [
        patient.id,
        patient.FullName,
        patient.age,
        patient.service,
        patient.email,
        patient.phone,
      ]),
    });

    // Save the PDF
    doc.save('patients_report.pdf');
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
        {/* Patient counts boxes here */}
      </div>

      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-4">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "Search"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)} // Use handleSearch
            />

            {/* Service Select Box */}
            <select
              value={serviceFilter}
              onChange={handleServiceChange}
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
            >
              <option value="">All</option> {/* "All" option */}
              {services.map(service => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>

          </div>
          <Button
            label="Export PDF"
            Icon={MdOutlineCloudDownload}
            onClick={exportPDF}
            className="h-14"
          />
        </div>

        <div className="mt-8 w-full h-96 overflow-y-auto">
          <PatientTable
            data={filteredData}
            setData={setFilteredData}
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
