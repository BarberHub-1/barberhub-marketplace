import { Link } from "react-router-dom";
import { Scissors, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-barber-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Scissors size={28} className="text-white" />
              <span className="text-xl font-semibold tracking-tight">BarberHub</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Conectando você às melhores barbearias da cidade. 
              Agende seu horário com facilidade e descubra o barbeiro perfeito para o seu estilo.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/barbershops" className="text-gray-300 hover:text-white transition-colors">
                  Barbearias
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-300">
              <li>contato@barberhub.com</li>
              <li>(11) 93949-8213</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BarberHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
