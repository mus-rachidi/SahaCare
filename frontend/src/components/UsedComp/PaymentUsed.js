import React, { useEffect, useState } from 'react';
import { PaymentTable } from '../Tables';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function PaymentsUsed({ doctor, patientId }) {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);

  // Fetch payments for the specific patient
  const fetchPayments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}`); // Adjust to the correct endpoint for payments
      if (!response.ok) throw new Error('Error fetching payment data');
      const data = await response.json();
      setPayments(data); // Now assuming the API returns an array of payment records
    } catch (error) {
      toast.error('Error fetching payment data');
    }
  };
  useEffect(() => {
    fetchPayments();
  }, [patientId]);
  
  useEffect(() => {
    console.log("Payments data:", payments); // Add this line to log payments
  }, [payments]);
    
  const handleEventClick = (id) => {
    navigate(`/patients/preview/${id}`);
  };
  
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Payments</h1>
      <div className="w-full overflow-x-scroll">
      <PaymentTable
  data={payments} // Use fetched payment data
  doctor={doctor}
  functions={{
    preview: handleEventClick, // This should correctly reference the function
  }}
/>

      </div>
    </div>
  );
}

export default PaymentsUsed;
