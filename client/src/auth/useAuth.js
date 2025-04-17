import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/axiosInstance';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading

  const updateUser = async () => {
    setLoading(true); // 👈 Start loading
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        const userData = JSON.parse(storedUser);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);

        try {
          const response = await axios.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const updatedUser = {
            ...userData,
            ...response.data,
            isVerified: response.data.isVerified,
            role: response.data.role,
          };

          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in updateUser:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false); // 👈 Done loading
  };

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    updateUser();
  }, []);

  return { user, login, logout, updateUser, loading }; // 👈 Return loading
};
