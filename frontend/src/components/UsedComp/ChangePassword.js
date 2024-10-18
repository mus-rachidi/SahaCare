import React, { useState } from 'react';
import { Button, Input } from '../Form';
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
        <div className="flex-colo gap-4">
            <Input 
                label="Old Password" 
                color={true} 
                type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
            />
            <Input 
                label="New Password" 
                color={true} 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
            />
            <Input 
                label="Confirm Password" 
                color={true} 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <Button
                label={'Save Changes'}
                Icon={HiOutlineCheckCircle}
                onClick={handleChangePassword}
            />
        </div>
    );
}

export default ChangePassword;
