import React, { useState } from 'react';
import { Button } from '../Form'; // Assuming Button is still a custom component
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function ChangePassword({ doctorId }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password don't match");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/doctors/${doctorId}/change-password`, {
                oldPassword,
                newPassword,
            });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response ? error.response.data.message : 'Failed to change password. Please try again.');
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <Button
                label={'Save Changes'}
                Icon={HiOutlineCheckCircle}
                onClick={handleChangePassword}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
            />
        </div>
    );
}

export default ChangePassword;
