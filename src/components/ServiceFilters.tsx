import { AVAILABLE_SERVICES, ServiceId, getServiceLabel } from "@/constants/services";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceFiltersProps {
  selectedServices: ServiceId[];
  onServiceChange: (services: ServiceId[]) => void;
}

const ServiceFilters = ({ selectedServices, onServiceChange }: ServiceFiltersProps) => {
  const handleServiceChange = (serviceId: ServiceId, checked: boolean) => {
    if (checked) {
      onServiceChange([...selectedServices, serviceId]);
    } else {
      onServiceChange(selectedServices.filter(id => id !== serviceId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-barber-900">Serviços</h3>
        {selectedServices.length > 0 && (
          <button
            onClick={() => onServiceChange([])}
            className="text-sm text-barber-600 hover:text-barber-900"
          >
            Limpar filtros
          </button>
        )}
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {AVAILABLE_SERVICES.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={selectedServices.includes(service)}
                onCheckedChange={(checked) => 
                  handleServiceChange(service, checked as boolean)
                }
              />
              <Label
                htmlFor={service}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {getServiceLabel(service)}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServiceFilters; 