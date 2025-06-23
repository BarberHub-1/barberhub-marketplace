import { FadeIn, StaggeredContainer } from "./Transitions";
import { Scissors, CircleUser, Droplets, Sparkles, Palette, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const CategoryCard = ({ icon, title, description, className }: CategoryCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group border border-barber-100",
      className
    )}>
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-barber-100 group-hover:bg-barber-900 text-barber-900 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-barber-900">{title}</h3>
      <p className="text-barber-500 text-sm">{description}</p>
    </div>
  );
};

const categories = [
  {
    icon: <Scissors size={24} />,
    title: "Cortes de Cabelo",
    description: "Cortes clássicos, degradês, cortes curtos e mais, personalizados para o seu estilo."
  },
  {
    icon: <CircleUser size={24} />,
    title: "Cuidados com a Barba",
    description: "Mantenha sua barba impecável com aparo e modelagem profissional."
  },
  {
    icon: <Droplets size={24} />,
    title: "Estilização",
    description: "Obtenha o visual perfeito para qualquer ocasião com produtos premium."
  },
  {
    icon: <Sparkles size={24} />,
    title: "Luzes e Descoloração",
    description: "Transforme seu visual com técnicas modernas de coloração e efeitos de luz."
  },
  {
    icon: <Palette size={24} />,
    title: "Progressiva",
    description: "Tratamento profissional para cabelos crespos ou ondulados, com resultados duradouros."
  },
  {
    icon: <Star size={24} />,
    title: "Sobrancelha",
    description: "Design e modelagem de sobrancelhas para realçar sua expressão facial."
  }
];

const ServiceCategories = () => {
  return (
    <section id="categories" className="py-20 px-6 bg-barber-50">
      <div className="container mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <span className="text-sm font-medium text-barber-500 mb-2 block">EXPLORE OS SERVIÇOS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-barber-900 mb-4">Encontre exatamente o que você precisa</h2>
          <p className="text-barber-600 max-w-2xl mx-auto">
            Navegue pela nossa ampla gama de serviços profissionais de barbearia para encontrar o tratamento perfeito para suas necessidades.
          </p>
        </FadeIn>
        
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <FadeIn key={index}>
              <CategoryCard {...category} />
            </FadeIn>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
};

export default ServiceCategories;
