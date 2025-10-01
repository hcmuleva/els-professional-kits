import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import UserList from '../UserList';
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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderUserListComponent = () => {
  return render(
    <BrowserRouter>
      <UserList />
    </BrowserRouter>
  );
};

const mockUsers = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    mobile_number: '1234567890',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'MALE'
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    mobile_number: '0987654321',
    first_name: 'Jane',
    last_name: 'Smith',
    gender: 'FEMALE'
  }
];

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders user list correctly with data', async () => {
    userApi.getUsers.mockResolvedValue(mockUsers);
    
    renderUserListComponent();
    
    expect(screen.getByText('User List')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('MALE')).toBeInTheDocument();

      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.getByText('0987654321')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('FEMALE')).toBeInTheDocument();
    });

    expect(userApi.getUsers).toHaveBeenCalledTimes(1);
  });

  test('renders empty table when no users', async () => {
    userApi.getUsers.mockResolvedValue([]);

    renderUserListComponent();

    await waitFor(() => {
      expect(screen.getByText('User List')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
      expect(screen.getByText('No data', { selector: '.ant-empty-description' })).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching users', async () => {
    userApi.getUsers.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockUsers), 50)));
    
    const { container } = renderUserListComponent();

    await waitFor(() => expect(container.querySelector('.ant-spin-spinning')).toBeInTheDocument());
  });

  test('handles error when fetching users fails', async () => {
    const errorMessage = 'Failed to fetch users';
    userApi.getUsers.mockRejectedValue({ message: errorMessage });

    renderUserListComponent();

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to fetch users: Failed to fetch users');
    });
  });

  test('handles error without message when fetching users fails', async () => {
    userApi.getUsers.mockRejectedValue({});

    renderUserListComponent();

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to fetch users: Something went wrong');
    });
  });

  test('navigates to add user page when add user button is clicked', async () => {
    userApi.getUsers.mockResolvedValue(mockUsers);

    renderUserListComponent();

    const addUserButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addUserButton);

    expect(mockNavigate).toHaveBeenCalledWith('/add-user');
  });

  test('renders table columns correctly', async () => {
    userApi.getUsers.mockResolvedValue(mockUsers);

    renderUserListComponent();

    await waitFor(() => {
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Mobile Number')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
    });
  });

  test('calls getUsers on component mount', () => {
    userApi.getUsers.mockResolvedValue([]);

    renderUserListComponent();

    expect(userApi.getUsers).toHaveBeenCalledTimes(1);
  });
});