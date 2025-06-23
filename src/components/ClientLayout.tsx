import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, LogOut, History, Star } from "lucide-react";
import { Scissors } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ClientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-barber-50">
      {/* Barra de navegação superior */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/client/profile" className="flex items-center gap-2">
            <Scissors size={24} className="text-barber-900" />
            <span className="text-lg font-semibold tracking-tight text-barber-900">BarberHub</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r">
        <nav className="p-4 space-y-2">
          <Link
            to="/client/profile"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("/client/profile")
                ? "bg-barber-100 text-barber-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </Link>
          <Link
            to="/client/appointments"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("/client/appointments")
                ? "bg-barber-100 text-barber-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Agendamentos</span>
          </Link>
          <Link
            to="/client/history"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("/client/history")
                ? "bg-barber-100 text-barber-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <History className="w-5 h-5" />
            <span>Histórico</span>
          </Link>
          <Link
            to="/client/reviews"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("/client/reviews")
                ? "bg-barber-100 text-barber-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Star className="w-5 h-5" />
            <span>Avaliações</span>
          </Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout; 