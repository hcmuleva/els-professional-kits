import axios from 'axios';
import { login, register } from '../auth';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('login function', () => {
    test('successful login saves JWT and user data to localStorage', async () => {
      const mockResponse = {
        data: {
          jwt: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com', username: 'testuser' },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await login('test@example.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://hphtechnology.in/lmsserver/api/auth/local',
        {
          identifier: 'test@example.com',
          password: 'password123',
        }
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt', 'mock-jwt-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse.data);
    });

    test('login failure throws error with response data', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(login('test@example.com', 'wrongpassword')).rejects.toEqual({ message: 'Invalid credentials' });

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('login failure without response data throws default error', async () => {
      const mockError = {};

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(login('test@example.com', 'password')).rejects.toEqual({ message: 'Login failed' });
    });

    test('network error throws default error message', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      await expect(login('test@example.com', 'password')).rejects.toEqual({ message: 'Login failed' });
    });
  });

  describe('register function', () => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      mobile_number: '1234567890',
      first_name: 'New',
      last_name: 'User',
      password: 'password123',
      gender: 'MALE',
    };

    test('successful registration saves JWT and user data to localStorage', async () => {
      const mockResponse = {
        data: {
          jwt: 'mock-jwt-token',
          user: { id: 2, email: 'newuser@example.com', username: 'newuser' },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await register(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://hphtechnology.in/lmsserver/api/auth/local/register',
        userData
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt', 'mock-jwt-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse.data);
    });

    test('registration failure throws error with response data', async () => {
      const mockError = {
        response: {
          data: { message: 'Email already exists' },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(register(userData)).rejects.toEqual({ message: 'Email already exists' });

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('registration failure without response data throws default error', async () => {
      const mockError = {};

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(register(userData)).rejects.toEqual({ message: 'Registration failed' });
    });

    test('network error throws default error message', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      await expect(register(userData)).rejects.toEqual({ message: 'Registration failed' });
    });
  });
});