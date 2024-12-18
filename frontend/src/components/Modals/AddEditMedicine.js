import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Button, Select, Textarea } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

function AddEditMedicineModal({ closeModal, isOpen, datas, addOrUpdateMedicine }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [measure, setMeasure] = useState(sortsDatas.measure[0]);

  useEffect(() => {
    if (datas?.name) {
      setName(datas.name);
      setPrice(datas.price);
      setInStock(datas.inStock);
      setMeasure({
        id: datas.measure,
        name: datas.measure,
      });
    }
  }, [datas]);

  const handleSubmit = () => {
    const medicineData = {
      name,
      price,
      status: inStock > 0 ? 'available' : 'out of stock', // Set status based on stock
      inStock,
      measure: measure.name,
    };
    addOrUpdateMedicine(medicineData); // Call the function passed from the parent
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas?.name ? 'Edit Product' : 'New Product'}
      width={'max-w-3xl'}
    >
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-black text-sm">Medicine Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 border border-border rounded-lg focus:border focus:border-subMain"
              placeholder={datas?.name}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Measure</p>
            <Select
              selectedPerson={measure}
              setSelectedPerson={setMeasure}
              datas={sortsDatas.measure}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {measure?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-black text-sm">Price (MAD))</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-4 border border-border rounded-lg focus:border focus:border-subMain"
              placeholder={datas?.price ? datas.price : 0}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-black text-sm">Instock</label>
            <input
              type="number"
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
              className="p-4 border border-border rounded-lg focus:border focus:border-subMain"
              placeholder={datas?.inStock ? datas.inStock : 0}
            />
          </div>
        </div>

        <Textarea
          label="Description"
          placeholder="Write description here..."
          color={true}
          rows={5}
        />
        
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.name ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={handleSubmit} // Call handleSubmit on click
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddEditMedicineModal;
