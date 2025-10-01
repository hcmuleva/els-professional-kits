import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { register } from '../api/auth';
import Register from '../components/Register';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/auth');

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form', () => {
    render(<BrowserRouter><Register /></BrowserRouter>);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select Gender')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('submits register form successfully', async () => {
    register.mockResolvedValue({ jwt: 'token', user: { id: 1 } });
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    jest.spyOn(message, 'success');

    render(<BrowserRouter><Register /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.mouseDown(screen.getByPlaceholderText('Select Gender'));
    fireEvent.click(screen.getByText('Male'));

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        mobile_number: '1234567890',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
        gender: 'MALE',
      });
      expect(message.success).toHaveBeenCalledWith('Registration successful!');
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays error on register failure', async () => {
    register.mockRejectedValue({ message: 'Email already exists' });
    jest.spyOn(message, 'error');

    render(<BrowserRouter><Register /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.mouseDown(screen.getByPlaceholderText('Select Gender'));
    fireEvent.click(screen.getByText('Male'));

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Registration failed: Email already exists');
    });
  });
});