import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">BarberHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/barbershops" className="text-gray-700 hover:text-blue-600">
              Barbearias
            </Link>
            
            {user ? (
              <>
                {user.tipo === 'ESTABELECIMENTO' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                {user.tipo === 'CLIENTE' && (
                  <Link to="/appointments" className="text-gray-700 hover:text-blue-600">
                    Meus Agendamentos
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 