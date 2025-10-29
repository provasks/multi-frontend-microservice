import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useApi, useApiMutation } from '../useApi';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('useApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue('test-token');
  });

  describe('useApi', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useApi('/api/tasks'));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should use cached data when available', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      // First call
      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1);

      // Second call should use cache (same URL and options)
      const { result: result2 } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result2.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1); // Should not call again
    });

    it('should not use cache when disabled', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useApi('/api/tasks', {}, false));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1);

      // Second call should not use cache
      const { result: result2 } = renderHook(() => useApi('/api/tasks', {}, false));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockedAxios).toHaveBeenCalledTimes(2); // Should call again
    });

    it('should refetch data when refetch is called', async () => {
      const mockData1 = { id: 1, name: 'Test Task 1' };
      const mockData2 = { id: 2, name: 'Test Task 2' };
      mockedAxios
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData1);

      await act(async () => {
        result.current.refetch();
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData2);
      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('should clear cache when clearCache is called', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);

      await act(async () => {
        result.current.clearCache();
      });

      // Next call should not use cache
      await act(async () => {
        result.current.refetch();
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('should handle cache timeout', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      // Use a very short cache timeout
      const { result } = renderHook(() => useApi('/api/tasks', {}, true, 1));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // New hook instance should trigger a new fetch
      const { result: result2 } = renderHook(() => useApi('/api/tasks', {}, true, 1));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('should handle different options correctly', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useApi('/api/tasks', { params: { page: 1 }, method: 'GET' }));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        params: { page: 1 }
      });
    });
  });

  describe('useApiMutation', () => {
    beforeEach(() => {
      mockedAxios.mockClear();
      mockSessionStorage.clear();
      mockSessionStorage.getItem.mockReturnValue('test-token');
    });

    it('should mutate data successfully', async () => {
      const mockData = { id: 1, name: 'New Task' };
      const responseData = { id: 1, name: 'New Task', created: true };
      mockedAxios.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutate(mockData);
      });

      expect(result.current.loading).toBe(false);
      expect(mutationResult).toEqual(responseData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        data: mockData
      });
    });

    it('should handle mutation errors', async () => {
      const errorMessage = 'Mutation Failed';
      mockedAxios.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      let caughtError;
      await act(async () => {
        try {
          await result.current.mutate({ id: 1, name: 'New Task' });
        } catch (err) {
          caughtError = err;
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(caughtError.message).toBe(errorMessage);
    });

    it('should merge default options with provided options', async () => {
      const mockData = { id: 1, name: 'New Task' };
      const responseData = { id: 1, name: 'New Task', created: true };
      mockedAxios.mockResolvedValueOnce({ data: responseData });

      const defaultOptions = { method: 'PUT', headers: { 'X-Custom': 'value' } };
      const { result } = renderHook(() => useApiMutation('/api/tasks', defaultOptions));

      await act(async () => {
        await result.current.mutate(mockData, { timeout: 5000 });
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Custom': 'value'
        },
        data: mockData,
        timeout: 5000
      });
    });

    it('should handle missing token gracefully', async () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      const mockData = { id: 1, name: 'New Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      await act(async () => {
        await result.current.mutate(mockData);
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: mockData
      });
    });
  });
});