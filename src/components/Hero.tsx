import { Button } from "@/components/ui/button";
import { FadeIn } from "./Transitions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

// Removi os dados mockados para demonstração
// const availableLocations = [...];
// const availableBarbershops = [...];

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set("search", searchTerm);
    if (location) searchParams.set("location", location);
    
    navigate(`/barbershops?${searchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 z-10" />
        <div className="image-fade-mask absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
            alt="Barbearia profissional" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        <FadeIn delay={100} className="w-full max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium tracking-wide inline-block mb-6">
            BARBEARIAS PREMIUM NA PALMA DA SUA MÃO
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Encontre o lugar certo pro seu estilo único
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Descubra as melhores barbearias perto de você, agende horários com facilidade e mostre seu novo visual.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
