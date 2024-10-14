import React, { useState, useEffect } from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { ServiceTable } from '../components/Tables';
import AddEditServiceModal from '../components/Modals/AddEditServiceModal';
import axios from 'axios';
import { sortsDatas } from '../components/Datas';

function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(sortsDatas.service[0]);
  const [serviceData, setServiceData] = useState({});

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setData(response.data); // Assumes your backend sends the services data as an array
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setServiceData({});
    fetchServices(); // Refresh after closing modal
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setServiceData(datas);
  };

  useEffect(() => {
    fetchServices(); // Fetch services when the component mounts
  }, []);

  return (
    <Layout>
      {isOpen && (
        <AddEditServiceModal
          datas={serviceData}
          isOpen={isOpen}
          closeModal={onCloseModal}
        />
      )}
      {/* Add Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 border border-border z-50 bg-subMain text-white rounded-full flex items-center justify-center fixed bottom-8 right-12 hover:shadow-lg transition"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-2xl font-semibold mt-5 mb-3">Services</h1>
      <div className="bg-white my-8 rounded-xl border border-border p-5 shadow-lg">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-4">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "teeth cleaning"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
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

          {/* Export Button */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>

        <div className="mt-8 w-full overflow-x-auto">
          <ServiceTable data={data} onEdit={onEdit} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;