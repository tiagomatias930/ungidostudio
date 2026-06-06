import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import "../portfolio.css";

interface PortfolioItem {
  src: string;
  title: string;
  description: string;
  category: "multimedia" | "fotografia" | "design";
  tall?: boolean;
}

const portfolioItems: PortfolioItem[] = [
  {
    src: "/ungido/portfolio-1.jpg",
    title: "Captação aérea",
    description: "Narrativa visual para campanhas, eventos e cobertura de produção.",
    category: "multimedia",
    tall: true,
  },
  {
    src: "/ungido/portfolio-2.jpg",
    title: "Cenário editorial",
    description: "Imagem com composição limpa para destaque em páginas e redes.",
    category: "design",
  },
  {
    src: "/ungido/portfolio-3.jpg",
    title: "Produção de estúdio",
    description: "Retrato com iluminação controlada e acabamento sofisticado.",
    category: "fotografia",
    tall: true,
  },
  {
    src: "/ungido/portfolio-4.jpg",
    title: "Cobertura documental",
    description: "Momentos reais captados com direção e consistência visual.",
    category: "fotografia",
  },
  {
    src: "/ungido/catoca1.jpg",
    title: "Mineração Catoca I",
    description: "Cobertura fotográfica das operações e infraestrutura industrial.",
    category: "fotografia",
  },
  {
    src: "/ungido/catoca2.jpg",
    title: "Mineração Catoca II",
    description: "Registo aéreo detalhado do complexo de mineração e exploração.",
    category: "multimedia",
    tall: true,
  },
  {
    src: "/ungido/catoca3.jpg",
    title: "Mineração Catoca III",
    description: "Perspetivas e detalhes da produção e logística industrial.",
    category: "fotografia",
  },
];

const categories = [
  { id: "all", label: "Todos" },
  { id: "multimedia", label: "Multimédia" },
  { id: "fotografia", label: "Fotografia" },
  { id: "design", label: "Serviços Gráficos" },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Set page title and meta description
  useEffect(() => {
    document.title = "Todos os Trabalhos - Ungido Studio";
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = activeCategory === "all"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="studio-shell">
        <section className="portfolio-page-hero">
          <div className="studio-container">
            <div className="text-left mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors" data-testid="back-to-home">
                <ArrowLeft size={16} />
                <span>Voltar ao início</span>
              </Link>
            </div>
            <h1>Nosso Portfólio</h1>
            <p>
              Explore a nossa coleção de trabalhos já realizados, abrangendo produções multimédia de alta definição, sessões fotográficas profissionais e criações de serviços gráficos premium.
            </p>
          </div>
        </section>

        <section className="content-section py-8">
          <div className="studio-container">
            {/* Filters */}
            <div className="portfolio-filter-container">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setLightboxIndex(null); // Reset lightbox when filter changes
                  }}
                  className={`portfolio-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="portfolio-page-grid" data-testid="portfolio-grid">
              {filteredItems.map((item, index) => (
                <article
                  key={item.src + index}
                  onClick={() => setLightboxIndex(index)}
                  className={`portfolio-card cursor-pointer group ${item.tall ? "portfolio-card-tall" : ""}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <div className="portfolio-card-overlay flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <Eye size={18} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)} data-testid="lightbox">
          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxIndex(null)}
              className="lightbox-btn lightbox-close"
              aria-label="Fechar galeria"
              data-testid="lightbox-close"
            >
              <X size={22} />
            </button>

            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="lightbox-btn lightbox-prev"
                  aria-label="Imagem anterior"
                  data-testid="lightbox-prev"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="lightbox-btn lightbox-next"
                  aria-label="Próxima imagem"
                  data-testid="lightbox-next"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <img
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].title}
              className="lightbox-image"
              data-testid="lightbox-img"
            />

            <div className="lightbox-caption-panel">
              <h3>{filteredItems[lightboxIndex].title}</h3>
              <p>{filteredItems[lightboxIndex].description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Portfolio;
