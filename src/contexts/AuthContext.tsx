import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';

interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
}

interface User {
  id: number;
  tipo: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Erro ao carregar dados de autenticação do localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      console.log('AuthContext - iniciando login');
      const response = await api.post<LoginResponse>('/auth/login', { email, senha });
      const { token, tipo, id } = response.data;
      
      console.log('AuthContext - resposta do login:', { token: !!token, tipo, id });
      
      // Mapear o tipo ADMINISTRADOR para ADMIN
      const role = tipo === 'ADMINISTRADOR' ? 'ADMIN' : tipo;
      
      const userData = { id, tipo, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('AuthContext - login concluído, userData:', userData);
    } catch (error) {
      console.error('AuthContext - erro no login:', error);
      throw new Error('Falha na autenticação');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 