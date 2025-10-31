import { Button } from "@/components/ui/button";
import { Scissors, CheckCircle, Calendar, Clock, CreditCard, User } from "lucide-react";
import { FadeIn, StaggeredContainer } from "@/components/Transitions";
import { Link } from "react-router-dom";

const BarberBenefitCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex gap-4 p-6 rounded-lg bg-white shadow-sm border border-barber-100">
      <div className="shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-barber-100 flex items-center justify-center text-barber-900">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-barber-900">{title}</h3>
        <p className="text-barber-600">{description}</p>
      </div>
    </div>
  );
};

const Barbers = () => {
  return (
    <div className="min-h-screen pt-24 bg-barber-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4">
        <div className="container mx-auto px-6">
          <Link to="/" className="flex items-center gap-2">
            <Scissors size={28} className="text-barber-900" />
            <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
          </Link>
        </div>
      </nav>

      {/* Seção Hero */}
      <section className="relative pb-20 pt-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 md:order-1">
              <span className="text-sm font-medium text-barber-500 mb-3 block">JUNTE-SE À NOSSA PLATAFORMA</span>
              <h1 className="text-4xl md:text-5xl font-bold text-barber-900 mb-6">
                Cresça seu negócio de barbearia com o BarberHub
              </h1>
              <p className="text-barber-600 text-lg mb-8">
                Conecte-se com mais clientes, gerencie seus agendamentos com eficiência e leve sua barbearia para o próximo nível com nossa plataforma especializada.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-barber-900 hover:bg-barber-800" asChild>
                  <Link to="/barber-signup">Inscreva-se Agora</Link>
                </Button>
              </div>
            </FadeIn>
            <div className="order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Barbeiro trabalhando" 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <FadeIn className="text-center mb-16">
            <span className="text-sm font-medium text-barber-500 mb-2 block">POR QUE SE JUNTAR A NÓS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-barber-900 mb-4">
              Benefícios para Barbeiros
            </h2>
            <p className="text-barber-600 max-w-2xl mx-auto">
              Junte-se a milhares de barbeiros profissionais que transformaram seus negócios com nossa plataforma.
            </p>
          </FadeIn>

          <StaggeredContainer className="grid md:grid-cols-2 gap-6">
            <FadeIn>
              <BarberBenefitCard
                icon={<User size={24} />}
                title="Expanda Sua Clientele"
                description="Alcance milhares de clientes em potencial procurando serviços de barbearia de qualidade em sua área."
              />
            </FadeIn>
            <FadeIn>
              <BarberBenefitCard
                icon={<Calendar size={24} />}
                title="Gestão Fácil de Agendamentos"
                description="Gerencie todos os seus agendamentos em um só lugar com nosso sistema intuitivo de agendamento."
              />
            </FadeIn>
            <FadeIn>
              <BarberBenefitCard
                icon={<CreditCard size={24} />}
                title="Pagamentos Seguros"
                description="Aceite pagamentos online e depósitos com nosso sistema seguro de processamento de pagamentos."
              />
            </FadeIn>
            <FadeIn>
              <BarberBenefitCard
                icon={<CheckCircle size={24} />}
                title="Construa Sua Reputação"
                description="Colete avaliações e construa sua reputação online para atrair mais clientes fiéis."
              />
            </FadeIn>
            <FadeIn>
              <BarberBenefitCard
                icon={<Clock size={24} />}
                title="Reduza Faltas"
                description="Lembretes automatizados ajudam a reduzir faltas em agendamentos e cancelamentos de última hora."
              />
            </FadeIn>
            <FadeIn>
              <BarberBenefitCard
                icon={<Scissors size={24} />}
                title="Mostre Seu Trabalho"
                description="Exiba seu portfólio de cortes e estilos para mostrar sua expertise e atrair clientes."
              />
            </FadeIn>
          </StaggeredContainer>
        </div>
      </section>

      {/* Seção CTA */}
      <section className="py-20 px-6 bg-barber-900 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para se juntar ao BarberHub?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Comece a crescer seu negócio de barbearia hoje. Nossa equipe ajudará você a se configurar e começar a operar em pouco tempo.
            </p>
            <Button size="lg" className="bg-white text-barber-900 hover:bg-barber-100" asChild>
              <Link to="/barber-signup">Inscreva-se para Participar</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Barbers;
