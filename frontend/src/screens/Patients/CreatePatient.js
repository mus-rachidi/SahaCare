import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import Layout from '../../Layout';
import PersonalInfo from '../../components/UsedComp/PersonalInfo';

function CreatePatient() {
  const [patients, setPatients] = useState([]); // State to hold the list of patients

  const handleAddPatient = (newPatient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/patients"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Create Patient</h1>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-6"
      >
        <PersonalInfo titles={false} onAddPatient={handleAddPatient} />
      </div>
      {/* Optionally display the list of patients */}
      <div>
        <h2 className="text-lg font-semibold">Patient List</h2>
        <ul>
          {patients.map((patient, index) => (
            <li key={index}>{patient.FullName}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default CreatePatient;
