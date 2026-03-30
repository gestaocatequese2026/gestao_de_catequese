import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#1a1c1c]">
      <h1 className="text-4xl font-extrabold mb-4">404 - Página não encontrada</h1>
      <p className="text-[#717783] mb-8">A página que você está procurando não existe ou foi movida.</p>
      <Link href="/" className="px-6 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all">
        Voltar para o Início
      </Link>
    </div>
  );
}
