import React, { useEffect } from 'react';
import axios from 'axios';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button } from '../components/Form';
import { ReceptionsTable } from '../components/Tables';
import AddReceptionModal from '../components/Modals/AddReceptionModal';

function Receptions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [error, setError] = React.useState(null); // Add error state

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const preview = (data) => {
    setIsOpen(true);
    setData(data);
  };

  // Fetch receptions data from the backend
  useEffect(() => {
    const fetchReceptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/receptions'); // Adjust the endpoint as necessary
        setData(response.data); // Set the data state with the fetched data
      } catch (err) {
        setError(err.message); // Set the error state
        toast.error('Failed to load receptions data'); // Show error toast
      } 
      // finally {
      //   setLoading(false); // Set loading to false after fetching
      // }
    };

    fetchReceptions();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading message
  // }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <Layout>
      {
        // add doctor modal
        isOpen && (
          <AddReceptionModal
            closeModal={onCloseModal}
            isOpen={isOpen}
            doctor={false}
            datas={data}
          />
        )
      }
      {/* add button */}
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
        {/* datas */}
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Search "Amina Mwakio"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <ReceptionsTable
            doctor={false}
            data={data} // Use the fetched data
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
