import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const navItems = [
  { label: "Sobre Nós", href: "#sobrenos" },
  { label: "Serviços", href: "#servico" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Contactos", href: "#contacto" },
];

export const Footer = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const getHref = (href: string) => {
    return isHomepage ? href : `/${href}`;
  };

  return (
    <footer className="footer">
      <div className="studio-container footer-grid">
        <div>
          {isHomepage ? (
            <a href="#top" className="footer-logo">
              <img src="/ungido/logo-footer.png" alt="Ungido Studio" />
            </a>
          ) : (
            <Link to="/" className="footer-logo">
              <img src="/ungido/logo-footer.png" alt="Ungido Studio" />
            </Link>
          )}
          <p>
            Produção multimédia e soluções gráficas para marcas que querem
            comunicar com presença.
          </p>
        </div>

        <div>
          <h4>Redes sociais</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/ungidostudio_2022/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4>Links rápidos</h4>
          <div className="footer-links">
            {navItems.map((item) => (
              <a key={item.href} href={getHref(item.href)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="studio-container footer-bottom">
        <span>©2025, UNGIDO STUDIO. Todos os direitos reservados.</span>
        <span>Captamos imagens que contam histórias.</span>
      </div>
    </footer>
  );
};
