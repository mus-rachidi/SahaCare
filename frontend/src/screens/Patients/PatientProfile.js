import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../Layout';
import { patientTab } from '../../components/Datas';
import { IoArrowBackOutline } from 'react-icons/io5';
import MedicalRecord from './MedicalRecord';
import AppointmentsUsed from '../../components/UsedComp/AppointmentsUsed';
import InvoiceUsed from '../../components/UsedComp/InvoiceUsed';
import PaymentsUsed from '../../components/UsedComp/PaymentUsed';
import PersonalInfo from '../../components/UsedComp/PersonalInfo';
import PatientImages from './PatientImages';
import HealthInfomation from './HealthInfomation';
import DentalChart from './DentalChart';
import { toast } from 'react-hot-toast';

function PatientProfile() {
  const { id } = useParams(); // Get patient ID from URL
  const [activeTab, setActiveTab] = useState(1);
  const [patientData, setPatientData] = useState(null); // State to hold patient data

  // Function to fetch patient data by ID
  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`);
      if (!response.ok) throw new Error('Error fetching patient data');
      const data = await response.json();
      setPatientData(data);
    } catch (error) {
      toast.error('Error fetching patient data');
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return <MedicalRecord patientId={id}/>;
      case 2:
        return <AppointmentsUsed  patientId={id} />;
      // case 3:
      //   return <InvoiceUsed patientId={id} />;
      // case 4:
      //   return <PaymentsUsed doctor={false} patientId={id} />;
      // case 3:
      //   return <PatientImages patientId={id} />;
      // case 6:
      //   return <DentalChart patientId={id} />;
      case 3:
        return <PersonalInfo titles={false} data={patientData} />;
      case 4:
        return <HealthInfomation data={patientData} />;
      default:
        return;
    }
  };

  if (!patientData) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/patients"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">{patientData.FullName}</h1>
      </div>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28"
        >
                  <img
            src="/images/a.png"
            alt="setting"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">{patientData.FullName}</h2>
            <p className="text-xs text-textGray">{patientData.email}</p>
            <p className="text-xs">{patientData.phone}</p>
          </div>
          {/* tabs */}
          <div className="flex-colo gap-3 px-2 xl:px-12 w-full">
            {patientTab.map((tab, index) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={index}
                className={`
                ${
                  activeTab === tab.id
                    ? 'bg-text text-subMain'
                    : 'bg-dry text-main hover:bg-text hover:text-subMain'
                }
                text-xs gap-4 flex items-center w-full p-4 rounded`}
              >
                <tab.icon className="text-lg" /> {tab.title}
              </button>
            ))}
          </div>
        </div>
        {/* tab panel */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6"
        >
          {tabPanel()}
        </div>
      </div>
    </Layout>
  );
}

export default PatientProfile;
