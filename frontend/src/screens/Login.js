import React, { useState } from 'react';
import { Button } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
// In Login component
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post('http://localhost:5000/api/doctors/login', {
      email,
      password
    });

    if (response.status === 200) {
      // Assuming the API response contains doctor data
      const doctorData = response.data.doctor; // Adjust according to your API response structure
      
      // Store doctor data in localStorage (or context/state management)
      localStorage.setItem('doctor', JSON.stringify(doctorData));
      
      // Redirect to the main page
      navigate('/');
    }
  } catch (error) {
    setError('Login failed. Please check your credentials.');
  }
};

  return (
    <div className="w-full h-screen flex-colo bg-dry">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleLogin}>
        <img
          src="/images/logo11.png"
          alt="logo"
          className="w-48 h-16 object-contain"
        />
        <div className="flex flex-col gap-4 w-full mb-6">
          <label>Email</label>
          <input
            type="email"
            className="p-2 border rounded"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            className="p-2 border rounded"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button
          label="Login"
          Icon={BiLogInCircle}
          type="submit"
        />
      </form>
    </div>
  );
}

export default Login;
