import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import Layout from '../../Layout';
import { Button } from '../../components/Form';
import { DoctorsTable } from '../../components/Tables';
import { useNavigate } from 'react-router-dom';
import AddDoctorModal from '../../components/Modals/AddDoctorModal';

function Doctors() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const filterDoctors = () => {
    let filtered = data;
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };

  const onCloseModal = () => {
    setIsOpen(false);
    fetchDoctors(); // Fetch doctors again after closing the modal to get the updated list
  };

  const preview = (data) => {
    navigate(`/doctors/preview/${data.id}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['ID', 'Full Name', 'Phone'];
    const tableRows = [];

    filteredData.forEach(doctor => {
      const doctorData = [doctor.id, doctor.fullName, doctor.phone];
      tableRows.push(doctorData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text('Doctors List', 14, 15);
    doc.save('doctors.pdf');
    toast.success('PDF exported successfully!');
  };

  useEffect(() => {
    fetchDoctors(); // Fetch doctors on component mount
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [data, searchQuery]);

  return (
    <Layout>
      {isOpen && (
        <AddDoctorModal
          closeModal={onCloseModal}
          isOpen={isOpen}
          doctor={true}
          datas={null}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Doctors</h1>

      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Search'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            label="Export PDF"
            Icon={MdOutlineCloudDownload}
            onClick={exportToPDF}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          <DoctorsTable
            data={filteredData}
            functions={{
              preview: preview,
            }}
            setData={setData} // Pass setData to update doctor list
          />
        </div>
      </div>
    </Layout>
  );
}

export default Doctors;
