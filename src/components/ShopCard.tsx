import { Star, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ShopCardProps {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  services: string[];
  className?: string;
  status?: string;
}

const ShopCard = ({
  id,
  name,
  image,
  location,
  rating,
  reviews,
  services,
  className,
  status
}: ShopCardProps) => {
  return (
    <Link to={`/barbershops/${id}`} className="block group">
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col",
          className
        )}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image || 'https://placehold.co/400x300/e2e8f0/1e293b?text=Barbearia'}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 flex-1">
              {name}
            </h3>
            {status === "APROVADO" && (
              <div className="flex items-center ml-2">
                <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 ml-1">({reviews})</span>
              </div>
            )}
          </div>

          <div className="flex items-center mb-3 text-gray-500">
            <MapPin size={14} className="mr-2" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                +{services.length - 3} mais
              </span>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-2" />
              <span>Disponível hoje</span>
            </div>
            <Button
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white"
              asChild
            >
              <Link to={`/barbershops/${id}`}>Ver Detalhes</Link>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
