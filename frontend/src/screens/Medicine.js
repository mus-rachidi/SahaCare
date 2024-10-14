import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { MedicineTable } from '../components/Tables';
import { sortsDatas } from '../components/Datas';
import AddEditMedicineModal from '../components/Modals/AddEditMedicine';

function Medicine() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [status, setStatus] = useState(sortsDatas.stocks[0]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(response.data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
    }
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      fetchMedicines(); // Refresh the list after deletion
      toast.success('Medicine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete medicine');
    }
  };

  const addOrUpdateMedicine = async (medicine) => {
    try {
      if (medicine.id) {
        await axios.put(`http://localhost:5000/api/medicines/${medicine.id}`, medicine);
      } else {
        await axios.post('http://localhost:5000/api/medicines', medicine);
      }
      fetchMedicines();
      onCloseModal();
      toast.success('Medicine saved successfully');
    } catch (error) {
      toast.error('Failed to save medicine');
    }
  };

  return (
    <Layout>
      {isOpen && (
        <AddEditMedicineModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
          addOrUpdateMedicine={addOrUpdateMedicine}
        />
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      <h1 className="text-xl font-semibold">Medicine</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "paracetamol"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.stocks}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <MedicineTable data={medicines} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </Layout>
  );
}

export default Medicine;
