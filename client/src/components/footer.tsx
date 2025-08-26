import { MessageSquare, Mail, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-dark border-t border-dark-tertiary/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4" data-testid="footer-brand">
              AutomaDev
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transformamos negócios através da automação inteligente e desenvolvimento web profissional.
              Sua empresa merece crescer de forma eficiente e escalável.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                data-testid="social-twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
                data-testid="social-instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4" data-testid="footer-services-title">
              Serviços
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-primary transition-colors duration-300"
                  data-testid="footer-link-automation"
                >
                  Automação de Processos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-primary transition-colors duration-300"
                  data-testid="footer-link-websites"
                >
                  Criação de Sites
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-primary transition-colors duration-300"
                  data-testid="footer-link-integration"
                >
                  Integração de Sistemas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-primary transition-colors duration-300"
                  data-testid="footer-link-consultation"
                >
                  Consultoria
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4" data-testid="footer-contact-title">
              Contato
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300 flex items-center"
                  data-testid="footer-link-whatsapp"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@automadev.com"
                  className="hover:text-primary transition-colors duration-300 flex items-center"
                  data-testid="footer-link-email"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-tertiary/30 mt-12 pt-8 text-center text-gray-400">
          <p data-testid="footer-copyright">
            &copy; 2024 AutomaDev. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
