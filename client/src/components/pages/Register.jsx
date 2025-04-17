
// Register.jsx
import { useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white mt-[-4rem] rounded-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Register</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>
        
        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-50 rounded-md" role="alert">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-700 focus:border-gray-700 focus:outline-none transition duration-150"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-700 focus:border-gray-700 focus:outline-none transition duration-150"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-700 focus:border-gray-700 focus:outline-none transition duration-150"
                placeholder="Create a strong password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="employee"
                    name="role"
                    type="radio"
                    value="employee"
                    checked={form.role === 'employee'}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-700"
                  />
                  <label htmlFor="employee" className="ml-3 block text-sm text-gray-700">
                    Employee
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="manager"
                    name="role"
                    type="radio"
                    value="manager"
                    checked={form.role === 'manager'}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-700"
                  />
                  <label htmlFor="manager" className="ml-3 block text-sm text-gray-700">
                    Manager
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition duration-150"
            >
              Register
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-gray-700 hover:text-gray-900">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
