import { useState } from "react";
import { ServiceId } from "@/constants/services";
import ServiceFilters from "./ServiceFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Star } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    services: ServiceId[];
    location: string;
    rating: number;
    priceRange: [number, number];
    searchTerm: string;
  }) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [filters, setFilters] = useState({
    services: [] as ServiceId[],
    location: "",
    rating: 0,
    priceRange: [0, 200] as [number, number],
    searchTerm: "",
  });

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar barbearias..."
            className="pl-10"
            value={filters.searchTerm}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Localização"
            className="pl-10"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
      </div>

      <ServiceFilters
        selectedServices={filters.services}
        onServiceChange={(services) => handleChange("services", services)}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-barber-900">Avaliação</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{filters.rating.toFixed(1)}</span>
          </div>
        </div>
        <Slider
          value={[filters.rating]}
          onValueChange={(value) => handleChange("rating", value[0])}
          min={0}
          max={5}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-barber-900">Faixa de Preço</h3>
          <span className="text-sm font-medium">
            R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => handleChange("priceRange", value)}
          min={0}
          max={200}
          step={10}
          className="w-full"
        />
      </div>

      <Button
        className="w-full bg-barber-900 hover:bg-barber-800"
        onClick={() => {
          setFilters({
            services: [],
            location: "",
            rating: 0,
            priceRange: [0, 200],
            searchTerm: "",
          });
          handleChange("services", []);
          handleChange("location", "");
          handleChange("rating", 0);
          handleChange("priceRange", [0, 200]);
          handleChange("searchTerm", "");
          onFiltersChange({
            services: [],
            location: "",
            rating: 0,
            priceRange: [0, 200],
            searchTerm: "",
          });
        }}
      >
        Limpar Filtros
      </Button>
    </div>
  );
};

export default SearchFilters; 