import React, { useEffect } from 'react';
import axios from 'axios';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button } from '../components/Form';
import { ReceptionsTable } from '../components/Tables';
import AddReceptionModal from '../components/Modals/AddReceptionModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Receptions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null); // Add error state
  const [searchTerm, setSearchTerm] = React.useState(''); // State for search input

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const preview = (data) => {
    setIsOpen(true);
    setData(data);
  };

  useEffect(() => {
    const fetchReceptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/receptions'); // Adjust the endpoint as necessary
        setData(response.data); // Set the data state with the fetched data
      } catch (err) {
        setError(err.message); // Set the error state
        toast.error('Failed to load receptions data'); // Show error toast
      } 
    };

    fetchReceptions();
  }, [searchTerm]); // Updated to only depend on searchTerm

  // Filter the data based on the search term
  const filteredData = Array.isArray(data) ? data.filter(item => 
    item.fullName && item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Function to export data as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Full Name", "Title", "Email", "Phone"]; // Update based on your data structure
    const tableRows = [];

    // Add data rows
    filteredData.forEach(item => {
      const itemData = [
        item.fullName,
        item.title, // Assuming your data has a date field
        item.email, // Assuming your data has a time field
        item.phone // Assuming your data has a reason field
      ];
      tableRows.push(itemData);
    });

    // Generate the table
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Receptions Report", 14, 15);
    doc.save("receptions_report.pdf");
  };

  return (
    <Layout>
      {
        // Add doctor modal
        isOpen && (
          <AddReceptionModal
            closeModal={onCloseModal}
            isOpen={isOpen}
            doctor={false}
            datas={data}
          />
        )
      }
      {/* Add button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/*  */}
      <h1 className="text-xl font-semibold">Receptions</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* Search input */}
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
             type="text"
             placeholder='Search "Search"'
             className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>

          {/* Export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={exportToPDF} // Call export function
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <ReceptionsTable
            doctor={false}
            receptions={filteredData} // Updated to use filtered data
            functions={{
              preview: preview,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Receptions;
