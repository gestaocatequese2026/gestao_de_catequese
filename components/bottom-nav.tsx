'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Library, Image as ImageIcon, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Início', icon: Home, href: '/', color: 'text-blue-600' },
  { name: 'Turmas', icon: Users, href: '/turmas', color: 'text-emerald-600' },
  { name: 'Biblioteca', icon: Library, href: '/biblioteca', color: 'text-amber-600' },
  { name: 'Mural', icon: ImageIcon, href: '/mural', color: 'text-rose-600' },
  { name: 'Bíblia', icon: Book, href: '/biblia', color: 'text-violet-600' },
];

export function BottomNav() {
  const pathname = usePathname() || '/';

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-[2rem] border-t border-black/15 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-full md:bottom-6 md:px-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-2 transition-all duration-300 active:scale-90",
              isActive 
                ? "bg-white rounded-2xl px-5 border border-black/15" 
                : "text-[#414751] opacity-70 hover:opacity-100"
            )}
          >
            <Icon 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2} 
              className={cn(isActive ? item.color : "text-current")}
            />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider mt-1 font-manrope",
              isActive ? cn("opacity-100", item.color) : "opacity-70"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
