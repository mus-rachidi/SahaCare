import { HiOutlineHome, HiOutlineMail, HiOutlineUsers } from 'react-icons/hi';
import {
  TbCalendar,
  TbChartHistogram,
  TbFile,
  TbFileInvoice,
  TbLockAccess,
  TbUsers,
} from 'react-icons/tb';
import { FaRegCalendarAlt, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { FaPaperclip } from 'react-icons/fa'; 
import {
  RiFileList3Line,
  RiHeartLine,
  RiImageLine,
  RiLockPasswordLine,
  RiMedicineBottleLine,
  RiMoneyDollarCircleLine,
  RiStethoscopeLine,
  RiUserHeartLine,
  RiUserLine,
} from 'react-icons/ri';
import {
  MdListAlt,
  MdOutlineAttachMoney,
  MdOutlineCampaign,
  MdOutlineInventory2,
  MdOutlineTextsms,
} from 'react-icons/md';
import { AiOutlineSetting } from 'react-icons/ai';
import { BiCalendar, BiUserPlus } from 'react-icons/bi';

export const MenuDatas = [
  {
    title: 'Dashboard',
    path: '/',
    icon: HiOutlineHome,
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: TbUsers,
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: MdListAlt,
  },

  {
    title: 'Appointments',
    path: '/appointments',
    icon: FaRegCalendarAlt,
  },

  {
    title: 'Receptions',
    path: '/receptions',
    icon: HiOutlineUsers,
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: RiUserHeartLine,
  },
  {
    title: 'Services',
    path: '/services',
    icon: MdOutlineInventory2,
  },
  {
    title: 'Products',
    path: '/medicine',
    icon: RiMedicineBottleLine,
  },
  {
    title: 'Invoices',
    path: '/invoices',
    icon: TbFileInvoice,
  },

  {
    title: 'Campaigns',
    path: '/campaigns',
    icon: MdOutlineCampaign,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: AiOutlineSetting,
  },
];
// export const memberData = [
//   {
//     id: 1,
//     title: 'Hugo Lloris',
//     image: '/images/user1.png',
//     admin: false,
//     email: 'hugolloris@gmail.com',
//     phone: '+1 234 567 890',
//     age: 25,
//     gender: 'Male',
//     blood: 'A+',
//     totalAppointments: 5,
//     date: '20 Aug 2021',
//   },
//   {
//     id: 2,
//     title: 'Mauris auctor',
//     image: '/images/user2.png',
//     admin: false,
//     email: 'maurisauctor@gmail.com',
//     phone: '+1 456 789 123',
//     age: 34,
//     gender: 'Female',
//     blood: 'B+',
//     totalAppointments: 3,
//     date: '22 Nov 2023',
//   },
//   {
//     id: 3,
//     title: 'Michael Owen',
//     image: '/images/user3.png',
//     admin: false,
//     phone: '+1 890 123 456',
//     email: 'michaelowen@gmail.com',
//     age: 45,
//     gender: 'Male',
//     blood: 'O+',
//     totalAppointments: 26,
//     date: '12 Jan 2020',
//   },
//   {
//     id: 4,
//     title: 'Amina Smith',
//     image: '/images/user4.png',
//     admin: true,
//     phone: '+1 908 765 432',
//     email: 'aminasmith@gmail.com',
//     age: 28,
//     gender: 'Female',
//     blood: 'AB+',
//     totalAppointments: 17,
//     date: '07 Feb 2001',
//   },
//   {
//     id: 5,
//     title: 'Minahil Khan',
//     image: '/images/user5.png',
//     admin: false,
//     phone: '+1 890 123 456',
//     email: 'minahilkhan@gmail.com',
//     age: 35,
//     gender: 'Female',
//     blood: 'A+',
//     totalAppointments: 9,
//     date: '30 Dec 2019',
//   },
//   {
//     id: 6,
//     title: 'Alex Morgan',
//     image: '/images/user6.png',
//     admin: false,
//     phone: '+1 908 765 432',
//     email: 'alexmorgan@gmail.com',
//     age: 29,
//     gender: 'Male',
//     blood: 'B+',
//     totalAppointments: 34,
//     date: '12 Jan 2020',
//   },
//   {
//     id: 7,
//     title: 'John Doe',
//     image: '/images/user7.png',
//     admin: false,
//     phone: '+1 234 567 890',
//     email: 'johndoe@gmail.com',
//     age: 32,
//     gender: 'Male',
//     blood: 'O-',
//     totalAppointments: 12,
//     date: '18 Mar 2023',
//   },
//   {
//     id: 8,
//     title: 'David Beckham',
//     image: '/images/user8.png',
//     admin: false,
//     phone: '+1 456 789 123',
//     email: 'davidbackham@gmail.com',
//     age: 27,
//     gender: 'Female',
//     blood: 'AB+',
//     totalAppointments: 70,
//     date: '01 June 2018',
//   },
// ];

const API_URL = 'http://localhost:5000/api/patients'; 

const transformPatientData = (data) => {
    return data.map((patient, index) => ({
        id: index + 1, // Or use patient.id if available
        FullName: patient.FullName || 'Unknown', // Change this based on the API response
        image: patient.image || '/images/default.png', // Adjust based on actual API data
        admin: patient.admin || false, // Set default value
        email: patient.email || 'N/A', // Handle undefined cases
        phone: patient.phone || 'N/A',
        age: patient.age || 'N/A',
        gender: patient.gender || 'N/A',
        blood: patient.blood || 'N/A',
        totalAppointments: patient.totalAppointments || 0,
        date: patient.date || 'N/A',
    }));
};

export const fetchPatients = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched patients:', data); // Log fetched data
        return transformPatientData(data); // Transform and return
    } catch (error) {
        console.error('Error fetching patients:', error);
        return []; // Return empty array in case of error
    }
};

export const memberData = await fetchPatients()
console.log('Member Data:', memberData[0]);


export const sortsDatas = {
  status: [
    {
      id: 1,
      name: 'All',
    },
    {
      id: 2,
      name: 'Pending',
    },
    {
      id: 3,
      name: 'Paid',
    },
    {
      id: 4,
      name: 'Cancel',
    },
  ],
  method: [
    {
      id: 1,
      name: 'Payment method',
    },
    {
      id: 2,
      name: 'Cash',
    },
    {
      id: 3,
      name: 'NHCF Insurance',
    },
    {
      id: 4,
      name: 'Britam Insurance',
    },
  ],
  currency: [
    {
      id: 1,
      name: 'Select Currency',
    },
    {
      id: 2,
      name: 'USD (US Dollar)',
    },
    {
      id: 3,
      name: 'EUR (Euro)',
    },
    {
      id: 4,
      name: 'TSH (Tanzanian Shilling)',
    },
  ],
  instractions: [
    {
      id: 1,
      name: 'Select Instraction',
    },
    {
      id: 2,
      name: 'After Meal',
    },
    {
      id: 3,
      name: 'Before Meal',
    },
  ],
  measure: [
    {
      id: 1,
      name: 'unit',
    },
    {
      id: 2,
      name: 'mg',
    },
    {
      id: 3,
      name: 'ml',
    },
    {
      id: 4,
      name: 'gm',
    },
    {
      id: 5,
      name: 'kg',
    },
    {
      id: 6,
      name: 'lb',
    },
    {
      id: 7,
      name: 'tbsp',
    },
    {
      id: 8,
      name: 'tablet',
    },
    {
      id: 9,
      name: 'capsule',
    },
  ],
  stocks: [
    {
      id: 1,
      name: 'All',
    },
    {
      id: 2,
      name: 'Available',
    },
    {
      id: 3,
      name: 'Out of Stock',
    },
  ],
  service: [
    {
      id: 1,
      name: 'All',
    },
    {
      id: 2,
      name: 'Enabled',
    },
    {
      id: 3,
      name: 'Disabled',
    },
  ],
  title: [
    {
      id: 1,
      name: 'Dr.',
    },
    {
      id: 2,
      name: 'Mr.',
    },
    {
      id: 3,
      name: 'Mrs.',
    },
    {
      id: 4,
      name: 'Ms.',
    },
  ],
  filterPatient: [
    {
      id: 1,
      name: 'Sort by...',
    },
    {
      id: 2,
      name: 'Newest Patients',
    },
    {
      id: 3,
      name: 'Oldest Patients',
    },
  ],
  genderFilter: [
    {
      id: 1,
      name: 'Gender...',
    },
    {
      id: 2,
      name: 'Female',
    },
    {
      id: 3,
      name: 'Male',
    },
  ],
  bloodTypeFilter: [
    {
      id: 1,
      name: 'Blood Type...',
    },
    {
      id: 2,
      name: 'A+',
    },
    {
      id: 3,
      name: 'A-',
    },
    {
      id: 4,
      name: 'B+',
    },
    {
      id: 5,
      name: 'B-',
    },
    {
      id: 6,
      name: 'AB+',
    },
    {
      id: 7,
      name: 'AB-',
    },
    {
      id: 8,
      name: 'O+',
    },
    {
      id: 9,
      name: 'O-',
    },
  ],
  dosage: [
    {
      id: 1,
      name: 'Morning (M)',
      value: 'morning',
    },
    {
      id: 2,
      name: 'Afternoon (A)',
      value: 'afternoon',
    },
    {
      id: 3,
      name: 'Evening (E)',
      value: 'evening',
    },
  ],
};

export const campaignData = [
  {
    id: 1,
    title: 'Offer on Dental Checkup',
    date: '3 days ago',
    type: 'email',
    sendTo: 'All Patients',
    action: {
      subject: 'Delight patients with a free dental checkup',
      message:
        'Dear Patient, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.',
      subHeader: 'Offer on Dental Checkup',
      header: 'How to avail this offer?',
      footer: 'This offer is valid till 30th June, 2021',
    },
  },
  {
    id: 2,
    title: 'Britam Insurance Offer',
    date: '8 days ago',
    type: 'whatsapp',
    sendTo: 'Britam Patients',
    action: {
      message:
        'Hellow Patient, are you looking for a free dental checkup? We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.',
    },
  },
  {
    id: 3,
    title: 'NHCF Insurance Offer',
    date: '10 days ago',
    type: 'sms',
    sendTo: 'NHCF Patients',
    action: {
      message:
        'Hola, Delight patient with NHCF Insurance, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.',
    },
  },
  {
    id: 4,
    title: 'Cash patients offer',
    date: '15 days ago',
    type: 'sms',
    sendTo: 'Cash Patients',
    action: {
      message:
        'Delight Patient, now get 50% off on dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.',
    },
  },
  {
    id: 5,
    title: 'Braces Offer',
    date: '12 days ago',
    type: 'email',
    sendTo: 'Britam Patients',
    action: {
      subject: 'Delight patients with a free dental checkup',
      message:
        'Dear Patient, Britam Insurance is delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you. and have a nice day. and welcome to our clinic.',
      subHeader: 'Braces Offer for Britam Patients',
      header: 'Now get braces at 50% off',
      footer: 'This offer is valid till 30th June, 2021',
    },
  },
  {
    id: 6,
    title: 'Teeth Whitening Offer',
    date: '20 days ago',
    type: 'whatsapp',
    sendTo: 'All Patients',
    action: {
      message:
        'Hola, Delight patient with Teeth Whitening Offer, We are delighted to offer you a free dental checkup. Please visit our clinic to avail this offer. Thank you.',
    },
  },
];
export const servicesData = [
  {
    id: 1,
    name: 'Select service.. ',
  },
  {
    id: 2,
    name: 'Root Canal',
    price: 40000,
    date: '23 June, 2021',
    status: true,
  },
  {
    id: 3,
    name: 'Teeth Whitening',
    price: 20000,
    date: '12 Jan, 2022',
    status: true,
  },
  {
    id: 4,
    name: 'Dental Implants',
    price: 50000,
    date: '11 April, 2023',
    status: false,
  },
  {
    id: 5,
    name: 'Dental Crowns',
    price: 34000,
    date: '10 Agst, 2021',
    status: true,
  },
  {
    id: 6,
    name: 'Dental Bridges',
    price: 10400,
    date: '23 June, 2021',
    status: false,
  },
  {
    id: 7,
    name: 'Dental Veneers',
    price: 150000,
    date: '09 Dec, 2023',
    status: false,
  },
  {
    id: 8,
    name: 'Dental Braces',
    price: 23000,
    date: '05 Feb, 2019',
    status: true,
  },
  {
    id: 9,
    name: 'Dental Sealants',
    price: 40000,
    date: '16 Nov, 2022',
    status: true,
  },
  {
    id: 10,
    name: 'Dentures',
    price: 19000,
    date: '02 Jun, 2022',
    status: false,
  },
  {
    id: 11,
    name: 'Tooth Extraction',
    price: 160000,
    date: '23 June, 2021',
    status: true,
  },
];


// Function to fetch invoices from the backend API
const fetchInvoices = async () => {
  try {
      const response = await fetch('http://localhost:5000/api/invoices'); // Replace with your actual API endpoint
      if (!response.ok) {
          throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      console.log('Fetched invoices data:', data); // Log the fetched data
      return data; // Ensure data is in the expected format
  } catch (error) {
      console.error('Error fetching invoices:', error);
      return []; // Return an empty array in case of error
  }
};

// Function to generate invoices by fetching from the API
export const generateInvoices = async () => {
  const invoices = await fetchInvoices(); // Fetch invoices from the backend

  // Ensure invoices is an array before mapping
  if (!Array.isArray(invoices)) {
      console.error('Invoices data is not an array:', invoices);
      return []; // Return an empty array if the data is not valid
  }

  return invoices.map((invoice, index) => ({
      id: invoice.id || Date.now() + index, // Use ID from invoice or generate a unique one
      patient_id: invoice.patient_id, // Ensure patient ID is included
      doctor_id: invoice.doctor_id, // Ensure doctor ID is included
      created_date: new Date(invoice.created_date).toLocaleDateString(), // Ensure this matches your DB field
      due_date: new Date(invoice.due_date).toLocaleDateString(), // Ensure this matches your DB field
      total_amount: invoice.total_amount, // Match this with your DB column name
      status: invoice.status, // Include status if available
      services_rendered: JSON.stringify(invoice.items), // Convert items to JSON format
      payment_method: invoice.payment_method || '', // Use a default value if not present
  }));
};

// If you want to export the invoices data initially, you might want to use a function to fetch it later
export const invoicesData = await generateInvoices(); // Note: This will work in an async context, like within an async function

const generateAppointments = () => {
    const appointments = [];
    const appointmentDetails = [
        {
            time: '2 hrs later',
            from: '10:00 AM',
            to: '12:00 PM',
            hours: 2,
            status: 'Pending',
            date: 'Jun 12, 2021',
        },
        {
            time: '1 hr ago',
            from: '1:00 PM',
            to: '6:00 PM',
            hours: 5,
            status: 'Cancel',
            date: 'Feb 24, 2021',
        },
        {
            time: '2 hrs ago',
            from: '10:00 AM',
            to: '12:00 PM',
            hours: 2,
            status: 'Approved',
            date: 'Mar 12, 2023',
        },
        {
            time: '3 hrs later',
            from: '6:00 AM',
            to: '8:00 AM',
            hours: 3,
            status: 'Pending',
            date: 'Apr 06, 2023',
        },
        {
            time: '4 hrs ago',
            from: '10:00 AM',
            to: '12:00 PM',
            hours: 7,
            status: 'Approved',
            date: 'May 18, 2023',
        },
    ];

    for (let i = 0; i < appointmentDetails.length; i++) {
        const userIndex = i % memberData.length; // Loop through memberData
        const doctorIndex = (i + 1) % memberData.length; // Get next member as doctor

        appointments.push({
            id: i + 1, // Unique ID for each appointment
            time: appointmentDetails[i].time,
            user: memberData[userIndex], // Use current user from memberData
            from: appointmentDetails[i].from,
            to: appointmentDetails[i].to,
            hours: appointmentDetails[i].hours,
            status: appointmentDetails[i].status,
            doctor: memberData[doctorIndex], // Use next member as doctor
            date: appointmentDetails[i].date,
        });
    }

    return appointments;
};

export const appointmentsData = generateAppointments();
const generateTransactions = async () => {
    const transactions = [];
    
    try {
        // Fetch payment data from the backend API
        const response = await fetch('http://localhost:5000/api/payments'); // Adjust the URL as needed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const paymentData = await response.json();
        
        // Assuming paymentData is an array of payment objects
        for (let i = 0; i < paymentData.length; i++) {
            const payment = paymentData[i];
            const userIndex = i % memberData.length; // Loop through memberData
            const doctorIndex = (i + 1) % memberData.length; // Get next member as doctor

            transactions.push({
                id: payment.id, // Unique ID from payment data
                user: memberData[userIndex], // Use current user from memberData
                date: payment.payment_date, // Date from payment data
                amount: payment.amount, // Amount from payment data
                status: payment.status, // Status from payment data
                method: payment.method, // Method from payment data
                doctor: memberData[doctorIndex], // Use next member as doctor
            });
        }
    } catch (error) {
        console.error('Failed to fetch payments:', error);
    }

    return transactions;
};

// Export transactionData as a promise
export const transactionData = generateTransactions();


export const dashboardCards = [
  {
    id: 1,
    title: 'Total Patients',
    icon: TbUsers,
    value: 1600,
    percent: 45.06,
    color: ['bg-subMain', 'text-subMain', '#66B5A3'],
    datas: [92, 80, 45, 15, 49, 77, 70, 51, 110, 20, 90, 60],
  },
  {
    id: 2,
    title: 'Appointments',
    icon: TbCalendar,
    value: 130,
    percent: 25.06,
    color: ['bg-yellow-500', 'text-yellow-500', '#F9C851'],
    datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
  },
  {
    id: 3,
    title: 'Prescriptions',
    icon: TbFile,
    value: 4160,
    percent: 65.06,
    color: ['bg-green-500', 'text-green-500', '#34C759'],
    datas: [92, 80, 45, 15, 49, 77, 70, 51, 110, 20, 90, 60],
  },
  {
    id: 4,
    title: 'Total Earnings',
    icon: MdOutlineAttachMoney,
    value: 4590,
    percent: 45.06,
    color: ['bg-red-500', 'text-red-500', '#FF3B30'],
    datas: [20, 50, 75, 15, 108, 97, 70, 41, 50, 20, 90, 60],
  },
];

const generateNotifications = () => {
    const notifications = [];
    
    const actions = [
        'made an appointment',  // Action 1
        'cancelled an appointment' // Action 2
    ];

    const times = [
        '2 hours ago',
        '2 days ago',
        '3 days ago',
        '4 days ago',
        '1 week ago',
        '1 month ago',
    ];

    for (let i = 0; i < memberData.length; i++) {
        const actionIndex = i % actions.length; // Cycle through actions
        const timeIndex = i % times.length; // Cycle through times

        notifications.push({
            id: i + 1, // Unique ID for each notification
            action: actionIndex + 1, // Action number (1 or 2)
            user: memberData[i], // Use current user from memberData
            time: times[timeIndex], // Use current time from times array
        });
    }

    return notifications;
};

export const notificationsData = generateNotifications();


export const shareData = [
  {
    id: 1,
    icon: HiOutlineMail,
    title: 'Email',
    description: 'Send to patient email address',
  },
  {
    id: 2,
    icon: MdOutlineTextsms,
    title: 'SMS',
    description: 'Send to patient phone number',
  },
  {
    id: 3,
    icon: FaWhatsapp,
    title: 'WhatsApp',
    description: 'Send to patient WhatsApp account',
  },
  {
    id: 4,
    icon: FaTelegramPlane,
    title: 'Telegram',
    description: 'Send to patient Telegram account',
  },
];

export const medicineData = [
  {
    id: 1,
    name: 'Paracetamol',
    measure: 'Tablet',
    stock: 400,
    price: 1000,
    status: 'Available',
    instraction: 'After meal',
  },
  {
    id: 2,
    name: 'Amoxicillin',
    measure: 'Capsule',
    stock: 200,
    price: 2300,
    status: 'Available',
    instraction: 'After meal',
  },
  {
    id: 3,
    name: 'Ibuprofen',
    measure: 'mm',
    stock: 0,
    price: 5000,
    status: 'Out of stock',
    instraction: 'Before meal',
  },
  {
    id: 4,
    name: 'Aspirin',
    measure: 'cm',
    stock: 370,
    price: 3500,
    status: 'Available',
    instraction: 'After meal',
  },
  {
    id: 5,
    name: 'Diazepam',
    measure: 'gm',
    stock: 0,
    price: 12000,
    status: 'Out of stock',
    instraction: 'Before meal',
  },
  {
    id: 6,
    name: 'Lorazepam',
    measure: 'mg',
    stock: 123,
    price: 15500,
    status: 'Available',
    instraction: 'Before meal',
  },
  {
    id: 7,
    name: 'Codeine',
    measure: 'ml',
    stock: 1,
    price: 30000,
    status: 'Available',
    instraction: 'After meal',
  },
  {
    id: 8,
    name: 'Tramadol',
    measure: 'lb',
    stock: 0,
    price: 200,
    status: 'Out of stock',
    instraction: 'Before meal',
  },
];

export const patientTab = [
  {
    id: 1,
    title: 'Medical Records',
    icon: TbChartHistogram,
  },
  {
    id: 2,
    title: 'Appointments',
    icon: BiCalendar,
  },
  // {
  //   id: 3,
  //   title: 'Invoices',
  //   icon: RiFileList3Line,
  // },
  // {
  //   id: 4,
  //   title: 'Payments',
  //   icon: RiMoneyDollarCircleLine,
  // },
  // {
  //   id: 3,
  //   title: 'Images',
  //   icon: RiImageLine,
  // },
  // {
  //   id: 4,
  //   title: 'Dental Chart',
  //   icon: RiStethoscopeLine,
  // },
  {
    id: 3,
    title: 'Patient Information',
    icon: RiUserLine,
  },
  {
    id: 4,
    title: 'Attachment ',
    icon: FaPaperclip,
  },
];

export const doctorTab = [
  {
    id: 1,
    title: 'Personal Information',
    icon: RiUserLine,
  },
  {
    id: 2,
    title: 'Patients',
    icon: BiUserPlus,
  },
  {
    id: 3,
    title: 'Appointments',
    icon: BiCalendar,
  },
  {
    id: 4,
    title: 'Payments',
    icon: RiMoneyDollarCircleLine,
  },
  {
    id: 5,
    title: 'Invoices',
    icon: RiFileList3Line,
  },
  {
    id: 6,
    title: 'Access Control',
    icon: TbLockAccess,
  },
  {
    id: 7,
    title: 'Change Password',
    icon: RiLockPasswordLine,
  },
];

export const medicalRecodData = [
  {
    id: 1,
    date: '13, Jan 2021',
    amount: 150000,
    data: [
      {
        id: 1,
        title: 'Complaint',
        value: 'Bleeding Gums, Toothache, bad breath',
      },
      {
        id: 2,
        title: 'Diagnosis',
        value: 'Gingivitis, Caries, Periodontitis',
      },
      {
        id: 3,
        title: 'Treatment',
        value: 'Filling, Post&Core, Implant, Extraction',
      },
      {
        id: 4,
        title: 'Prescription',
        value: 'Paracetamol, Amoxicillin, Ibuprofen, Aspirin',
      },
    ],
    attachments: [
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
    ],
    vitalSigns: [
      'Blood Pressure: 120/80 mmHg',
      'Pulse Rate: 80 bpm',
      'Respiratory Rate: 16 bpm',
      'Temperature: 36.5 °C',
      'Oxygen Saturation: 98%',
    ],
  },
  {
    id: 2,
    date: '10, Feb 2022',
    amount: 300000,
    data: [
      {
        id: 1,
        title: 'Complaint',
        value: 'Food impaction, Replacing Missing Teeth, bad breath',
      },
      {
        id: 2,
        title: 'Diagnosis',
        value: 'Caries, Periodontitis, Malocclusion',
      },
      {
        id: 3,
        title: 'Treatment',
        value: 'Superficial Scaling, Root Planing, Extraction',
      },
      {
        id: 4,
        title: 'Prescription',
        value: 'Benzocaine, Lidocaine, Mepivacaine, Prilocaine',
      },
    ],
    attachments: [
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
    ],
    vitalSigns: [
      'Weight: 60 kg',
      'Height: 170 cm',
      'BMI: 20.76 kg/m2',
      'Blood Pressure: 120/80 mmHg',
    ],
  },
  {
    id: 3,
    date: '20, Mar 2022',
    amount: 500000,
    data: [
      {
        id: 1,
        title: 'Complaint',
        value: 'Broken Teeth, Bridge, Cap in the front teeth',
      },
      {
        id: 2,
        title: 'Diagnosis',
        value: 'Unspecified Gingival Recession, Unspecified Caries',
      },
      {
        id: 3,
        title: 'Treatment',
        value: 'Consultation, Scaling, Root Planing, Extraction',
      },
      {
        id: 4,
        title: 'Prescription',
        value: 'Gingival Gel, Chlorhexidine, Fluoride, Calcium',
      },
    ],
    attachments: [
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
    ],
    vitalSigns: [
      'Temperature: 36.5 °C',
      'Oxygen Saturation: 98%',
      'Blood Pressure: 120/80 mmHg',
      'Pulse Rate: 80 bpm',
      'Respiratory Rate: 16 bpm',
    ],
  },
  {
    id: 4,
    date: '10, Apr 2022',
    amount: 760000,
    data: [
      {
        id: 1,
        title: 'Complaint',
        value: 'Toothache, bad breath, Bleeding Gums',
      },
      {
        id: 2,
        title: 'Diagnosis',
        value: 'Necrotizing Ulcerative Gingivitis, Periodontitis',
      },
      {
        id: 3,
        title: 'Treatment',
        value: 'Crowns, Bridges, Veneers, Implants',
      },
      {
        id: 4,
        title: 'Prescription',
        value: 'Tramadol, Codeine, Morphine, Oxycodone',
      },
    ],
    attachments: [
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
      'https://placehold.it/300x300',
    ],
    vitalSigns: [
      'Sugar Level: 120 mg/dL',
      'Oxygen Saturation: 98%',
      'Cholesterol: 200 mg/dL',
      'Blood Pressure: 120/80 mmHg',
    ],
  },
];

const generateDoctorsData = () => {
    const doctors = [];

    for (let i = 0; i < Math.min(4, memberData.length); i++) {
        doctors.push({
            id: i + 1, // Unique ID for each doctor
            user: memberData[i], // Use current user from memberData
            title: 'Dr.', // Title for doctors
        });
    }

    return doctors;
};

const generateReceptionsData = () => {
    const receptions = [];

    for (let i = 4; i < memberData.length; i++) {
        receptions.push({
            id: i + 1, // Unique ID for each receptionist
            user: memberData[i], // Use current user from memberData
            title: 'Dr.', // Title for receptionists (can be modified if needed)
        });
    }

    return receptions;
};
export const receptionsData = generateReceptionsData();
export const doctorsData = generateDoctorsData();
