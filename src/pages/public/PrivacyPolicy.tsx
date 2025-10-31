import { Link } from "react-router-dom";
import { Scissors, X } from "lucide-react";

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold text-barber-900">Política de Privacidade</h1>
            <p className="mt-2 text-barber-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">1. Introdução</h2>
              <p className="text-barber-700 leading-relaxed">
                A BarberHub está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nossa plataforma.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">2. Informações que Coletamos</h2>
              <p className="text-barber-700 mb-4">
                Coletamos os seguintes tipos de informações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Informações de identificação pessoal (nome, email, telefone)</li>
                <li>Informações de localização (endereço, CEP)</li>
                <li>Informações de pagamento (processadas de forma segura)</li>
                <li>Dados de uso da plataforma</li>
                <li>Informações do dispositivo e navegador</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">3. Como Usamos suas Informações</h2>
              <p className="text-barber-700 mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar agendamentos e pagamentos</li>
                <li>Comunicar-se sobre sua conta e serviços</li>
                <li>Enviar atualizações e ofertas (com seu consentimento)</li>
                <li>Melhorar a experiência do usuário</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-barber-700 mb-4">
                Podemos compartilhar suas informações com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Barbeiros parceiros (apenas informações necessárias para o serviço)</li>
                <li>Processadores de pagamento</li>
                <li>Prestadores de serviços que nos auxiliam</li>
                <li>Autoridades legais quando exigido por lei</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-barber-700 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">6. Seus Direitos</h2>
              <p className="text-barber-700 mb-4">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-barber-700">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Retirar seu consentimento</li>
                <li>Receber uma cópia de seus dados</li>
              </ul>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">7. Cookies e Tecnologias Similares</h2>
              <p className="text-barber-700 leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">8. Alterações na Política</h2>
              <p className="text-barber-700 leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre quaisquer alterações significativas através do email ou por meio de um aviso em nosso site.
              </p>
            </section>

            <section className="bg-barber-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-barber-900 mb-4">9. Contato</h2>
              <p className="text-barber-700 leading-relaxed">
                Para questões sobre privacidade, entre em contato conosco através do e-mail:{" "}
                <a href="mailto:privacidade@barberhub.com" className="text-barber-900 hover:underline font-medium">
                  privacidade@barberhub.com
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

export default PrivacyPolicy; 