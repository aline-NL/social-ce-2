import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

type User = {
  id: number;
  email: string;
  nome: string;
  tipo: 'admin' | 'atendente' | 'visualizador';
};

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = localStorage.getItem('@SAS:user');
      const storagedToken = localStorage.getItem('@SAS:token');

      if (storagedUser && storagedToken) {
        try {
          const response = await authApi.me();
          setUser(response.data);
        } catch (error) {
          // Token inválido ou expirado
          localStorage.removeItem('@SAS:user');
          localStorage.removeItem('@SAS:token');
        }
      }
      
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem('@SAS:user', JSON.stringify(user));
      localStorage.setItem('@SAS:token', token);

      navigate('/');
    } catch (error) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  function logout() {
    localStorage.removeItem('@SAS:user');
    localStorage.removeItem('@SAS:token');
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        login, 
        logout 
      }}
    >
      {!loading && children}
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
