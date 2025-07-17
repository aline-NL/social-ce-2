import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

type QueryKey = [string, Record<string, unknown>?];

export const useApiQuery = <T>(
  queryKey: QueryKey,
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T, AxiosError, T, QueryKey>, 'queryKey' | 'queryFn'>,
  config?: AxiosRequestConfig
) => {
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();

  return useQuery<T, AxiosError, T, QueryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      try {
        const response = await api.get<T>(url, {
          params,
          signal,
          ...config,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar os dados';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useApiMutation = <T, V = unknown>(
  mutationFn: (data: T) => Promise<AxiosResponse<V>>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: V) => void;
    onError?: (error: AxiosError) => void;
    invalidateQueries?: QueryKey[];
  }
) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();

  return useMutation<AxiosResponse<V>, AxiosError, T>({
    mutationFn: async (data: T) => {
      try {
        return await mutationFn(data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      if (options?.successMessage) {
        enqueueSnackbar(options.successMessage, { variant: 'success' });
      }
      
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
    },
    onError: (error: AxiosError) => {
      const errorMessage = options?.errorMessage || 
                         error.response?.data?.message || 
                         'Ocorreu um erro ao processar a requisição';
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
      
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

// Hook para operações CRUD
interface CrudApiOptions<T> {
  queryKey: string;
  endpoint: string;
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  errorMessages?: {
    create?: string;
    update?: string;
    delete?: string;
    getOne?: string;
    getAll?: string;
  };
  onSuccess?: (data?: T) => void;
}

export function useCrudApi<T extends { id?: string | number }>({
  queryKey,
  endpoint,
  successMessages = {},
  errorMessages = {},
  onSuccess,
}: CrudApiOptions<T>) {
  const queryClient = useQueryClient();
  const baseQueryKey = [queryKey];

  // List all
  const listQuery = useApiQuery<T[]>(
    [queryKey, 'list'],
    endpoint,
    undefined,
    {
      enabled: !!endpoint,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Get one
  const getOneQuery = (id: string | number) =>
    useApiQuery<T>(
      [queryKey, 'detail', { id }],
      `${endpoint}/${id}`,
      undefined,
      {
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
      }
    );

  // Create
  const createMutation = useApiMutation<T, T>(
    (data) => api.post<T>(endpoint, data),
    {
      successMessage: successMessages.create || 'Registro criado com sucesso!',
      errorMessage: errorMessages.create || 'Erro ao criar o registro',
      invalidateQueries: [baseQueryKey],
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
    }
  );

  // Update
  const updateMutation = useApiMutation<T, T>(
    (data: T) => {
      if (!data.id) throw new Error('ID is required for update');
      return api.put<T>(`${endpoint}/${data.id}`, data);
    },
    {
      successMessage: successMessages.update || 'Registro atualizado com sucesso!',
      errorMessage: errorMessages.update || 'Erro ao atualizar o registro',
      invalidateQueries: [baseQueryKey],
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
    }
  );

  // Delete
  const deleteMutation = useApiMutation<void, void>(
    (id: string | number) => api.delete(`${endpoint}/${id}`),
    {
      successMessage: successMessages.delete || 'Registro excluído com sucesso!',
      errorMessage: errorMessages.delete || 'Erro ao excluir o registro',
      invalidateQueries: [baseQueryKey],
    }
  );

  // Invalidate cache
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: baseQueryKey });
  };

  return {
    // Queries
    listQuery,
    getOneQuery,
    
    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    
    // Cache
    invalidateCache,
    
    // Combined states
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
  };
}
