'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#1a1c1c]">
      <h2 className="text-2xl font-extrabold mb-4">Algo deu errado!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all"
      >
        Tentar novamente
      </button>
    </div>
  );
}
