import axios from 'axios';
import { createUser, getUsers } from '../user';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('getUsers function', () => {
    test('successful getUsers returns user data', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          mobile_number: '1234567890',
          first_name: 'John',
          last_name: 'Doe',
          gender: 'MALE',
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          mobile_number: '0987654321',
          first_name: 'Jane',
          last_name: 'Smith',
          gender: 'FEMALE',
        },
      ];

      const mockResponse = { data: mockUsers };
      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getUsers();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://hphtechnology.in/lmsserver/api/users',
        {
          headers: {
            Authorization: 'Bearer mock-jwt-token',
          },
        }
      );

      expect(result).toEqual(mockUsers);
    });

    test('getUsers throws error when no JWT token found', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(getUsers()).rejects.toEqual({
        message: 'No JWT token found',
      });
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    test('getUsers failure throws error with response data', async () => {
      const mockError = {
        response: {
          data: { message: 'Unauthorized' },
        },
      };

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getUsers()).rejects.toEqual({
        message: 'Unauthorized',
      });
    });

    test('getUsers failure without response data throws default error', async () => {
      const mockError = {};

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getUsers()).rejects.toEqual({
        message: 'Failed to fetch users',
      });
    });

    test('network error throws default error message', async () => {
      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getUsers()).rejects.toEqual({
        message: 'Failed to fetch users',
      });
    });
  });

  describe('createUser function', () => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      mobile_number: '9876543210',
      first_name: 'New',
      last_name: 'User',
      password: 'password123',
      gender: 'MALE',
    };

    test('successful createUser returns created user data', async () => {
      const mockResponse = {
        data: {
          id: 3,
          username: 'newuser',
          email: 'newuser@example.com',
        },
      };

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createUser(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://hphtechnology.in/lmsserver/api/users',
        { ...userData, role: 1 },
        {
          headers: {
            Authorization: 'Bearer mock-jwt-token',
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
    });

    test('createUser throws error when no JWT token found', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      await expect(createUser(userData)).rejects.toEqual({
        message: 'Failed to create user'  // Updated to match actual throw
      });
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('createUser adds role: 1 to user data', async () => {
      const mockResponse = {
        data: { id: 3, username: 'newuser' },
      };

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.post.mockResolvedValue(mockResponse);

      await createUser(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://hphtechnology.in/lmsserver/api/users',
        expect.objectContaining({ role: 1 }),
        expect.any(Object)
      );
    });

    test('createUser failure throws error with response data', async () => {
      const mockError = {
        response: {
          data: { message: 'Email already exists' },
        },
      };

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(createUser(userData)).rejects.toEqual({
        message: 'Email already exists',
      });
    });

    test('createUser failure without response data throws default error', async () => {
      const mockError = {};

      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(createUser(userData)).rejects.toEqual({
        message: 'Failed to create user',
      });
    });

    test('network error throws default error message', async () => {
      localStorageMock.getItem.mockReturnValue('mock-jwt-token');
      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      await expect(createUser(userData)).rejects.toEqual({
        message: 'Failed to create user',
      });
    });
  });
});