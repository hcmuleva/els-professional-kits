import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { createUser } from '../api/user';
import AddUser from '../components/AddUser';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/user');

describe('AddUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-jwt');
  });

  test('renders add user form', () => {
    render(<BrowserRouter><AddUser /></BrowserRouter>);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select Gender')).toBeInTheDocument();
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  test('submits add user form successfully', async () => {
    createUser.mockResolvedValue({ id: 2, username: 'user2' });
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    jest.spyOn(message, 'success');

    render(<BrowserRouter><AddUser /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user2@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '0987654321' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.mouseDown(screen.getByPlaceholderText('Select Gender'));
    fireEvent.click(screen.getByText('Female'));

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        username: 'user2',
        email: 'user2@example.com',
        mobile_number: '0987654321',
        first_name: 'Jane',
        last_name: 'Doe',
        password: 'password123',
        gender: 'FEMALE',
        role: 1,
      });
      expect(message.success).toHaveBeenCalledWith('User added successfully!');
      expect(navigate).toHaveBeenCalledWith('/users');
    });
  });

  test('displays error on add user failure', async () => {
    createUser.mockRejectedValue({ message: 'Email already exists' });
    jest.spyOn(message, 'error');

    render(<BrowserRouter><AddUser /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user2@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '0987654321' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.mouseDown(screen.getByPlaceholderText('Select Gender'));
    fireEvent.click(screen.getByText('Female'));

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to add user: Email already exists');
    });
  });

  test('displays error when no JWT token is found', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(message, 'error');

    render(<BrowserRouter><AddUser /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user2@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '0987654321' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.mouseDown(screen.getByPlaceholderText('Select Gender'));
    fireEvent.click(screen.getByText('Female'));

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to add user: No JWT token found');
    });
  });
});