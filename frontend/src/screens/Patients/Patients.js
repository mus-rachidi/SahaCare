import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Link, useNavigate } from 'react-router-dom';
import { BiPlus, BiTime } from 'react-icons/bi';
import { MdOutlineCloudDownload, MdFilterList } from 'react-icons/md';
import { BsCalendarMonth } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/Form';
import { PatientTable } from '../../components/Tables';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [patientCounts, setPatientCounts] = useState({ today: 0, monthly: 0, yearly: 0 });
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const fetchPatientData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      setOriginalData(data);
      setFilteredData(data);
    } catch (error) {
      toast.error('Error fetching patient data');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data);
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

  useEffect(() => {
    fetchPatientData();
    fetchServices();
    fetchPatientCounts();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [serviceFilter, searchQuery, originalData]);

  const filterPatients = () => {
    let filtered = originalData;

    if (serviceFilter) {
      filtered = filtered.filter(patient => patient.services === serviceFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(patient =>
        patient.FullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleServiceChange = (e) => {
    setServiceFilter(e.target.value);
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
      head: [['ID', 'Name', 'Age', 'Services', 'Email', 'Phone']],
      body: filteredData.map(patient => [
        patient.id,
        patient.FullName,
        patient.age,
        patient.services,
        patient.email,
        patient.phone,
      ]),
    });

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
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${box.color[0]}`}>
              <box.icon className="text-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-4">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "Search"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <select
              value={serviceFilter}
              onChange={handleServiceChange}
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
            >
              <option value="">All</option>
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
