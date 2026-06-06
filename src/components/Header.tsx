import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Sobre Nós", href: "#sobrenos" },
  { label: "Serviços", href: "#servico" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Contactos", href: "#contacto" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const getHref = (href: string) => {
    return isHomepage ? href : `/${href}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#001033]/90 backdrop-blur-xl">
      <div className="studio-container header-inner">
        {isHomepage ? (
          <a href="#top" className="logo-wrap" aria-label="Ungido Studio">
            <img
              src="/ungido/logo-header.png"
              alt="Ungido Studio"
              className="logo-img"
            />
          </a>
        ) : (
          <Link to="/" className="logo-wrap" aria-label="Ungido Studio">
            <img
              src="/ungido/logo-header.png"
              alt="Ungido Studio"
              className="logo-img"
            />
          </Link>
        )}

        <nav className="nav-desktop">
          {navItems.map((item) => (
            <a key={item.href} href={getHref(item.href)} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href={getHref("#contacto")} className="header-cta">
            Falar connosco
          </a>
          <button
            type="button"
            className="menu-button"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={getHref(item.href)}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
};
