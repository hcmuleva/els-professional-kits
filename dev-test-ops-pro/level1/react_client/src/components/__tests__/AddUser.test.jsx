import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import AddUser from '../AddUser';
import * as userApi from '../../api/user';

// Mock the user API
jest.mock('../../api/user');

// Mock antd message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-router-dom navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

const user = userEvent.setup({ pointerEventsCheck: 0 });

const renderAddUser = () => {
  return render(
    <BrowserRouter>
      <AddUser />
    </BrowserRouter>
  );
};

const fillFormData = async () => {
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newuser@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'New' } });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'User' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

  fireEvent.mouseDown(screen.getByText('Select Gender'));
  await waitFor(() => fireEvent.click(screen.getByText('Male')));
};

describe('AddUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('jwt', 'mock-jwt-token');
  });

  test('renders add user form', () => {
    renderAddUser();

    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Select Gender')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
  });

  test('accepts input in form fields', () => {
    renderAddUser();

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const firstNameInput = screen.getByPlaceholderText('First Name');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'New' } });

    expect(usernameInput.value).toBe('newuser');
    expect(emailInput.value).toBe('newuser@example.com');
    expect(firstNameInput.value).toBe('New');
  });

  test('has back to user list link', () => {
    renderAddUser();

    expect(screen.getByText('Back to User List')).toBeInTheDocument();
  });

  test('has proper form styling', () => {
    renderAddUser();

    const submitButton = screen.getByRole('button', { name: /add user/i });
    expect(submitButton).toHaveClass('ant-btn-primary');
  });

  test('validates required fields', async () => {
    renderAddUser();

    const submitButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please input Username!')).toBeInTheDocument();
      expect(screen.getByText('Please input a valid Email!')).toBeInTheDocument();
      expect(screen.getByText('Please input Mobile Number!')).toBeInTheDocument();
      expect(screen.getByText('Please input First Name!')).toBeInTheDocument();
      expect(screen.getByText('Please input Last Name!')).toBeInTheDocument();
      expect(screen.getByText('Please input Password!')).toBeInTheDocument();
      expect(screen.getByText('Please select Gender!')).toBeInTheDocument();
    });
  });

  test('handles successful user addition', async () => {
    userApi.createUser.mockResolvedValue({ id: 1 });

    renderAddUser();

    const submitButton = screen.getByRole('button', { name: /add user/i });
    
    await fillFormData();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(userApi.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        mobile_number: '1234567890',
        first_name: 'New',
        last_name: 'User',
        password: 'password123',
        gender: 'MALE',
      });
      expect(message.success).toHaveBeenCalledWith('User added successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/users');
    });
  });

  test('handles user addition failure', async () => {
    userApi.createUser.mockRejectedValue({ message: 'Email already exists' });

    renderAddUser();

    await fillFormData();

    const submitButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to add user: Email already exists');
    });
  });

  test('shows loading state during submission', async () => {
    userApi.createUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderAddUser();

    await fillFormData();

    const submitButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('ant-btn-loading');
  });

  test('handles female gender selection', async () => {
    userApi.createUser.mockResolvedValue({ id: 1 });

    renderAddUser();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'New' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    await userEvent.click(screen.getByText('Select Gender'));
    await waitFor(() => userEvent.click(screen.getByText('Female')));

    const submitButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(userApi.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        mobile_number: '1234567890',
        first_name: 'New',
        last_name: 'User',
        password: 'password123',
        gender: 'FEMALE',
      });
    });
  });
});