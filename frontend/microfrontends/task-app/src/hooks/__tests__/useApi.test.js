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

    it('handles empty response data', async () => {
      mockedAxios.mockResolvedValueOnce({ data: null });

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('handles undefined response data', async () => {
      mockedAxios.mockResolvedValueOnce({ data: undefined });

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toBe(undefined);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('handles complex nested options', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const complexOptions = {
        method: 'GET',
        params: { 
          page: 1, 
          limit: 10, 
          filters: { status: 'active' },
          sort: { field: 'name', order: 'asc' }
        },
        timeout: 5000,
        headers: { 'X-Custom-Header': 'value' }
      };

      const { result } = renderHook(() => useApi('/api/tasks', complexOptions));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Custom-Header': 'value'
        },
        ...complexOptions
      });
    });

    it('handles URL changes', async () => {
      const mockData1 = { id: 1, name: 'Task 1' };
      const mockData2 = { id: 2, name: 'Task 2' };
      
      mockedAxios
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      const { result, rerender } = renderHook(
        ({ url }) => useApi(url),
        { initialProps: { url: '/api/tasks' } }
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData1);

      // Change URL
      rerender({ url: '/api/users' });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData2);
      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('handles options changes', async () => {
      const mockData1 = { id: 1, name: 'Task 1' };
      const mockData2 = { id: 2, name: 'Task 2' };
      
      mockedAxios
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      const { result, rerender } = renderHook(
        ({ options }) => useApi('/api/tasks', options),
        { initialProps: { options: { page: 1 } } }
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData1);

      // Change options
      rerender({ options: { page: 2 } });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData2);
      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('handles rapid successive calls', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      const { result, rerender } = renderHook(
        ({ url }) => useApi(url),
        { initialProps: { url: '/api/tasks' } }
      );

      // Make rapid successive calls
      rerender({ url: '/api/tasks' });
      rerender({ url: '/api/tasks' });
      rerender({ url: '/api/tasks' });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      // Should only make one API call due to caching
      expect(mockedAxios).toHaveBeenCalledTimes(1);
    });

    it('handles cache timeout with very short timeout', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      // Use a very short cache timeout (1ms)
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

    it('handles cache disabled with multiple calls', async () => {
      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValue({ data: mockData });

      // First call with cache disabled
      const { result } = renderHook(() => useApi('/api/tasks', {}, false));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1);

      // Second call with cache disabled should make another API call
      const { result: result2 } = renderHook(() => useApi('/api/tasks', {}, false));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('handles sessionStorage errors gracefully', async () => {
      // Mock sessionStorage to throw an error
      const originalGetItem = mockSessionStorage.getItem;
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('SessionStorage error');
      });

      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useApi('/api/tasks'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        headers: {
          'Authorization': 'Bearer undefined',
          'Content-Type': 'application/json'
        }
      });

      // Restore original implementation
      mockSessionStorage.getItem = originalGetItem;
    });

    it('handles JSON.stringify errors in options', async () => {
      const circularObject = {};
      circularObject.self = circularObject;

      const mockData = { id: 1, name: 'Test Task' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      // This should not throw an error, but should handle the circular reference
      const { result } = renderHook(() => useApi('/api/tasks', circularObject));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.data).toEqual(mockData);
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
      const responseData = { id: 1, name: 'Test Task' };
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

    it('should handle multiple mutations sequentially', async () => {
      const mockData1 = { id: 1, name: 'Task 1' };
      const mockData2 = { id: 2, name: 'Task 2' };
      const responseData1 = { id: 1, name: 'New Task', created: true };
      const responseData2 = { id: 2, name: 'New Task', created: true };
      
      mockedAxios
        .mockResolvedValueOnce({ data: responseData1 })
        .mockResolvedValueOnce({ data: responseData2 });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      let mutationResult1, mutationResult2;
      await act(async () => {
        mutationResult1 = await result.current.mutate(mockData1);
        mutationResult2 = await result.current.mutate(mockData2);
      });

      expect(mutationResult1).toEqual(responseData1);
      expect(mutationResult2).toEqual(responseData2);
      expect(mockedAxios).toHaveBeenCalledTimes(2);
    });

    it('should handle empty data payload', async () => {
      const responseData = { created: true, id: 1, name: 'Task 1' };
      mockedAxios.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutate({});
      });

      expect(mutationResult).toEqual(responseData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        data: {}
      });
    });

    it('should handle null data payload', async () => {
      const responseData = { created: true, id: 2, name: 'Task 2' };
      mockedAxios.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutate(null);
      });

      expect(mutationResult).toEqual(responseData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        data: null
      });
    });

    it('should handle undefined data payload', async () => {
      const responseData = { success: true };
      mockedAxios.mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutate(undefined);
      });

      expect(mutationResult).toEqual(responseData);
      expect(mockedAxios).toHaveBeenCalledWith({
        url: '/api/tasks',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        data: undefined
      });
    });

    it('should handle axios response errors', async () => {
      const axiosError = {
        message: 'Request failed with status code 400',
        response: {
          status: 400,
          data: { error: 'Bad Request' }
        }
      };
      mockedAxios.mockRejectedValueOnce(axiosError);

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
      expect(result.current.error).toBe('Request failed with status code 400');
      expect(caughtError).toEqual(axiosError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.mockRejectedValueOnce(networkError);

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
      expect(result.current.error).toBe('Network Error');
      expect(caughtError).toEqual(networkError);
    });

    it('should handle errors without message', async () => {
      const errorWithoutMessage = { response: { status: 500 } };
      mockedAxios.mockRejectedValueOnce(errorWithoutMessage);

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
      expect(result.current.error).toBe(undefined);
      expect(caughtError).toEqual(errorWithoutMessage);
    });

    it('should reset error state on successful mutation after error', async () => {
      const errorMessage = 'First mutation failed';
      const mockData = { id: 1, name: 'New Task' };
      const responseData = { id: 1, name: 'New Task', created: true };
      
      mockedAxios
        .mockRejectedValueOnce(new Error(errorMessage))
        .mockResolvedValueOnce({ data: responseData });

      const { result } = renderHook(() => useApiMutation('/api/tasks'));

      // First mutation fails
      await act(async () => {
        try {
          await result.current.mutate(mockData);
        } catch (err) {
          // Expected to fail
        }
      });

      expect(result.current.error).toBe(errorMessage);

      // Second mutation succeeds
      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutate(mockData);
      });

      expect(result.current.error).toBe(null);
      expect(mutationResult).toEqual(responseData);
    });
  });
});