import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import Register from '../Register';
import * as authApi from '../../api/auth';

// Mock the auth API
jest.mock('../../api/auth');

// Mock antd message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const user = userEvent.setup({ pointerEventsCheck: 0 });

const renderRegisterComponent = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

const fillFormData = async () => {
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
  
  // Fixed Select interaction
  fireEvent.mouseDown(screen.getByText('Select Gender'));
  await waitFor(() => fireEvent.click(screen.getByText('Male')));
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders register form correctly', () => {
    renderRegisterComponent();
    
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Select Gender')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderRegisterComponent();

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please input your Username!')).toBeInTheDocument();
      expect(screen.getByText('Please input a valid Email!')).toBeInTheDocument();
      expect(screen.getByText('Please input your Mobile Number!')).toBeInTheDocument();
      expect(screen.getByText('Please input your First Name!')).toBeInTheDocument();
      expect(screen.getByText('Please input your Last Name!')).toBeInTheDocument();
      expect(screen.getByText('Please input your Password!')).toBeInTheDocument();
      expect(screen.getByText('Please select your Gender!')).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    const mockRegisterResponse = {
      jwt: 'mock-jwt-token',
      user: { id: 1, email: 'test@example.com', username: 'testuser' },
    };

    authApi.register.mockResolvedValue(mockRegisterResponse);

    renderRegisterComponent();

    const submitButton = screen.getByRole('button', { name: /register/i });
    
    await fillFormData();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        mobile_number: '1234567890',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
        gender: 'MALE',
      });
      expect(message.success).toHaveBeenCalledWith('Registration successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'mock-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockRegisterResponse.user));
    });
  });

  test('handles registration failure with error message', async () => {
    const errorMessage = 'Email already exists';
    authApi.register.mockRejectedValue({ message: errorMessage });

    renderRegisterComponent();

    await fillFormData();

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Registration failed: Email already exists');
    });
  });

  test('handles registration failure without error message', async () => {
    authApi.register.mockRejectedValue({});

    renderRegisterComponent();

    await fillFormData();

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Registration failed: Something went wrong');
    });
  });

  test('shows loading state during form submission', async () => {
    authApi.register.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderRegisterComponent();

    await fillFormData();

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('ant-btn-loading');
  });

  test('handles female gender selection', async () => {
    const mockRegisterResponse = {
      jwt: 'mock-jwt-token',
      user: { id: 1, email: 'test@example.com', username: 'testuser' },
    };

    authApi.register.mockResolvedValue(mockRegisterResponse);

    renderRegisterComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    await userEvent.click(screen.getByText('Select Gender'));
    await waitFor(() => userEvent.click(screen.getByText('Female')));

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        mobile_number: '1234567890',
        first_name: 'Jane',
        last_name: 'Doe',
        password: 'password123',
        gender: 'FEMALE',
      });
    });
  });
});