import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main className="studio-shell min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="section-label text-center">Página não encontrada</p>
        <h1 className="mb-4 font-['Archivo'] text-5xl tracking-tight text-white">
          404
        </h1>
        <p className="mb-8 text-white/72">
          O endereço pedido não existe. Volte para a landing principal.
        </p>
        <a href="/" className="primary-button">
          <ArrowLeft size={18} />
          Voltar ao início
        </a>
      </div>
    </main>
  );
};

export default NotFound;
