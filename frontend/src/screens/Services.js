import React, { useState, useEffect } from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { ServiceTable } from '../components/Tables';
import AddEditServiceModal from '../components/Modals/AddEditServiceModal';
import axios from 'axios';
import { sortsDatas } from '../components/Datas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState(sortsDatas.service[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceData, setServiceData] = useState({});

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const filterServices = () => {
    let filtered = data;

    // Filter by status
    if (status.id === 2) { // Enabled
      filtered = filtered.filter(service => service.status === "enable");
    } else if (status.id === 3) { // Disabled
      filtered = filtered.filter(service => service.status === "disable");
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setServiceData({});
    fetchServices(); // Refresh the services after closing the modal
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setServiceData(datas);
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Name', 'Status']], // Change the headers according to your data structure
      body: filteredData.map(service => [service.id, service.name, service.status]), // Adjust based on your service structure
    });
    doc.save('services.pdf');
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [data, status, searchQuery]);

  return (
    <Layout>
      {isOpen && (
        <AddEditServiceModal
          datas={serviceData}
          isOpen={isOpen}
          closeModal={onCloseModal}
        />
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-2xl font-semibold mt-5 mb-3">Services</h1>
      <div className="bg-white my-8 rounded-xl border border-border p-5 shadow-lg">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-4">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.service}
            >
              <div className="w-full flex items-center justify-between text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport} // Call the export function
          />
        </div>

        <div className="mt-8 w-full overflow-x-auto">
          <ServiceTable data={filteredData} onEdit={onEdit} setData={setData} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;
