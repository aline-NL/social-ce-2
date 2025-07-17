import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { useSnackbar } from 'notistack';

export type UserRole = 'admin' | 'atendente' | 'visualizador';

export interface User {
  id: number;
  email: string;
  nome: string;
  role: UserRole;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AUTH_STORAGE_KEY = '@SAS:auth';
const REFRESH_TOKEN_THRESHOLD = 5 * 60 * 1000; // 5 minutes

interface AuthStorageData {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const loadStoragedData = useCallback((): AuthStorageData | null => {
    try {
      const storagedData = localStorage.getItem(AUTH_STORAGE_KEY);
      return storagedData ? JSON.parse(storagedData) : null;
    } catch (error) {
      console.error('Failed to parse auth data from storage', error);
      return null;
    }
  }, []);

  const setAuthData = useCallback((data: AuthStorageData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setUser(data.user);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;

    try {
      setIsRefreshing(true);
      const storagedData = loadStoragedData();
      
      if (!storagedData?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(storagedData.refreshToken);
      setAuthData({
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresIn: Date.now() + response.data.expiresIn * 1000,
      });
      return true;
    } catch (error) {
      console.error('Failed to refresh token', error);
      clearAuthData();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loadStoragedData, setAuthData, clearAuthData]);

  const checkAuth = useCallback(async () => {
    try {
      const storagedData = loadStoragedData();
      
      if (!storagedData) {
        throw new Error('No authentication data');
      }

      // Check if token is expired or about to expire
      const isTokenExpired = Date.now() >= storagedData.expiresIn - REFRESH_TOKEN_THRESHOLD;
      
      if (isTokenExpired) {
        const refreshed = await refreshToken();
        if (!refreshed) throw new Error('Failed to refresh token');
      } else {
        setUser(storagedData.user);
      }
    } catch (error) {
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [loadStoragedData, refreshToken, clearAuthData]);

  useEffect(() => {
    checkAuth();
    
    // Set up token refresh interval
    const interval = setInterval(() => {
      const storagedData = loadStoragedData();
      if (storagedData) {
        const timeUntilExpiry = storagedData.expiresIn - Date.now();
        if (timeUntilExpiry < REFRESH_TOKEN_THRESHOLD) {
          refreshToken().catch(console.error);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAuth, loadStoragedData, refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      
      setAuthData({
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresIn: Date.now() + response.data.expiresIn * 1000,
      });

      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Falha ao fazer login. Verifique suas credenciais.',
        { variant: 'error' }
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    navigate('/login');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      admin: 3,
      atendente: 2,
      visualizador: 1,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useProtectedRoute(requiredRole?: UserRole) {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location }, replace: true });
      } else if (requiredRole && !hasPermission(requiredRole)) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, hasPermission, navigate, location]);

  return { isAuthorized: isAuthenticated && (!requiredRole || hasPermission(requiredRole)), user };
}
