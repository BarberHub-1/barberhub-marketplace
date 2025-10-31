import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Clock, Save, X } from "lucide-react";

interface WorkingHours {
  id?: number;
  diaSemana: string;
  horarioAbertura: string;
  horarioFechamento: string;
  estabelecimentoId: number;
}

interface Estabelecimento {
  id: number;
  nomeProprietario: string;
  nomeEstabelecimento: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  cep: string;
  telefone: string;
  email: string;
  status: string;
  descricao?: string;
  horario: WorkingHours[];
}

const DIAS_SEMANA = [
  "DOMINGO",
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO"
];

const BarberEditHours = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [enabledDays, setEnabledDays] = useState<Set<string>>(new Set());
  const [existingDays, setExistingDays] = useState<Set<string>>(new Set());

  const { data: establishmentData } = useQuery<Estabelecimento>({
    queryKey: ['establishment', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("ID do estabelecimento não encontrado");
      const response = await api.get<Estabelecimento>(`/api/estabelecimentos/${user.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (establishmentData?.horario) {
      // Cria um mapa dos horários existentes
      const horariosExistentes = new Map(
        establishmentData.horario.map(h => [h.diaSemana, h])
      );
      
      // Cria a lista completa com todos os dias, incluindo os que não têm horários
      const todosHorarios = DIAS_SEMANA.map(dia => {
        const horarioExistente = horariosExistentes.get(dia);
        return horarioExistente || {
          diaSemana: dia,
          horarioAbertura: "09:00",
          horarioFechamento: "18:00",
          estabelecimentoId: user?.id || 0
        };
      });
      
      setWorkingHours(todosHorarios);
      // Define os dias habilitados baseado nos horários existentes
      const enabled = new Set(establishmentData.horario.map(h => h.diaSemana));
      setEnabledDays(enabled);
      // Define os dias que já existiam
      setExistingDays(enabled);
    } else {
      // Inicializa com horários padrão se não existir
      const defaultHours = DIAS_SEMANA.map(dia => ({
        diaSemana: dia,
        horarioAbertura: "09:00",
        horarioFechamento: "18:00",
        estabelecimentoId: user?.id || 0
      }));
      setWorkingHours(defaultHours);
      // Todos os dias habilitados por padrão
      setEnabledDays(new Set(DIAS_SEMANA));
      setExistingDays(new Set());
    }
  }, [establishmentData, user?.id]);

  const updateMutation = useMutation({
    mutationFn: async (hours: WorkingHours[]) => {
      if (!user?.id) throw new Error("ID do estabelecimento não encontrado");
      
      // Busca os dados atuais do estabelecimento
      const estabelecimentoAtual = await api.get<Estabelecimento>(`/api/estabelecimentos/${user.id}`);
      
      // Filtra apenas os horários dos dias habilitados
      const enabledHours = hours.filter(h => enabledDays.has(h.diaSemana));
      
      const formData = new FormData();
      const estabelecimentoData = {
        id: estabelecimentoAtual.data.id,
        nomeProprietario: estabelecimentoAtual.data.nomeProprietario,
        nomeEstabelecimento: estabelecimentoAtual.data.nomeEstabelecimento,
        cnpj: estabelecimentoAtual.data.cnpj,
        endereco: estabelecimentoAtual.data.endereco,
        cidade: estabelecimentoAtual.data.cidade,
        cep: estabelecimentoAtual.data.cep,
        telefone: estabelecimentoAtual.data.telefone,
        email: estabelecimentoAtual.data.email,
        status: estabelecimentoAtual.data.status,
        descricao: estabelecimentoAtual.data.descricao,
        horario: enabledHours
      };
      
      formData.append('estabelecimento', new Blob([JSON.stringify(estabelecimentoData)], {
        type: 'application/json'
      }));

      const response = await api.put(`/api/estabelecimentos/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Horários atualizados com sucesso!"
      });
      queryClient.invalidateQueries({ queryKey: ["establishment", user?.id] });
      navigate("/barber/profile");
    },
    onError: (error) => {
      console.error("Erro ao atualizar horários:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar horários. Verifique se você está autenticado e tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleTimeChange = (dia: string, field: 'horarioAbertura' | 'horarioFechamento', value: string) => {
    setWorkingHours(prev => 
      prev.map(wh => 
        wh.diaSemana === dia ? { ...wh, [field]: value } : wh
      )
    );
  };

  const handleDayToggle = (dia: string, enabled: boolean) => {
    setEnabledDays(prev => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(dia);
      } else {
        newSet.delete(dia);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    if (enabledDays.size === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos um dia da semana deve estar habilitado.",
        variant: "destructive"
      });
      return;
    }
    updateMutation.mutate(workingHours);
  };

  const getEnabledDaysText = () => {
    const enabled = Array.from(enabledDays);
    if (enabled.length === 0) return "Nenhum dia habilitado";
    if (enabled.length === 7) return "Todos os dias da semana";
    if (enabled.length === 1) return enabled[0];
    return `${enabled.length} dias habilitados`;
  };

  const getEnabledDaysHours = () => {
    return workingHours
      .filter(h => enabledDays.has(h.diaSemana))
      .map(h => `${h.diaSemana}: ${h.horarioAbertura} - ${h.horarioFechamento}`)
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-barber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-barber-900">Editar Horários</h1>
              <p className="mt-2 text-barber-600">
                Configure os horários de funcionamento da sua barbearia
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate("/barber/profile")}
              >
                <X size={16} />
                Cancelar
              </Button>
              <Button 
                className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                <Save size={16} />
                Salvar Alterações
              </Button>
            </div>
          </div>

          {/* Resumo dos dias habilitados */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-barber-900">Resumo</h3>
                  <p className="text-sm text-barber-600">{getEnabledDaysText()}</p>
                </div>
                <div className="text-sm text-barber-600">
                  {enabledDays.size > 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {enabledDays.size} dia{enabledDays.size > 1 ? 's' : ''} ativo{enabledDays.size > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              {enabledDays.size > 0 && (
                <div className="text-xs text-barber-500 bg-barber-50 p-2 rounded">
                  <strong>Horários:</strong> {getEnabledDaysHours()}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Defina os horários de atendimento para cada dia da semana. 
                Todos os dias aparecem na lista - use o switch para habilitar ou desabilitar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Legenda */}
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <h4 className="font-medium text-gray-700 mb-2">Legenda:</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Dia ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded opacity-60"></div>
                    <span>Dia desabilitado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded border-dashed"></div>
                    <span>Novo dia disponível</span>
                  </div>
                </div>
              </div>

              {workingHours.map((horario) => {
                const isEnabled = enabledDays.has(horario.diaSemana);
                const isExisting = existingDays.has(horario.diaSemana);
                const isNew = !isExisting;
                
                return (
                  <div key={horario.diaSemana} className={`flex items-center gap-4 p-4 border rounded-lg ${
                    !isEnabled ? 'bg-gray-50 opacity-60' : ''
                  } ${isNew && !isEnabled ? 'border-dashed border-gray-300' : ''}`}>
                    <div className="w-32 flex items-center gap-2">
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleDayToggle(horario.diaSemana, checked)}
                      />
                      <div className="flex flex-col">
                        <Label className={!isEnabled ? 'text-gray-500' : ''}>
                          {horario.diaSemana}
                        </Label>
                        {isNew && !isEnabled && (
                          <span className="text-xs text-blue-600">Novo</span>
                        )}
                        {isNew && isEnabled && (
                          <span className="text-xs text-green-600">Adicionado</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-barber-600" />
                        <Input
                          type="time"
                          value={horario.horarioAbertura}
                          onChange={(e) => handleTimeChange(horario.diaSemana, 'horarioAbertura', e.target.value)}
                          className="w-32"
                          disabled={!isEnabled}
                        />
                      </div>
                      <span className="text-barber-600">até</span>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-barber-600" />
                        <Input
                          type="time"
                          value={horario.horarioFechamento}
                          onChange={(e) => handleTimeChange(horario.diaSemana, 'horarioFechamento', e.target.value)}
                          className="w-32"
                          disabled={!isEnabled}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BarberEditHours; 