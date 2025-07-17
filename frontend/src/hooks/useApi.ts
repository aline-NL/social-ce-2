import { useState, useCallback } from 'react';
import api from '../services/api';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface UseApiOptions {
  method?: HttpMethod;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = <T = any>(url: string, options: UseApiOptions = {}) => {
  const { method = 'get', onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (body?: any, params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'post':
          response = await api.post<T>(url, body, { params });
          break;
        case 'put':
          response = await api.put<T>(url, body, { params });
          break;
        case 'delete':
          response = await api.delete<T>(url, { params });
          break;
        case 'patch':
          response = await api.patch<T>(url, body, { params });
          break;
        default:
          response = await api.get<T>(url, { params });
      }

      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      console.error(`API Error (${method.toUpperCase()} ${url}):`, err);
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError]);

  return { data, error, loading, execute };
};
