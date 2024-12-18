import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import { useNavigate, useParams } from 'react-router-dom';

function MedicalRecord() {
  const [isOpen, setIsOpen] = useState(false);
  const [datas, setDatas] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // The patient_id from the route
  const navigate = useNavigate();

  // Fetch medical records for the specific patient using their patient_id
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/medicalrecords?patient_id=${id}`);
        if (!response.ok) throw new Error('Error fetching medical records');
        const data = await response.json();
        setMedicalRecords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [id]); // Re-run fetch when patient_id (id) changes

  // Handle delete record for a specific patient
  const handleDelete = async (recordId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/medicalrecords/${recordId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting medical record');
      toast.success('Medical record deleted successfully');
      setMedicalRecords(medicalRecords.filter((record) => record.record_id !== recordId));
    } catch (error) {
      toast.error('Error deleting medical record');
    }
  };

  if (loading) return <p>Loading medical records...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
     {isOpen && (
  <MedicalRecodModal
    closeModal={() => {
      setIsOpen(false);
      setDatas({});
    }}
    isOpen={isOpen}
    datas={datas}
    patientId={id} 
  />
)}

      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">Medical Record</h1>
          <div className="sm:w-1/4 w-full">
            <Button
              label="New Record"
              Icon={BiPlus}
              onClick={() => navigate(`/patients/visiting/${id}`)} // Ensure this links to the correct page for the specific patient
            />
          </div>
        </div>
        {medicalRecords.map((record) => (
          <div
            key={record.record_id}
            className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
          >
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-textGray font-medium">{record.record_date}</p>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              <p className="text-xs text-main font-light">
                <span className="font-medium">Diagnosis: </span>
                {record.diagnosis?.length > 40 ? (
                  <>{record.diagnosis.slice(0, 40)}... </>
                ) : (
                  record.diagnosis
                )}
              </p>
              <p className="text-xs text-main font-light">
                <span className="font-medium">Treatment: </span>
                {record.treatment?.length > 40 ? (
                  <>{record.treatment.slice(0, 40)}... </>
                ) : (
                  record.treatment
                )}
              </p>

              <p className="text-xs text-main font-light">
                <span className="font-medium">Vital Signs: </span>
                {record.vital_signs?.length > 40 ? (
                  <>{record.vital_signs.slice(0, 40)}... </>
                ) : (
                  record.vital_signs
                )}
              </p>

              <p className="text-xs text-main font-light">
                <span className="font-medium">Complaints: </span>
                {record.complaints?.length > 40 ? (
                  <>{record.complaints.slice(0, 40)}... </>
                ) : (
                  record.complaints
                )}
              </p>
              <p className="text-xs text-main font-light">
                <span className="font-medium">Note: </span>
                {record.note?.length > 40 ? (
                  <>{record.note.slice(0, 40)}... </>
                ) : (
                  record.note
                )}
              </p>
            </div>
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-subMain font-semibold">
                <span className="font-light text-main">(MAD)</span> {record.amount || 'N/A'}
              </p>
            </div>
            <div className="col-span-12 md:col-span-2 flex-rows gap-2">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setDatas(record);
                }}
                className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEye />
              </button>
              <button
                onClick={() => handleDelete(record.record_id)}
                className="text-sm flex-colo bg-white text-red-600 border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MedicalRecord;
