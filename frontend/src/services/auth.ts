import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  // Adicione outros campos conforme necessário
}

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Salva o token no localStorage
    localStorage.setItem('token', token);
    
    // Define o token no cabeçalho das requisições futuras
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
  window.location.href = '/login';
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    logout();
    return null;
  }
};
