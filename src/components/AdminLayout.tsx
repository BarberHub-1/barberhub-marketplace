import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, LogOut, Home, Building2, Settings, BarChart, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
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

  const menuItems = [
    { path: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users size={20} />, label: "Usuários" },
    { path: "/admin/barbershops", icon: <Building2 size={20} />, label: "Barbearias" },
    { path: "/admin/reviews", icon: <Star className="h-5 w-5" />, label: "Avaliações" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "Configurações" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegação superior */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">Painel Administrativo</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="ml-64 pt-16 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 