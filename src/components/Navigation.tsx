import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isAboutPage = location.pathname === '/about';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 bg-white shadow-sm"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Scissors size={28} className="text-barber-900" />
          <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/barbershops" className="text-barber-700 hover:text-barber-900 transition-colors text-sm font-medium">
            Barbearias
          </Link>
          {!isAuthenticated && (
            <Link to="/barbers" className="text-barber-700 hover:text-barber-900 transition-colors text-sm font-medium">
              Para Barbeiros
            </Link>
          )}
          <Link to="/about" className="text-barber-700 hover:text-barber-900 transition-colors text-sm font-medium">
            Sobre
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link to={
                user.tipo === 'CLIENTE' ? '/client/profile' :
                user.tipo === 'ESTABELECIMENTO' ? '/barber/profile' :
                (user.tipo === 'ADMINISTRADOR' || user.tipo === 'ADMIN') ? '/admin/dashboard' : '/'
              }>
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex"
                  size="sm"
                >
                  {user.tipo === 'CLIENTE' && 'Meu Perfil'}
                  {user.tipo === 'ESTABELECIMENTO' && 'Perfil Barbeiro'}
                  {(user.tipo === 'ADMINISTRADOR' || user.tipo === 'ADMIN') && 'Painel Admin'}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden md:inline-flex" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-barber-900 hover:bg-barber-800 text-white" size="sm">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
