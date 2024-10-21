import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoChevronDown } from 'react-icons/io5';
import { Button, Select } from '../../components/Form';
import axios from 'axios';
import { BsSave } from 'react-icons/bs';

const statuses = [
  { name: 'Paid', value: 'Paid' },
  { name: 'Pending', value: 'Pending' },
  { name: 'Cancelled', value: 'Cancelled' },
];

function EditPayment() {
  const { id } = useParams(); // Get payment ID from URL parameters
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [PaymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Set default payment date to today's date
  });
  const [patientName, setPatientName] = useState(''); // State for patient's full name
  const [loading, setLoading] = useState(true);

  // Fetch payment data for the selected patient
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setAmount(data.amount); // Set initial amount from API
        setStatus(data.status);
        setPatientName(data.FullName); // Set patient's full name from the API
      } catch (error) {
        console.error('Failed to fetch payment data:', error);
        toast.error('Unable to load payment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAmount = amount && amount > 0 ? parseFloat(amount) + parseFloat(amount) : 0;

      await axios.put(`http://localhost:5000/api/patients/${id}/amount-status`, {
        amount: updatedAmount, // Set updated amount
        status: status.value || status,
        PaymentDate, // Include payment date in submission
      });
      toast.success('Payment updated successfully!');
      navigate('/payments');
    } catch (error) {
      console.error('Failed to update payment:', error);
      toast.error('Payment update failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/payments"
          className="bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg py-2 px-4 text-md"
        >
          <IoArrowBackOutline size={24} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Payment</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Display Patient Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {patientName}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter payment amount"
              required
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              selectedPerson={status}
              setSelectedPerson={(selected) => setStatus(selected.value)}
              datas={statuses}
            >
              <div className="h-12 w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-transparent text-sm">
                <span>
                  {status ? statuses.find((s) => s.value === status)?.name : 'Select Status'}
                </span>
                <IoChevronDown className="text-xl text-gray-600" />
              </div>
            </Select>
          </div>

          {/* Payment Date */}
          <div>
            <label htmlFor="PaymentDate" className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input
              type="date"
              id="PaymentDate"
              value={PaymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" label="Update Payment" Icon={BsSave} className="w-full py-3" />
        </form>
      </div>
    </Layout>
  );
}

export default EditPayment;
