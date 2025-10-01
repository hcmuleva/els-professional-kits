import axios from 'axios';

const API_URL = 'https://hphtechnology.in/lmsserver/api';

export const getUsers = async () => {
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) throw new Error('No JWT token found');
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const createUser = async (userData) => {
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) throw new Error('No JWT token found');
    const response = await axios.post(`${API_URL}/users`, { ...userData, role: 1 }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create user' };
  }
};