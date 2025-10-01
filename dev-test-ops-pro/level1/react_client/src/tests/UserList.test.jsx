import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { getUsers } from '../api/user';
import UserList from '../components/UserList';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/user');

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user list table', async () => {
    getUsers.mockResolvedValue([
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        mobile_number: '1234567890',
        first_name: 'John',
        last_name: 'Doe',
        gender: 'MALE'
      }
    ]);

    render(<BrowserRouter><UserList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('User List')).toBeInTheDocument();
      expect(screen.getByText('Add User')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('MALE')).toBeInTheDocument();
    });
  });

  test('navigates to add user page on button click', async () => {
    getUsers.mockResolvedValue([]);
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(<BrowserRouter><UserList /></BrowserRouter>);

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/add-user');
    });
  });

  test('displays error on user fetch failure', async () => {
    getUsers.mockRejectedValue({ message: 'Failed to fetch' });
    jest.spyOn(message, 'error');

    render(<BrowserRouter><UserList /></BrowserRouter>);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to fetch users: Failed to fetch');
    });
  });
});