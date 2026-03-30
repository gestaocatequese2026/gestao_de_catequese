'use client';

import React, { useState } from 'react';
import { Menu, Bell, ArrowLeft } from 'lucide-react';
import { SideMenu } from './side-menu';
import { useRouter } from 'next/navigation';
import { NotificationBell } from './notification-bell';

interface TopBarProps {
  title?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function TopBar({ title = 'Catequese', showBackButton = false, actions }: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/15 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <button 
              onClick={() => router.back()}
              className="text-[#005da7] hover:bg-[#eeeeee] transition-colors p-2 rounded-full active:scale-95 duration-200"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#005da7] hover:bg-[#eeeeee] transition-colors p-2 rounded-full active:scale-95 duration-200"
            >
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-manrope font-bold tracking-tight text-[#005da7]">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <NotificationBell />
        </div>
      </header>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
