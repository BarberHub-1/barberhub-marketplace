import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Barbers from "./pages/Barbers";
import Login from "@/pages/Login";
import Signup from "./pages/Signup";
import BarberSignup from "./pages/BarberSignup";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Barbershops from './pages/Barbershops';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from "@/pages/ResetPassword";
import BarberAppointments from "@/pages/BarberAppointments";
import BarberProfile from "@/pages/BarberProfile";
import BarberEditProfile from "@/pages/BarberEditProfile";
import BarberEditHours from "@/pages/BarberEditHours";
import BarberLayout from "@/components/BarberLayout";
import BarberEmployees from "@/pages/BarberEmployees";
import ClientLayout from "@/components/ClientLayout";
import ClientProfile from "@/pages/ClientProfile";
import ClientAppointments from "@/pages/ClientAppointments";
import ClientHistory from "@/pages/ClientHistory";
import ClientReviews from "@/pages/ClientReviews";
import BarberShopDetails from './pages/BarberShopDetails';
import Appointment from './pages/Appointment';
import ClientSchedule from './pages/ClientSchedule';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBarbershops from './pages/admin/Barbershops';
import AdminServices from './pages/admin/Services';
import AdminReviews from './pages/admin/Reviews';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import ClientAppointmentsAdmin from './pages/admin/ClientAppointmentsAdmin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/barber-signup" element={<BarberSignup />} />
              <Route path="/about" element={<About />} />
              <Route path="/barbers" element={<Barbers />} />
              <Route path="/barbershops" element={<Barbershops />} />
              <Route path="/barbershops/:id" element={<BarberShopDetails />} />
              <Route path="/agendamento/:id" element={<PrivateRoute role="ANY"><Appointment /></PrivateRoute>} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Rotas do Barbeiro */}
              <Route path="/barber" element={<PrivateRoute role="ESTABELECIMENTO"><BarberLayout /></PrivateRoute>}>
                  <Route path="profile" element={<BarberProfile />} />
                  <Route path="edit-profile" element={<BarberEditProfile />} />
                  <Route path="edit-hours" element={<BarberEditHours />} />
                  <Route path="employees" element={<BarberEmployees />} />
                  <Route path="appointments" element={<BarberAppointments />} />
              </Route>

              {/* Rotas do Cliente */}
              <Route path="/client" element={<PrivateRoute role="CLIENTE"><ClientLayout /></PrivateRoute>}>
                  <Route path="profile" element={<ClientProfile />} />
                  <Route path="appointments" element={<ClientAppointments />} />
                  <Route path="history" element={<ClientHistory />} />
                  <Route path="schedule" element={<ClientSchedule />} />
                  <Route path="reviews" element={<ClientReviews />} />
              </Route>

              {/* Rotas do Administrador */}
              <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id/appointments" element={<ClientAppointmentsAdmin />} />
                <Route path="barbershops" element={<AdminBarbershops />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Rotas do Barbeiro */}
              <Route path="/barber/profile" element={<BarberProfile />} />
              <Route path="/barber/edit-profile" element={<BarberEditProfile />} />
              <Route path="/barber/employees" element={<BarberEmployees />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
