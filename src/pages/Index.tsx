import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { toast } from "sonner";
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Play,
  Youtube,
} from "lucide-react";

const services = [
  {
    title: "Multimédia",
    description:
      "Produção de vídeos institucionais, cobertura de eventos, transmissões em direto e conteúdos para redes sociais com ritmo e clareza visual.",
    icon: "/ungido/video-editing-app.png",
  },
  {
    title: "Fotografia",
    description:
      "Registo fotográfico de eventos, campanhas e retratos com direção de arte, consistência de cor e foco narrativo.",
    icon: "/ungido/picture.png",
  },
  {
    title: "Serviços Gráficos",
    description:
      "Branding, materiais promocionais e design digital para fortalecer a presença da marca em todos os pontos de contacto.",
    icon: "/ungido/service.png",
  },
];

const partners = [
  { src: "/ungido/client-1.png", alt: "Sonangol" },
  { src: "/ungido/client-2.png", alt: "TAAG" },
  { src: "/ungido/client-3.png", alt: "Parceiro 3" },
  { src: "/ungido/client-4.png", alt: "Parceiro 4" },
  { src: "/ungido/client-5.webp", alt: "DStv Angola" },
  { src: "/ungido/logo-talatona.png", alt: "Administração de Talatona" },
  { src: "/ungido/catocA3.png", alt: "CATO-A3" },
  { src: "/ungido/grow_logo.svg", alt: "Grow-Construction" },
  { src: "/ungido/logo-filda.png", alt: "Filda" },
  { src: "/ungido/unitel.png", alt: "Unitel" },
];

const portfolio = [
  {
    src: "/ungido/portfolio-1.jpg",
    title: "Captação aérea",
    description: "Narrativa visual para campanhas, eventos e cobertura de produção.",
    tall: true,
  },
  {
    src: "/ungido/portfolio-2.jpg",
    title: "Cenário editorial",
    description: "Imagem com composição limpa para destaque em páginas e redes.",
  },
];

const videoPillars = [
  "Vídeo institucional",
  "Cobertura fotográfica",
  "Live stream",
  "Conteúdo para campanhas",
];

const contactItems = [
  {
    label: "E-mail",
    value: "chiseia@ungidostudio.ao",
    href: "mailto:chiseia@ungidostudio.ao",
    icon: Mail,
  },
  {
    label: "Telefone",
    value: "+244 928 002 093",
    href: "tel:+244928002093",
    icon: Phone,
  },
  {
    label: "Endereço",
    value: "Morro Bento - Luanda",
    href: "https://maps.google.com/?q=Morro+Bento+Luanda",
    icon: MapPin,
  },
];



const Index = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const rawUrl = import.meta.env.VITE_N8N_WS_URL || "";
    const wsUrl = rawUrl.replace(/^['"]|['"]$/g, "");

    if (!wsUrl) {
      toast.error("A URL do n8n não está configurada.");
      setIsSubmitting(false);
      return;
    }

    const isHttp = wsUrl.startsWith("http://") || wsUrl.startsWith("https://");

    if (isHttp) {
      try {
        const response = await fetch(wsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "form_submission",
            timestamp: new Date().toISOString(),
            data: formData,
          }),
        });

        if (response.ok) {
          toast.success("Formulário recebido com sucesso pelo n8n!");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          toast.error(`Erro ao enviar formulário: ${response.statusText || response.status}`);
        }
      } catch (err) {
        console.error("Erro ao submeter via Webhook:", err);
        toast.error("Erro de ligação ao n8n. Verifique a URL do webhook.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const socket = new WebSocket(wsUrl);
        let gotAck = false;

        const timeoutId = setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            socket.close();
            toast.error("Ligação ao n8n expirou. Verifique se o servidor está ativo.");
            setIsSubmitting(false);
          }
        }, 5000);

        socket.onopen = () => {
          clearTimeout(timeoutId);
          const payload = {
            event: "form_submission",
            timestamp: new Date().toISOString(),
            data: formData
          };
          socket.send(JSON.stringify(payload));
          
          setTimeout(() => {
            if (!gotAck && socket.readyState === WebSocket.OPEN) {
              toast.success("Formulário submetido com sucesso via WebSocket!");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
              });
              setIsSubmitting(false);
              socket.close();
            }
          }, 1500);
        };

        socket.onmessage = (event) => {
          gotAck = true;
          setIsSubmitting(false);
          try {
            const response = JSON.parse(event.data);
            if (response.status === "error" || response.error) {
              toast.error(`Erro: ${response.message || "n8n rejeitou a submissão"}`);
            } else {
              toast.success("Formulário recebido com sucesso pelo n8n!");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
              });
            }
          } catch {
            toast.success("Formulário submetido com sucesso!");
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              subject: "",
              message: "",
            });
          }
          socket.close();
        };

        socket.onerror = (err) => {
          clearTimeout(timeoutId);
          setIsSubmitting(false);
          console.error("Erro WebSocket:", err);
          toast.error("Erro de ligação WebSocket. Verifique as configurações do n8n.");
        };

      } catch (err) {
        setIsSubmitting(false);
        console.error("Erro ao iniciar WebSocket:", err);
        toast.error("Não foi possível estabelecer ligação WebSocket.");
      }
    }
  };

  return (
    <main className="studio-shell">
      <Header />

      <section id="top" className="hero-section">
        <video
          className="hero-video"
          src="/ungido/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-overlay" />
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="studio-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Produção multimédia e soluções gráficas</p>
            <h1 className="hero-title">
              Conteúdo visual com intenção, precisão e presença.
            </h1>
            <p className="hero-text">
              A Ungido Studio cria peças audiovisuais, fotografia e design
              capazes de elevar marcas, contar histórias e transformar campanhas
              em experiências memoráveis.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#portfolio">
                Ver portfólio
                <ChevronRight size={18} />
              </a>
              <a className="secondary-button" href="#contacto">
                Pedir proposta
              </a>
            </div>

            <div className="hero-pills">
              {videoPillars.map((pill) => (
                <span key={pill} className="hero-pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span className="hero-card-kicker">Live / Photo / Motion</span>
              <span className="hero-card-badge">Angola</span>
            </div>

            <div className="hero-card-media">
              <div className="hero-card-ring" />
              <div className="hero-card-play">
                <Play size={30} fill="currentColor" />
              </div>
            </div>

            <div className="hero-card-body">
              <h2>Visual storytelling para marcas que querem se destacar.</h2>
              <p>
                Projetos pensados para comunicar com elegância, coerência e
                impacto em cada formato.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sobrenos" className="content-section section-alt">
        <div className="studio-container split-layout">
          <div className="section-copy">
            <p className="section-label">Sobre nós</p>
            <h2 className="mb-4 mt-2">Somos uma equipa focada em multimédia e identidade visual.</h2>
            <p className="mb-4 mt-2">
              Trabalhamos com produção audiovisual, fotografia e design gráfico
              para criar soluções consistentes, rápidas e visualmente fortes.
            </p>
            <p className="mb-6">
              O nosso diferencial está na capacidade de transformar ideias em
              conteúdos visuais impactantes, alinhados às necessidades do mercado
              atual e aos objectivos de cada cliente.
            </p>

            <div className="mini-stats">
              <div>
                <strong>3</strong>
                <span>Áreas centrais de serviço</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Resposta rápida a pedidos</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Foco em consistência visual</span>
              </div>
            </div>
          </div>

          <div className="media-panel">
            <video
              className="media-video"
              src="/ungido/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        </div>
      </section>

      <section id="servico" className="content-section">
        <div className="studio-container">
          <div className="section-heading">
            <div>
              <p className="section-label">Serviços</p>
              <h2 className="mt-2 mb-4">Conheça os nossos serviços</h2>
            </div>
          </div>
          <p className="font-size-20 mt-2 mb-9">
            Oferecemos soluções completas em comunicação visual e multimédia,<br />
            combinando criatividade, técnica e inovação em cada entrega.
          </p>
          <div className="service-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <div className="service-icon">
                  <img src={service.icon} alt={service.title} className="service-icon-img" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section section-alt">
        <div className="studio-container">
          <div className="section-heading section-heading-center">
            <div>
              <p className="section-label">Clientes e parceiros</p>
              <h2>Marcas que já confiaram no nosso trabalho</h2>
            </div>
          </div>

          <div className="partners-grid">
            {partners.map((partner) => (
              <div key={partner.alt} className="partner-card">
                <img src={partner.src} alt={partner.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="content-section">
        <div className="studio-container split-layout portfolio-layout">
          <div className="section-copy">
            <p className="section-label">Portfólio</p>
            <h2>Projetos recentes em multimédia e design.</h2>
            <p className="mb-4">
              Apresentamos uma seleção de trabalhos que traduzem o nosso
              compromisso com criatividade, qualidade e inovação.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                className="primary-button primary-button-dark"
                to="/portfolio"
              >
                Ver mais
                <ChevronRight size={18} />
              </Link>
              <a
                className="secondary-button"
                href="https://www.youtube.com/@ungidostudio4957/videos"
                target="_blank"
                rel="noreferrer"
              >
                Ver no YouTube
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="portfolio-grid">
            {portfolio.map((item) => (
              <article
                key={item.title}
                className={`portfolio-card ${item.tall ? "portfolio-card-tall" : ""}`}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="portfolio-card-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section section-alt">
        <div className="studio-container video-showcase">
          {[
            {
              title: "Vídeo institucional",
              description: "Narrativa para apresentar a marca e os seus valores.",
            },
            {
              title: "Cobertura fotográfica",
              description: "Captação de momentos com enquadramento e consistência.",
            },
            {
              title: "Live stream",
              description: "Transmissões em direto com estabilidade e clareza.",
            },
            {
              title: "Campanhas digitais",
              description: "Formatos pensados para performance em redes sociais.",
            },
          ].map((item, index) => (
            <article key={item.title} className="video-card">
              <div className="video-card-number">0{index + 1}</div>
              <div className="video-card-play">
                <Play size={24} fill="currentColor" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="content-section">
        <div className="studio-container contact-grid">
          <div className="contact-info">
            <p className="section-label">Contactos</p>
            <h2>Vamos trabalhar juntos.</h2>
            <p>
              Envie a sua ideia, briefing ou pedido de orçamento. Respondemos
              com uma proposta clara e orientada para o resultado.
            </p>

            <div className="contact-list">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} className="contact-item">
                    <span className="contact-icon">
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <em>{item.value}</em>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <h3>Preencha o formulário</h3>

            <div className="form-grid">
              <label>
                <span>Primeiro nome</span>
                <input
                  type="text"
                  placeholder="Primeiro nome"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </label>
              <label>
                <span>Último nome</span>
                <input
                  type="text"
                  placeholder="Último nome"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </label>
            </div>

            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="seuemail@dominio.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>

            <label>
              <span>Assunto</span>
              <input
                type="text"
                placeholder="Em que podemos ajudar?"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </label>

            <label>
              <span>Mensagem</span>
              <textarea
                rows={5}
                placeholder="Descreva o seu projecto"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </label>

            <button
              type="submit"
              className="primary-button primary-button-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "A enviar..." : "Submeter"}
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
