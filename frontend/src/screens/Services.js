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
        className="w-16 h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Services</h1>
      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "teeth cleaning"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.service}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* Export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          <ServiceTable data={data} onEdit={onEdit} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;
