import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { login } from '../api/auth';
import Login from '../components/Login';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/auth');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('submits login form successfully', async () => {
    login.mockResolvedValue({ jwt: 'token', user: { id: 1 } });
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    jest.spyOn(message, 'success');

    render(<BrowserRouter><Login /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(message.success).toHaveBeenCalledWith('Login successful!');
      expect(navigate).toHaveBeenCalledWith('/users');
    });
  });

  test('displays error on login failure', async () => {
    login.mockRejectedValue({ message: 'Invalid credentials' });
    jest.spyOn(message, 'error');

    render(<BrowserRouter><Login /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Login failed: Invalid credentials');
    });
  });
});