'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Home, Users, Library, Image as ImageIcon, User, 
  Church, MapPin, Layers, GraduationCap, Settings, LogOut,
  ChevronRight, Book, Calendar, Gamepad2, Info
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { createClient } from '@/utils/supabase/client';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { group: 'Cadastros', items: [
    { name: 'Paróquia', icon: Church, href: '/cadastros/paroquia' },
    { name: 'Catequistas', icon: GraduationCap, href: '/cadastros/catequistas' },
    { name: 'Turmas', icon: Users, href: '/turmas' },
  ]},
  { group: 'Conteúdos e Ferramentas', items: [
    { name: 'Início', icon: Home, href: '/' },
    { name: 'Biblioteca', icon: Library, href: '/biblioteca' },
    { name: 'Bíblia Online', icon: Book, href: '/biblia' },
    { name: 'Calendário Litúrgico', icon: Calendar, href: '/calendario' },
    { name: 'Jogos e Recreação', icon: Gamepad2, href: '/jogos' },
    { name: 'Mural', icon: ImageIcon, href: '/mural' },
  ]},
  { group: 'Sistema', items: [
    { name: 'Meu Perfil', icon: User, href: '/perfil' },
    { name: 'Sobre', icon: Info, href: '/sobre' },
    { name: 'Configurações', icon: Settings, href: '/configuracoes' },
    { name: 'Sair', icon: LogOut, href: '#', color: 'text-red-500', action: 'logout' },
  ]}
];

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[300px] bg-white z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-black/15 flex justify-between items-center bg-[#f9f9f9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005da7] flex items-center justify-center text-white">
                  <Church size={24} />
                </div>
                <div>
                  <h2 className="font-manrope font-bold text-[#001e40] leading-tight">Catequese</h2>
                  <p className="text-[10px] font-bold text-[#005da7] uppercase tracking-widest">Digital</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#eeeeee] rounded-full transition-colors"
              >
                <X size={24} className="text-[#414751]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {menuItems.map((group) => (
                <div key={group.group} className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717783] px-4">
                    {group.group}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      
                      const handleClick = (e: React.MouseEvent) => {
                        if (item.action === 'logout') {
                          e.preventDefault();
                          handleLogout();
                        }
                        onClose();
                      };

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleClick}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-95 group",
                            isActive 
                              ? "bg-[#005da7] text-white" 
                              : cn("text-[#414751] hover:bg-[#f3f3f3]", item.color)
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={20} className={cn(isActive ? "text-white" : "text-[#005da7]")} />
                            <span className="font-bold text-sm">{item.name}</span>
                          </div>
                          {!isActive && <ChevronRight size={16} className="text-[#c1c7d3] group-hover:translate-x-1 transition-transform" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
