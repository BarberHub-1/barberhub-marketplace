import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Appointment {
  id: string;
  clientName: string;
  services: string[];
  date: string;
  time: string;
  status: "current" | "upcoming" | "completed" | "cancelled";
  employee?: string;
}

const BarberCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointments, setShowAppointments] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setShowAppointments(true);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = 42; // 6 rows of 7 days

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const isSelected = selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday ? "bg-barber-50" : ""
          } ${isSelected ? "ring-2 ring-barber-500" : ""}`}
        >
          <span className={`text-sm ${isToday ? "font-bold text-barber-900" : ""}`}>
            {day}
          </span>
          {/* Aqui você pode adicionar indicadores de agendamentos */}
          <div className="mt-1 space-y-1">
            <Badge variant="secondary" className="w-full justify-center text-xs">
              3 agendamentos
            </Badge>
          </div>
        </div>
      );
    }

    // Add empty cells for remaining days
    const remainingDays = totalDays - (firstDayOfMonth + daysInMonth);
    for (let i = 0; i < remainingDays; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-24 border border-gray-200 bg-gray-50" />
      );
    }

    return days;
  };

  return (
    <Dialog open={showAppointments} onOpenChange={setShowAppointments}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Ver Calendário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Calendário de Agendamentos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-white p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {selectedDate && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">
                Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {/* Aqui você pode listar os agendamentos do dia selecionado */}
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">João Silva</h4>
                        <p className="text-sm text-gray-600">14:00 - Corte de Cabelo</p>
                      </div>
                      <Badge>Agendado</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Maria Santos</h4>
                        <p className="text-sm text-gray-600">15:30 - Barba</p>
                      </div>
                      <Badge>Agendado</Badge>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarberCalendar; 