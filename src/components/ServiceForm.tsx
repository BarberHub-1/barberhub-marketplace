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

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceFormProps {
  service?: Service;
  onSave: (service: Omit<Service, "id">) => void;
  onCancel: () => void;
}

const ServiceForm = ({ service, onSave, onCancel }: ServiceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Service, "id">>({
    name: service?.name || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Serviço</Label>
        <Select
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SERVICES.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Preço (R$)</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label>Duração (minutos)</Label>
        <Input
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          placeholder="30"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {service ? "Salvar Alterações" : "Adicionar Serviço"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm; 