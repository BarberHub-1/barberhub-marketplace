import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: string;
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message: "Você precisa fazer login para continuar." }} replace />;
  }

  // Verifica se o usuário tem a role necessária
  const hasRequiredRole = role === 'ANY' || user?.role === role || 
    (role === 'ADMIN' && user?.tipo === 'ADMINISTRADOR');

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 