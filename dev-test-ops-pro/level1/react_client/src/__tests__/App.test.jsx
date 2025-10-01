import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import Register from '../components/Register';
import UserList from '../components/UserList';
import AddUser from '../components/AddUser';

// Mock components
jest.mock('../components/Login', () => () => <div>Login Component</div>);
jest.mock('../components/Register', () => () => <div>Register Component</div>);
jest.mock('../components/UserList', () => () => <div>UserList Component</div>);
jest.mock('../components/AddUser', () => () => <div>AddUser Component</div>);

const renderAppWithRoute = (initialRoute) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login component on root path', () => {
    renderAppWithRoute('/');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders login component on /login path', () => {
    renderAppWithRoute('/login');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders register component on /register path', () => {
    renderAppWithRoute('/register');
    expect(screen.getByText('Register Component')).toBeInTheDocument();
  });

  test('redirects to login when accessing protected route without JWT', () => {
    localStorage.setItem('jwt', '');
    renderAppWithRoute('/users');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('redirects to login when accessing add-user route without JWT', () => {
    localStorage.setItem('jwt', '');
    renderAppWithRoute('/add-user');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders UserList component when authenticated and accessing /users', () => {
    localStorage.setItem('jwt', 'mock-jwt-token');
    renderAppWithRoute('/users');
    expect(screen.getByText('UserList Component')).toBeInTheDocument();
  });

  test('renders AddUser component when authenticated and accessing /add-user', () => {
    localStorage.setItem('jwt', 'mock-jwt-token');
    renderAppWithRoute('/add-user');
    expect(screen.getByText('AddUser Component')).toBeInTheDocument();
  });

  test('applies correct styling to app container', () => {
    const { container } = renderAppWithRoute('/');
    expect(container.firstChild).toHaveStyle({
      minHeight: '100vh',
      background: '#f0f2f5',
    });
  });
});