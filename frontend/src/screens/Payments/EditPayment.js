import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button, Select } from '../../components/Form';
import { BsSend } from 'react-icons/bs';
import axios from 'axios';

function EditPayment() {
  const { id } = useParams(); // Get payment ID from URL
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(''); // Assuming you have predefined statuses
  const [loading, setLoading] = useState(true);

  const statuses = [
    { name: 'Paid', value: 'paid' },
    { name: 'Pending', value: 'pending' },
    { name: 'Cancelled', value: 'cancelled' },
  ];

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
        const paymentData = response.data;
        setAmount(paymentData.amount); // Assuming the payment data has an 'amount' field
        setStatus(paymentData.status); // Assuming the payment data has a 'status' field
      } catch (error) {
        console.error('Failed to fetch payment data:', error);
        toast.error('Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await axios.put(`http://localhost:5000/api/patients/${id}/amount-status`, { // Updated API endpoint
        amount,
        status,
      });
      toast.success('Payment updated successfully!');
    } catch (error) {
      console.error('Failed to update payment:', error);
      toast.error('Failed to update payment');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/payments"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Edit Payment</h1>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-subMain focus:ring focus:ring-subMain"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Select selectedPerson={status} setSelectedPerson={setStatus} datas={statuses}>
              <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
                <p>{statuses.find(s => s.value === status)?.name || 'Select Status'}</p>
                <IoArrowBackOutline className="text-xl" />
              </div>
            </Select>
          </div>
          <Button type="submit" label="Update Payment" Icon={BsSend} />
        </form>
      </div>
    </Layout>
  );
}

export default EditPayment;
