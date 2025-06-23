import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_SERVICES } from "@/constants/services";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  services: string[];
  email: string;
  phone: string;
  photo?: string;
}

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, "id">) => void;
  onCancel: () => void;
}

const EmployeeForm = ({ employee, onSave, onCancel }: EmployeeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    name: employee?.name || "",
    role: employee?.role || "Barbeiro",
    services: employee?.services || [],
    email: employee?.email || "",
    phone: employee?.phone || "",
    photo: employee?.photo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || formData.services.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  const handleAddService = (serviceId: string) => {
    const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
    if (service && !formData.services.includes(service.label)) {
      setFormData({
        ...formData,
        services: [...formData.services, service.label],
      });
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((service) => service !== serviceToRemove),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Barbeiro *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label>E-mail *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Telefone *</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="space-y-2">
        <Label>Serviços Realizados *</Label>
        <Select
          onValueChange={handleAddService}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione os serviços" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SERVICES
              .filter((service) => !formData.services.includes(service.label))
              .map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.services.map((service) => (
            <Badge key={service} variant="secondary" className="flex items-center gap-1">
              {service}
              <button
                type="button"
                onClick={() => handleRemoveService(service)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {employee ? "Salvar Alterações" : "Adicionar Barbeiro"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm; 