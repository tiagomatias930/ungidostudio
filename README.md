# 🌐 Ungido Studio — Produção Multimédia & Soluções Gráficas

Website institucional moderno e responsivo do **Ungido Studio**, um estúdio profissional de produção de conteúdo visual, fotografia e design gráfico sediado em Luanda, Angola.

---

## ✨ Sobre o Projeto

Este website foi desenhado e desenvolvido para apresentar os serviços do Ungido Studio, o seu portfólio de trabalhos recentes e facilitar a captação de clientes através de um formulário inteligente e interativo.

### Principais Funcionalidades

- **Hero Dinâmico** — Apresentação imersiva com vídeo de fundo institucional, slogans dinâmicos e botões de chamada para ação (CTA).
- **Secção de Serviços** — Apresentação dos pilares do estúdio (Fotografia, Multimédia, Serviços Gráficos) com ícones personalizados.
- **Portfólio Completo** — Galeria dedicada no caminho `/portfolio` contendo todos os trabalhos realizados pelo estúdio (incluindo coberturas industriais como Catoca e Unitel).
- **Filtro de Projetos** — Filtros interativos para navegar rapidamente por categorias (Todos, Multimédia, Fotografia, Serviços Gráficos).
- **Visualizador Lightbox Premium** — Visualizador de imagens em ecrã inteiro (modal lightbox) com navegação suave, transições com desfoque de fundo (*glassmorphism*) e suporte completo a navegação por teclado (setas esquerda/direita e tecla `Escape`).
- **Integração com n8n via WebSocket** — O formulário de contactos estabelece uma ligação WebSocket instantânea e segura com o n8n para transmitir os briefings dos clientes.

---

## 🛠️ Tech Stack

| Camada       | Tecnologias                                                      |
| ------------ | ---------------------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Vite                                       |
| **Styling**  | Vanilla CSS, Tailwind CSS, shadcn/ui, Lucide Icons              |
| **Routing**  | React Router DOM                                                 |
| **State**    | TanStack React Query, React State                               |
| **Testes**   | Vitest, Testing Library (React)                                  |
| **Toasts**   | Sonner (notificações push elegantes)                             |

---

## 🚀 Começar

### Pré-requisitos

- **Node.js** ≥ 18
- **npm** ou **bun**

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/tiagomatias930/ungidostudio.git
cd ungidostudio

# Instalar dependências
npm install
# ou
bun install
```

### Desenvolvimento

```bash
npm run dev
# ou
bun dev
```

A aplicação estará disponível por padrão em `http://localhost:8080`.

### Build de Produção

```bash
npm run build
npm run preview
```

### Testes Automatizados

```bash
npm run test
```

---

## 🔌 Integração n8n via WebSocket

O formulário de contacto está preparado para enviar mensagens em tempo real para um servidor **n8n** através de ligações **WebSocket**. A URL pode ser personalizada no ficheiro `.env` através da chave `VITE_N8N_WS_URL`.

Para instruções passo a passo de configuração do workflow no n8n e estrutura do JSON, consulte:
👉 [Guia de Conexão n8n via WebSocket](docs/conexao-n8n-websocket.md)

---

## 📁 Estrutura do Projeto

```
├── docs/                # Documentação técnica (conexão n8n)
├── public/              # Assets estáticos (vídeos, logotipos e fotos)
│   ├── ungido/          # Assets de imagem principais do estúdio
│   └── portfolio_assets/# Assets específicos da galeria (Unitel, Catoca)
├── src/
│   ├── components/      # Componentes globais e reutilizáveis (Header, Footer)
│   ├── pages/           # Páginas da aplicação (Index, Portfolio, NotFound)
│   ├── test/            # Suítes de testes automatizados (vitest)
│   ├── App.tsx          # Componente raiz e rotas da aplicação
│   ├── index.css        # Estilos globais e tokens de cores
│   ├── portfolio.css    # Estilização da galeria e do modal lightbox
│   └── main.tsx         # Ponto de entrada da aplicação
├── vite.config.ts       # Configurações do Vite (porta 8080)
├── package.json
└── tsconfig.json
```

---

## 📬 Contacto & Redes Sociais

- **Telefone:** +244 928 002 093
- **Localização:** Morro Bento - Luanda, Angola
- **YouTube:** [@ungidostudio4957](https://www.youtube.com/@ungidostudio4957/videos)
- **Instagram:** [@ungidostudio_2022](https://www.instagram.com/ungidostudio_2022/)
