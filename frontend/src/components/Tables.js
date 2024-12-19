import React, { useState, useEffect } from 'react';
import { MenuSelect } from './Form';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit, FiEye } from 'react-icons/fi';
import { RiDeleteBin6Line, RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap';
const tdclass = 'text-start text-sm py-4 px-2 whitespace-nowrap';

export function Transactiontable({ data, functions }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

    return `${formattedDate} - ${formattedTime}`;
  };

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; 
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700';

  return (
    <div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table-auto w-full mt-4">
          <thead className="bg-dry rounded-md overflow-hidden">
            <tr>
              <th className={`${thclass} sticky top-0`}>#</th>
              <th className={`${thclass} sticky top-0`}>Patient Name</th>
              <th className={`${thclass} sticky top-0`}>Last Update</th>
              <th className={`${thclass} sticky top-0`}>Amount</th>
              <th className={`${thclass} sticky top-0`}>Price</th>
              <th className={`${thclass} sticky top-0`}>Status</th>
              <th className={`${thclass} sticky top-0`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((patient, index) => (
              <tr key={patient.id} className="border-b border-border hover:bg-greyed transitions">
                <td className={tdclass}>{index + 1}</td>
                <td className={tdclass}>{patient.FullName}</td>
                <td className={tdclass}>
                  {patient.PaymentDate ? formatDateTime(patient.PaymentDate) : 'N/A'}
                </td>
                <td className={tdclass}>
                  {Number(patient.amount) > 0 ? (
                    <span className="text-green-500">
                      {(Number(patient.amount) || 0).toFixed(2)} MAD
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {(Number(patient.amount) || 0).toFixed(2)} MAD
                    </span>
                  )}
                </td>
                <td className={tdclass}>
                  <span className="text-black">
                    {(Number(patient.price) || 0).toFixed(2)} MAD
                  </span>
                </td>

                <td className={tdclass}>
                  <span
                    className={`
                      py-1 px-4 
                      rounded-xl 
                      text-xs 
                      bg-opacity-10 
                      ${patient.status === 'Paid' ? 'bg-green-500 text-green-500' : ''}
                      ${patient.status === 'Pending' ? 'bg-orange-500 text-orange-500' : ''}
                      ${patient.status === 'Cancel' ? 'bg-red-500 text-red-500' : ''}
                    `}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className={tdclass}>
                  <button
                    onClick={() => functions.edit(patient.id)}
                    className="flex items-center bg-dry border text-blue-500 text-sm py-1 px-2 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                  >
                    <FiEdit className="mr-1" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export function InvoiceTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        navigate(`/invoices/edit/${item.id}`);
      },
    },
    {
      title: 'View',
      icon: FiEye,
      onClick: (item) => {
        navigate(`/invoices/preview/${item.id}`);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: async (item) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
          try {
            const response = await fetch(`http://localhost:5000/api/invoices/${item.id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error('Failed to delete the invoice');
            }

            setData((prevData) => prevData.filter((invoice) => invoice.id !== item.id));
            toast.success('Invoice deleted successfully');
          } catch (error) {
            toast.error(error.message);
          }
        }
      },
    },
  ];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const invoices = await response.json();
        setData(invoices);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Error handling
  }

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-auto" style={{ maxHeight: '400px' }}> {/* Add scrollable div */}
      <table className="table-auto w-full">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thclass}>Invoice ID</th>
            <th className={thclass}>Destination</th>
            <th className={thclass}>Created Date</th>
            <th className={thclass}>Due Date</th>
            <th className={thclass}>
              Amount <span className="text-xs font-light">(MAD)</span>
            </th>
            <th className={thclass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border hover:bg-greyed transitions"
            >
              <td className={tdclass}>#{item?.id}</td>
              <td className={tdclass}>
                <div className="flex gap-4 items-center">
                  <span className="w-12">
                    {/* Add image if needed */}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium">{item?.to?.name || item?.to?.title}</h4>
                    <p className="text-xs mt-1 text-textGray">
                      {item?.to?.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className={tdclass}>{formatDate(item?.created_date)}</td>
              <td className={tdclass}>{formatDate(item?.due_date)}</td>
              <td className={`${tdclass} font-semibold`}>{item?.total_amount}</td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export function MedicineTable({ data, onEdit, onDelete }) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    if (medicineToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/medicines/${medicineToDelete.id}`);
        toast.success('Medicine deleted successfully');
        onDelete(medicineToDelete.id); // Call onDelete passed as a prop
      } catch (error) {
        toast.error('Error deleting medicine');
      }
    }
    setDeleteConfirmOpen(false); // Close the modal after action
    setMedicineToDelete(null); // Reset the medicine to delete
  };

  const getDropdownActions = (item) => [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: () => onEdit(item), // Call the onEdit function passed as a prop
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: () => {
        setMedicineToDelete(item); // Set the item to be deleted
        setDeleteConfirmOpen(true); // Open the confirmation modal
      },
    },
  ];

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; // Header styles
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700'; // Body styles

  return (
    <>
      <div style={{
        overflowY: 'auto',
        maxHeight: '400px',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        padding: '1rem',
      }}>
        <table className="table-auto w-full">
          <thead className="bg-dry rounded-md overflow-hidden">
            <tr>
              <th className={thclass}>Name</th>
              <th className={thclass}>
                Price <span className="text-xs font-light">(MAD)</span>
              </th>
              <th className={thclass}>Status</th>
              <th className={thclass}>In Stock</th>
              <th className={thclass}>Measure</th>
              <th className={thclass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-greyed transitions">
                <td className={tdclass}>
                  <h4 className="text-sm font-medium">{item.name}</h4>
                </td>
                <td className={`${tdclass} font-semibold`}>{item.price}</td>
                <td className={tdclass}>
                  <span className={`text-xs font-medium ${item.status === 'out of stock' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.status}
                  </span>
                </td>
                <td className={tdclass}>{item.inStock}</td>
                <td className={tdclass}>{item.measure}</td>
                <td className={tdclass}>
                  <MenuSelect datas={getDropdownActions(item)} item={item}>
                    <div className="bg-dry border text-main text-lg py-2 px-4 rounded-lg">
                      <BiDotsHorizontalRounded />
                    </div>
                  </MenuSelect>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete {medicineToDelete?.name}?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export function ServiceTable({ data, onEdit, setData }) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    if (serviceToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${serviceToDelete.id}`);
        toast.success('Service deleted successfully');

        // Update the state by filtering out the deleted service
        setData((prevData) => prevData.filter(service => service.id !== serviceToDelete.id));
      } catch (error) {
        toast.error('Error deleting service');
      }
    }
    setDeleteConfirmOpen(false); // Close the confirmation modal
    setServiceToDelete(null); // Reset the service to delete
  };

  const DropDown1 = (item) => [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: () => {
        onEdit(item);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: () => {
        setServiceToDelete(item); // Set the service to delete
        setDeleteConfirmOpen(true); // Open confirmation modal
      },
    },
  ];

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; // Header styles
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700'; // Body styles

  return (
    <>
      <div style={{
        overflowY: 'auto',
        maxHeight: '400px',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        padding: '1rem',
      }}>
        <table className="table-auto w-full">
          <thead className="bg-dry rounded-md overflow-hidden">
            <tr>
              <th className={thclass}>Name</th>
              <th className={thclass}>Created At</th>
              <th className={thclass}>
                Price <span className="text-xs font-light">(MAD)</span>
              </th>
              <th className={thclass}>Status</th>
              <th className={thclass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-greyed transitions">
                <td className={tdclass}>
                  <h4 className="text-sm font-medium">{item?.name}</h4>
                </td>
                <td className={tdclass}>{new Date(item?.date).toLocaleDateString()}</td>
                <td className={`${tdclass} font-semibold`}>{item?.price}</td>
                <td className={tdclass}>
                  <span className={`text-xs font-medium ${item?.status === 'disable' ? 'text-red-600' : 'text-green-600'}`}>
                    {item?.status === 'disable' ? 'Disabled' : 'Enabled'}
                  </span>
                </td>
                <td className={tdclass}>
                  <MenuSelect datas={DropDown1(item)} item={item}>
                    <div className="bg-dry border text-main text-lg py-2 px-4 rounded-lg">
                      <BiDotsHorizontalRounded />
                    </div>
                  </MenuSelect>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this service?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



export function PatientTable({ data, setData, functions, used }) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/patients/${patientToDelete.id}`);
        // alert(response.data.message); // Show success message

        // Remove the deleted item from the data state
        setData((prevData) => prevData.filter((patient) => patient.id !== patientToDelete.id));
      } catch (error) {
        // console.error('Error deleting patient:', error);
        alert('Error deleting patient'); // Show error message
      }
    }
    setDeleteConfirmOpen(false); // Close the confirmation modal
    setPatientToDelete(null); // Reset the patient to delete
  };

  const DropDown1 = !used
    ? [
        {
          title: 'View',
          icon: FiEye,
          onClick: (data) => {
            functions.preview(data.id);
          },
        },
        {
          title: 'Delete',
          icon: RiDeleteBin6Line,
          onClick: (item) => {
            setPatientToDelete(item); // Set the patient to delete
            setDeleteConfirmOpen(true); // Open confirmation modal
          },
        },
      ]
    : [
        {
          title: 'View',
          icon: FiEye,
          onClick: (data) => {
            functions.preview(data.id);
          },
        },
      ];

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; // Header clarity
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700'; // Increased text size for clarity

  return (
    <>
      <table className="table-auto w-full">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thclass}>#</th>
            <th className={thclass}>Full Name</th>
            <th className={thclass}>Phone</th>
            <th className={thclass}>Created At</th>
            <th className={thclass}>Age</th>
            <th className={thclass}>Gender</th>
            <th className={thclass}>Services</th>
            <th className={thclass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-border hover:bg-greyed transitions">
              <td className={tdclass}>{item.id}</td>
              <td className={tdclass}>{item.FullName}</td>
              <td className={tdclass}>{item.phone}</td>
              <td className={tdclass}>{moment(item.created_at).format('MMMM D, YYYY - HH:mm')}</td>
              <td className={tdclass}>{item.age}</td>
              <td className={tdclass}>
                <span
                  className={`py-1 px-4 ${item.gender === 'Male' ? 'bg-subMain text-subMain' : 'bg-orange-500 text-orange-500'} bg-opacity-10 text-xs rounded-xl`}
                >
                  {item.gender}
                </span>
              </td>
              <td className={tdclass}>{item.services || 'None'}</td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-lg py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this patient?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DoctorsTable({ data, onEdit, setData }) {
  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      toast.success('Doctor deleted successfully');

      // Update the state by filtering out the deleted doctor
      setData((prevData) => prevData.filter(doctor => doctor.id !== id));
    } catch (error) {
      toast.error('Error deleting doctor');
    }
  };

  const DropDown1 = (doctor) => [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: () => {
        onEdit(doctor);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
          deleteDoctor(doctor.id);
        }
      },
    },
  ];

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; // Header styles
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700'; // Body styles

  return (
    <div style={{
      overflowY: 'auto',
      maxHeight: '400px',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      padding: '1rem',
    }}>
      <table className="table-auto w-full">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thclass}>Full Name</th>
            <th className={thclass}>Phone</th>
            <th className={thclass}>Created At</th>
            <th className={thclass}>Title</th>
            <th className={thclass}>Email</th>
            <th className={thclass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doctor) => (
            <tr key={doctor.id} className="border-b border-border hover:bg-greyed transitions">
              <td className={tdclass}>
                <h4 className="text-sm font-medium">{doctor?.fullName}</h4>
              </td>
              <td className={tdclass}>{doctor?.phone}</td>
              <td className={tdclass}>{new Date(doctor?.created_at).toLocaleDateString()}</td>
              <td className={tdclass}>{doctor?.title}</td>
              <td className={tdclass}>{doctor?.email}</td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1(doctor)} item={doctor}>
                  <div className="bg-dry border text-main text-lg py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReceptionsTable({ receptions, onEdit, setData }) {
  // Function to delete a reception
  const deleteReception = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/receptions/${id}`);
      toast.success('Reception deleted successfully');

      // Update the state by filtering out the deleted reception
      setData((prevData) => prevData.filter(reception => reception.id !== id));
    } catch (err) {
      toast.error('Error deleting reception');
    }
  };

  const DropDown1 = (reception) => [
    {
      title: 'View',
      icon: FiEye,
      onClick: () => {
        onEdit(reception); // You can adapt this for viewing functionality
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this reception?')) {
          deleteReception(reception.id);
        }
      },
    },
  ];

  const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap bg-gray-200 text-gray-800'; // Header styles
  const tdclass = 'text-start text-base py-3 px-2 whitespace-nowrap text-gray-700'; // Body styles

  return (
    <div style={{
      overflowY: 'auto',
      maxHeight: '400px',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      padding: '1rem',
    }}>
      <table className="table-auto w-full">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thclass}>ID</th>
            <th className={thclass}>Full Name</th>
            <th className={thclass}>Phone</th>
            <th className={thclass}>Created At</th>
            <th className={thclass}>Title</th>
            <th className={thclass}>Email</th>
            <th className={thclass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {receptions.map((reception) => (
            <tr key={reception.id} className="border-b border-border hover:bg-greyed transitions">
              <td className={tdclass}>{reception.id}</td>
              <td className={tdclass}>{reception.fullName}</td>
              <td className={tdclass}>{reception.phone}</td>
              <td className={tdclass}>{new Date(reception.created_at).toLocaleDateString()}</td>
              <td className={tdclass}>{reception.title}</td>
              <td className={tdclass}>{reception.email}</td>
              <td className={tdclass}>
                <MenuSelect datas={DropDown1(reception)} item={reception}>
                  <div className="bg-dry border text-main text-lg py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AppointmentTable({ data, patientNames, doctorNames, functions }) {
  const thclass = "p-2 text-left"; // Define your thclass
  const tdclass = "p-2"; // Define your tdclass

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Date</th>
          <th className={thclass}>Time</th>
          <th className={thclass}>Hours</th>
          <th className={thclass}>Doctor </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </td>
            <td className={tdclass}>
            <p className="text-xs">{`${item.from_time.slice(0, 5)} - ${item.to_time.slice(0, 5)}`}</p>
          </td>

            <td className={tdclass}>
              <p className="text-xs">{item.hours}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{doctorNames[item.doctor_id] || 'Loading...'}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



// payment table
export function PaymentTable({ data, functions, doctor }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Date</th>
          <th className={thclass}>{doctor ? 'Patient' : 'Doctor'}</th>
          <th className={thclass}>Status</th>
          <th className={thclass}>Amount</th>
          <th className={thclass}>Method</th>
          <th className={thclass}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">{item.date}</p>
            </td>
            <td className={tdclass}>
              <h4 className="text-xs font-medium">
                {doctor ? item.user.title : item.doctor.title}
              </h4>
              <p className="text-xs mt-1 text-textGray">
                {doctor ? item.user.phone : item.doctor.phone}
              </p>
            </td>
            <td className={tdclass}>
              <span
                className={`py-1  px-4 ${item.status === 'Paid'
                  ? 'bg-subMain text-subMain'
                  : item.status === 'Pending'
                    ? 'bg-orange-500 text-orange-500'
                    : item.status === 'Cancel' && 'bg-red-600 text-red-600'
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status}
              </span>
            </td>
            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.amount}`}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.method}</p>
            </td>

            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice used table
export function InvoiceUsedTable({ data, functions }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Invoice ID</th>
          <th className={thclass}>Create Date</th>
          <th className={thclass}>Due Date</th>
          <th className={thclass}>Amount</th>
          <th className={thclass}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">#{item.id}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.createdDate}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.dueDate}</p>
            </td>

            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.total}`}</p>
            </td>

            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice table
export function InvoiceProductsTable({ data, functions, button }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Item</th>
          <th className={thclass}>
            Item Price
            <span className="text-xs font-light ml-1">(MAD)</span>
          </th>
          <th className={thclass}>Quantity</th>
          <th className={thclass}>
            Amout
            <span className="text-xs font-light ml-1">(MAD)</span>
          </th>
          {button && <th className={thclass}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={`${tdclass}  font-medium`}>{item.name}</td>
            <td className={`${tdclass} text-xs`}>{item.price}</td>
            <td className={tdclass}>{item.id}</td>
            <td className={tdclass}>{item.price * item.id}</td>
            {button && (
              <td className={tdclass}>
                <button
                  onClick={() => functions.deleteItem(item.id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// medicine Dosage table

export function MedicineDosageTable({ data, functions, button }) {
  const thclasse = 'text-start text-xs font-medium py-3 px-2 whitespace-nowrap';
  const tdclasse = 'text-start text-xs py-4 px-2 whitespace-nowrap';
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclasse}>Item</th>
          <th className={thclasse}>Dosage</th>
          <th className={thclasse}>Instraction</th>
          <th className={thclasse}>Quantity</th>
     
          {button && <th className={thclasse}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclasse}>{item.name}</td>
            <td className={tdclasse}>{item.id} - M/A/E</td>
            <td className={tdclasse}>{item.instraction}</td>
            <td className={tdclasse}>{item.id}</td>
            {button && (
              <td className={tdclasse}>
                <button
                  onClick={() => functions.delete(item.id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
