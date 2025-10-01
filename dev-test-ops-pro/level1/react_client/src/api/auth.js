import axios from 'axios';

const API_URL = 'https://hphtechnology.in/lmsserver/api';

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, {
      identifier,
      password,
    });
    const { jwt, user } = response.data;
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local/register`, userData);
    const { jwt, user } = response.data;
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};