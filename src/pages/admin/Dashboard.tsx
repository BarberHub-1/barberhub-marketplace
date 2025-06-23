import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { dashboardService, DashboardStats } from '../../services/dashboard.service';
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsuarios,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Clientes cadastrados",
    },
    {
      title: "Total de Barbearias",
      value: stats?.totalEstabelecimentos,
      icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
      description: "Todos os status",
    },
    {
      title: "Total de Agendamentos",
      value: stats?.totalAgendamentos,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: "Registrados no sistema",
    },
    {
      title: "Barbearias Pendentes",
      value: stats?.estabelecimentosPendentes,
      icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
      description: "Aguardando aprovação",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value ?? '0'}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 