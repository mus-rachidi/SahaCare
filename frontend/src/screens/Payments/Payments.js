import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Button, FromToDate, Select } from '../../components/Form';
import { Transactiontable } from '../../components/Tables';
import { sortsDatas } from '../../components/Datas';
import { BiChevronDown, BiTime } from 'react-icons/bi';
import { MdOutlineCalendarMonth, MdOutlineCloudDownload } from 'react-icons/md';
import { BsCalendarMonth } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable plugin

function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [todayPayments, setTodayPayments] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState(0);
  const [yearlyPayments, setYearlyPayments] = useState(0);
  const navigate = useNavigate();

  const boxes = [
    {
      id: 1,
      title: 'Today Payments',
      value: (todayPayments ?? 0).toLocaleString(),
      color: ['bg-subMain', 'text-subMain'],
      icon: BiTime,
    },
    {
      id: 2,
      title: 'Monthly Payments',
      value: (monthlyPayments ?? 0).toLocaleString(),
      color: ['bg-orange-500', 'text-orange-500'],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: 'Yearly Payments',
      value: (yearlyPayments ?? 0).toLocaleString(),
      color: ['bg-green-500', 'text-green-500'],
      icon: MdOutlineCalendarMonth,
    },
  ];
  

  const editPayment = (id) => {
    navigate(`/payments/edit/${id}`);
  };

  const previewPayment = (id) => {
    navigate(`/payments/preview/${id}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text('Payment Transactions', 14, 10);
    
    const tableColumn = ['#', 'Full Name', 'Amount', 'Status', 'Date'];
    const tableRows = [];

    filteredData.forEach((transaction) => {
      const transactionData = [
        transaction.id,
        transaction.FullName,
        transaction.amount,
        transaction.status,
        new Date(transaction.PaymentDate).toLocaleDateString(), // Format the date
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('payments_report.pdf');
  };

  useEffect(() => {
    const fetchTransactionSummary = async () => {
      try {
        // Fetch payment summary from /patients/payment-summary
        const response = await fetch('http://localhost:5000/api/payment-summary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { dailyTotal, monthlyTotal, yearlyTotal } = await response.json();
        setTodayPayments(dailyTotal);
        setMonthlyPayments(monthlyTotal);
        setYearlyPayments(yearlyTotal);
      } catch (error) {
        console.error('Failed to fetch payment summary:', error);
        toast.error('Failed to load payment summary');
      }
    };

    const fetchTransactionData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTransactionData(data);
      } catch (error) {
        console.error('Failed to fetch transaction data:', error);
        toast.error('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionSummary();
    fetchTransactionData();
  }, []);

  useEffect(() => {
    const filtered = transactionData.filter((transaction) => {
      const fullNameMatch = transaction.FullName
        ? transaction.FullName.toLowerCase().includes(searchQuery.toLowerCase())
        : false;

      const statusMatch =
        status.id === 1 || // For 'Status...' option
        (status.id === 2 && transaction.status === 'Pending') || // For 'Pending'
        (status.id === 3 && transaction.status === 'Paid') || // For 'Paid'
        (status.id === 4 && transaction.status === 'Cancel'); // For 'Cancel'

      return fullNameMatch && statusMatch;
    });

    setFilteredData(filtered);
  }, [searchQuery, status, transactionData]);

  return (
    <Layout>
      <button
        onClick={exportToPDF}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <p className="hidden text-sm group-hover:block">Export</p>
        <MdOutlineCloudDownload className="text-2xl" />
      </button>
      <h1 className="text-xl font-semibold">Payments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex items-center gap-4 rounded-lg border border-gray-200 p-6"
          >
            <div className="w-3/4">
            <h2 className="text-sm font-medium text-gray-600">{box.title}</h2>
              <h2 className="text-2xl my-4 font-semibold text-gray-900">{box.value} MAD</h2>
              <p className="text-xs text-gray-500">
                You made <span className={box.color[1]}>{box.value} MAD</span>{' '}
                transactions{' '}
                {box.title === 'Today Payments'
                  ? 'today'
                  : box.title === 'Monthly Payments'
                  ? 'this month'
                  : 'this year'}
              </p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${box.color[0]}`}>
              <box.icon />
            </div>
          </div>
        ))}
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="10"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Search"
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            selectedPerson={status}
            setSelectedPerson={setStatus}
            className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4 focus:outline-none focus:ring focus:ring-subMain"
            datas={sortsDatas.status}
          >
            <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
              <p>{status.name}</p>
              <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <Transactiontable
            data={filteredData}
            action={true}
            functions={{
              edit: editPayment,
              preview: previewPayment,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Payments;
