import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassColor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('pré-catequese') || n.includes('pré catequese')) return 'bg-[#fff9c4] border-[#fff9c4]'; // Amarelo bem claro
  if (n.includes('eucaristia')) return 'bg-[#e8f5e9] border-[#e8f5e9]'; // Verde menta bem claro
  if (n.includes('perseverança') || n.includes('pré-crisma') || n.includes('pré crisma')) return 'bg-[#ffe0b2] border-[#ffe0b2]'; // Laranja bem claro
  if (n.includes('crisma')) return 'bg-[#ffcdd2] border-[#ffcdd2]'; // Vermelho bem claro
  if (n.includes('adulto')) return 'bg-[#e3f2fd] border-[#e3f2fd]'; // Azul bem claro
  return 'bg-[#e8f5e9] border-[#e8f5e9]'; // Default verde menta bem claro
}
