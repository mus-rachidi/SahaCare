import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button } from '../../components/Form';
import axios from 'axios';
import { BsSave } from 'react-icons/bs';
import { Switchi } from '../../components/Form'; // Removed Input from here

function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addAmount, setAddAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [status, setStatus] = useState(false); // Set as boolean for toggle
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setCurrentAmount(Number(data.amount) || 0);
        setStatus(data.status === 'Cancel'); // Set status based on if it's 'Cancel'
        setPatientName(data.FullName);
        setPrice(Number(data.price));
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

    const parsedAddAmount = parseFloat(addAmount);
    const totalAmount = currentAmount + parsedAddAmount;

    const updatedStatus = totalAmount === price ? 'Paid' : status ? 'Cancel' : 'Pending';

    try {
        await axios.put(`http://localhost:5000/api/patients/${id}/amount-status`, {
            amount: totalAmount,
            status: updatedStatus,
            PaymentDate: new Date().toISOString(), // Add this line to update PaymentDate
        });
        toast.success('Payment updated successfully!');
        navigate('/payments');
    } catch (error) {
        console.error('Failed to update payment:', error);
        toast.error('Payment update failed. Please try again.');
    }
};


  const totalAmount = currentAmount + (parseFloat(addAmount) || 0);
  const autoStatus = totalAmount === price ? 'Paid' : status ? 'Cancel' : 'Pending';

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

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {patientName}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {price.toFixed(2)}
            </div>
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Amount</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {currentAmount ? currentAmount.toFixed(2) : '0.00'}
            </div>
          </div>

          {/* Add Amount */}
          <div>
            <label htmlFor="addAmount" className="block text-sm font-medium text-gray-700">Add Amount</label>
            <input
              type="number"
              id="addAmount"
              value={addAmount}
              onChange={(e) => {
                const inputAmount = parseFloat(e.target.value);
                if (inputAmount + currentAmount > price) {
                  toast.error('Total amount cannot exceed price.');
                  setAddAmount('');
                } else {
                  setAddAmount(e.target.value);
                }
              }}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter amount to add"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Auto Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2 text-gray-700">
              {autoStatus}
            </div>
          </div>

          {/* Toggle Switch for Cancel Status */}
          <div className="flex items-center gap-2 w-full">
            <Switchi
              label="Cancel"
              checked={status}
              onChange={() => setStatus(!status)}
            />
            <p className={`text-sm ${status ? 'text-red-500' : 'text-textGray'}`}>
              {status ? 'Cancel Enabled' : 'Cancel Disabled'}
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" label="Update Payment" Icon={BsSave} className="w-full py-3" />
        </form>
      </div>
    </Layout>
  );
}

export default EditPayment;
