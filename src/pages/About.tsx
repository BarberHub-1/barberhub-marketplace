import { FadeIn, StaggeredContainer } from "@/components/Transitions";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Award, Heart, BarChart, Clock } from "lucide-react";

const AboutValueCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="overflow-hidden border-barber-100">
      <CardContent className="p-6">
        <div className="flex gap-4 items-start">
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
      </CardContent>
    </Card>
  );
};

const TeamMember = ({ 
  name, 
  role, 
  image 
}: { 
  name: string; 
  role: string; 
  image: string;
}) => {
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-lg text-barber-900">{name}</h3>
      <p className="text-barber-600">{role}</p>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-24 pb-16 px-6 bg-barber-50">
        <div className="container mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold text-barber-900 text-center mb-6">
              Sobre a BarberHub
            </h1>
            <p className="text-lg text-barber-600 text-center max-w-2xl mx-auto">
              Conectando clientes a barbearias de qualidade desde 2025. 
              Nossa missão é revolucionar a experiência de agendamento de serviços de barbearia.
            </p>
          </FadeIn>
        </div>
      </section>
      
      {/* Nossa história */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/unidos.png" 
                alt="Nossa História" 
                className="rounded-lg shadow-md w-full h-[800px] object-cover"
              />
            </div>
            <FadeIn>
              <span className="text-sm font-medium text-barber-500 mb-3 block">NOSSA HISTÓRIA</span>
              <h2 className="text-3xl font-bold text-barber-900 mb-6">
                Como tudo começou
              </h2>
              <p className="text-barber-600 mb-4">
                A BarberHub nasceu da frustração com o processo tradicional de agendamento em barbearias. 
                Nossos fundadores, apaixonados por inovação, perceberam que havia uma 
                oportunidade para melhorar a experiência tanto para clientes quanto para profissionais do setor.
              </p>
              <p className="text-barber-600 mb-4">
                O nosso projeto acabou de começar e buscará parceiras em São Paulo. 
                Sonhamos em conectar milhares de clientes a centenas de barbearias em todo o Brasil, 
                transformando a maneira como as pessoas encontram e reservam serviços de barbearia.
              </p>
              <p className="text-barber-600">
                Nossa plataforma está em desenvolvimento para oferecer uma experiência cada vez mais completa, desde a escolha até o pagamento, 
                tudo com a conveniência de alguns cliques.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Nossos Valores */}
      <section className="py-16 px-6 bg-barber-50">
        <div className="container mx-auto max-w-7xl">
          <FadeIn className="text-center mb-12">
            <span className="text-sm font-medium text-barber-500 mb-3 block">NOSSOS VALORES</span>
            <h2 className="text-3xl font-bold text-barber-900 mb-4">
              O que nos guia
            </h2>
            <p className="text-barber-600 max-w-2xl mx-auto">
              Acreditamos que pequenos detalhes fazem grandes diferenças.
              Estes são os valores fundamentais que orientam nossas decisões e ações diárias.
            </p>
          </FadeIn>
          
          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn>
              <AboutValueCard
                icon={<Users size={24} />}
                title="Comunidade"
                description="Construímos conexões significativas entre clientes e barbeiros, promovendo uma comunidade vibrante."
              />
            </FadeIn>
            <FadeIn>
              <AboutValueCard
                icon={<Award size={24} />}
                title="Excelência"
                description="Buscamos a excelência em tudo que fazemos, desde nossa plataforma até nosso atendimento ao cliente."
              />
            </FadeIn>
            <FadeIn>
              <AboutValueCard
                icon={<Heart size={24} />}
                title="Paixão"
                description="Somos apaixonados por barbearias e pela arte da barbearia, e isso se reflete em nosso trabalho."
              />
            </FadeIn>
            <FadeIn>
              <AboutValueCard
                icon={<Building size={24} />}
                title="Crescimento"
                description="Ajudamos pequenas barbearias a crescerem e prosperarem através de nossa plataforma acessível."
              />
            </FadeIn>
            <FadeIn>
              <AboutValueCard
                icon={<BarChart size={24} />}
                title="Inovação"
                description="Constantemente buscamos novas maneiras de melhorar a experiência para todos os nossos usuários."
              />
            </FadeIn>
            <FadeIn>
              <AboutValueCard
                icon={<Clock size={24} />}
                title="Confiabilidade"
                description="Construímos confiança através de nosso serviço consistente e confiável para clientes e barbearias."
              />
            </FadeIn>
          </StaggeredContainer>
        </div>
      </section>
      
      {/* Time */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <FadeIn className="text-center mb-12">
            <span className="text-sm font-medium text-barber-500 mb-3 block">NOSSO TIME</span>
            <h2 className="text-3xl font-bold text-barber-900 mb-4">
              Conheça quem faz acontecer
            </h2>
            <p className="text-barber-600 max-w-2xl mx-auto">
              Nossa equipe é curta, mas é formada por profissionais apaixonados por tecnologia e pela experiência do cliente.
            </p>
          </FadeIn>
          
          <div className="flex flex-wrap justify-center gap-12">
            <FadeIn>
              <TeamMember
                name="Matheus Gonçalves"
                role="CEO & Fundador"
                image="/matheus.png"
              />
            </FadeIn>
            <FadeIn>
              <TeamMember
                name="Laura Barros"
                role="Co-Fundadora"
                image="/laura.png"
              />
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Missão */}
      <section className="py-16 px-6 bg-barber-900 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              "Conectar pessoas a excelentes experiências de barbearia, elevando o padrão do setor 
              e ajudando profissionais a prosperarem através da tecnologia."
            </p>
          </FadeIn>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
