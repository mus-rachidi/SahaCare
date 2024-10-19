import React from 'react';
import Layout from '../Layout';
import { BiUserPlus } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import ChangePassword from '../components/UsedComp/ChangePassword';
import PropTypes from 'prop-types';

function Settings() {
  // Retrieve doctor data from local storage
  const doctorData = JSON.parse(localStorage.getItem('doctor'));
  const [activeTab, setActiveTab] = React.useState(1);
  const tabs = [
    {
      id: 1,
      name: 'Doctor Information',
      icon: BiUserPlus,
    },
    {
      id: 2,
      name: 'Change Password',
      icon: RiLockPasswordLine,
    },
  ];

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold">{doctorData ? doctorData.fullName : 'Loading...'}</h2>
            <p className="text-gray-500">{doctorData ? doctorData.email : 'Loading...'}</p>
            <p className="text-gray-700">{doctorData ? doctorData.phone : 'Loading...'}</p>
          </div>
        );
      case 2:
        return <ChangePassword doctorId={doctorData ? doctorData.id : null} />;        
      default:
        return;
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-1 lg:col-span-4 bg-white rounded-xl shadow-md p-6 sticky top-24"
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/logo11.png"
              alt="setting"
              className="w-32 h-32 rounded-full object-cover border border-dashed border-gray-300"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{doctorData ? doctorData.fullName : 'Loading...'}</h2>
            <p className="text-sm text-gray-600">{doctorData ? doctorData.email : 'Loading...'}</p>
            <p className="text-sm text-gray-600">{doctorData ? doctorData.phone : 'Loading...'}</p>
          </div>
          {/* tabs */}
          <div className="mt-6">
            {tabs.map((tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={tab.id}
                aria-label={`Switch to ${tab.name}`}
                className={`
                  ${activeTab === tab.id
                    ? 'bg-subMain text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } text-sm flex items-center w-full p-4 rounded-lg mb-2 transition duration-200 ease-in-out`}
              >
                <tab.icon className="mr-2 text-lg" /> {tab.name}
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
          className="col-span-1 lg:col-span-8 bg-white rounded-xl shadow-md p-6"
        >
          {tabPanel()}
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
