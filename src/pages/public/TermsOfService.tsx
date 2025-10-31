import { Link } from "react-router-dom";
import { Scissors, X } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-barber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2">
                <Scissors size={28} className="text-barber-900" />
                <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
              </Link>
              <button
                onClick={() => window.close()}
                className="p-2 hover:bg-barber-100 rounded-full transition-colors"
                title="Fechar"
              >
                <X className="h-6 w-6 text-barber-900" />
              </button>
            </div>
            <h1 className="text-3xl font-bold text-barber-900">Termos de Serviço</h1>
            <p className="mt-2 text-barber-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-barber-700 leading-relaxed">
                Ao acessar e usar o BarberHub, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis, e reconhece que é responsável pelo cumprimento de quaisquer leis locais aplicáveis.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">2. Uso do Serviço</h2>
              <p className="text-barber-700 mb-4">
                O BarberHub é uma plataforma que conecta clientes a barbeiros profissionais. Ao usar nosso serviço, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Manter a confidencialidade de sua conta</li>
                <li>Não usar o serviço para fins ilegais</li>
                <li>Respeitar os horários e compromissos agendados</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">3. Contas de Usuário</h2>
              <p className="text-barber-700 mb-4">
                Para usar certos recursos do BarberHub, você precisará criar uma conta. Você é responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Manter a confidencialidade de suas credenciais</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">4. Política de Privacidade</h2>
              <p className="text-barber-700 leading-relaxed">
                Sua privacidade é importante para nós. Nossa política de privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">5. Responsabilidades dos Barbeiros</h2>
              <p className="text-barber-700 mb-4">
                Barbeiros registrados no BarberHub devem:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Manter um ambiente de trabalho seguro e higiênico</li>
                <li>Fornecer serviços de qualidade profissional</li>
                <li>Respeitar os horários agendados</li>
                <li>Manter suas informações de contato atualizadas</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">6. Responsabilidades dos Clientes</h2>
              <p className="text-barber-700 mb-4">
                Clientes do BarberHub devem:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Respeitar os horários agendados</li>
                <li>Fornecer informações precisas ao agendar serviços</li>
                <li>Tratar os profissionais com respeito</li>
                <li>Cancelar agendamentos com antecedência quando necessário</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">7. Modificações dos Termos</h2>
              <p className="text-barber-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-barber-700 mb-4">
                O BarberHub não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Qualidade dos serviços prestados pelos barbeiros</li>
                <li>Danos ou perdas resultantes do uso do serviço</li>
                <li>Problemas técnicos ou interrupções do serviço</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">9. Contato</h2>
              <p className="text-barber-700 leading-relaxed">
                Para questões sobre estes termos, entre em contato conosco através do e-mail:{" "}
                <a href="mailto:contato@barberhub.com" className="text-barber-900 hover:underline font-medium">
                  contato@barberhub.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.close()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-barber-900 hover:bg-barber-800"
            >
              Fechar e voltar ao cadastro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 