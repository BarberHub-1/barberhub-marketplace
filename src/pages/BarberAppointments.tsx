import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, X, Check, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BarberCalendar from "@/components/BarberCalendar";
import { agendamentoService, Agendamento } from "@/services/agendamento.service";
import { Spinner } from "@/components/Spinner";

interface Appointment {
  id: string;
  clientName: string;
  services: string[];
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  employee?: string;
}

const BarberAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const fetchAppointments = useCallback(async (tab: "upcoming" | "completed" | "cancelled") => {
    try {
      setLoading(true);
      let statusToFetch: string[] = [];
      if (tab === "upcoming") {
        statusToFetch = ["AGENDADA"];
      } else if (tab === "completed") {
        statusToFetch = ["CONCLUIDA"];
      } else if (tab === "cancelled") {
        statusToFetch = ["CANCELADA"];
      }

      const data = await agendamentoService.getAgendamentosEstabelecimento(statusToFetch);

      const mappedAppointments = data.map((ag: Agendamento) => {
        const appointmentDate = new Date(ag.dataHora);

        let status: Appointment['status'] = 'upcoming';
        if (ag.status === 'CONCLUIDA') {
          status = 'completed';
        } else if (ag.status === 'CANCELADA') {
          status = 'cancelled';
        }

        return {
          id: ag.id.toString(),
          clientName: ag.clienteNome || 'Nome não informado',
          services: ag.servicosNomes,
          date: appointmentDate.toISOString().split('T')[0],
          time: appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: status,
          employee: ag.profissionalId?.toString(),
        };
      });

      setAppointments(mappedAppointments);
    } catch (err) {
      setError("Não foi possível carregar os agendamentos.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [fetchAppointments, activeTab]);

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = async () => {
    if (selectedAppointment) {
        try {
            await agendamentoService.cancelarAgendamento(parseInt(selectedAppointment.id, 10));
            toast({
              title: "Agendamento cancelado",
              description: "O agendamento foi cancelado com sucesso.",
            });
            fetchAppointments(activeTab);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível cancelar o agendamento.",
                variant: "destructive",
            });
        }
    }
    setShowCancelDialog(false);
  };

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
        await agendamentoService.concluirAgendamento(parseInt(appointment.id, 10));
        toast({
          title: "Agendamento finalizado",
          description: "O atendimento foi marcado como concluído.",
        });
        fetchAppointments(activeTab);
    } catch (error) {
        toast({
            title: "Erro",
            description: "Não foi possível finalizar o agendamento.",
            variant: "destructive",
        });
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-500">Agendado</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Finalizado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{appointment.clientName}</h3>
            {getStatusBadge(appointment.status)}
          </div>
          {appointment.employee && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              {appointment.employee}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(appointment.date).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {appointment.time}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {appointment.services.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {appointment.status === "upcoming" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCompleteAppointment(appointment)}
            >
              <Check className="w-4 h-4 mr-2" />
              Concluir Agendamento
            </Button>
          )}
          {appointment.status !== "cancelled" && appointment.status !== "completed" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelAppointment(appointment)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming");
  const completedAppointments = appointments.filter(apt => apt.status === "completed");
  const cancelledAppointments = appointments.filter(apt => apt.status === "cancelled");

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Agendamentos</h1>
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <Tabs 
          value={activeTab}
          defaultValue="upcoming" 
          className="space-y-4"
          onValueChange={(value) => setActiveTab(value as "upcoming" | "completed" | "cancelled")}
        >
          <TabsList>
            <TabsTrigger value="upcoming">Próximos Atendimentos</TabsTrigger>
            <TabsTrigger value="completed">Agendamentos Realizados</TabsTrigger>
            <TabsTrigger value="cancelled">Agendamentos Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <ScrollArea className="h-[600px] pr-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <p className="text-center text-gray-500 pt-10">Não há próximos agendamentos.</p>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed">
            <ScrollArea className="h-[600px] pr-4">
              {completedAppointments.length > 0 ? (
                completedAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <p className="text-center text-gray-500 pt-10">Não há agendamentos realizados.</p>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cancelled">
            <ScrollArea className="h-[600px] pr-4">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <p className="text-center text-gray-500 pt-10">Não há agendamentos cancelados.</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelAppointment}>
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BarberAppointments; 