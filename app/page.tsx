'use client';

import React from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Calendar, GraduationCap, BookOpen, Users, ChevronRight, Ticket, Baby, HeartHandshake, Church } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getCurrentLiturgicalSeason } from '@/lib/liturgical-calendar';

export default function Dashboard() {
  const { classes, isLoaded } = useAppStore();
  
  const getStudentsCount = (id: string) => 0;

  const activeClasses = classes.filter(c => c.status !== 'Inativa').slice(0, 3);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={24} />;
      case 'Ticket': return <Ticket size={24} />;
      case 'Baby': return <Baby size={24} />;
      case 'HeartHandshake': return <HeartHandshake size={24} />;
      default: return <GraduationCap size={24} />;
    }
  };

  const liturgicalTime = getCurrentLiturgicalSeason();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pb-32">
      <TopBar />
      
      <main className="pt-24 px-6 max-w-[1100px] mx-auto">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-manrope font-extrabold text-4xl text-[#005da7] tracking-tight mb-2">Olá, Catequista</h2>
          <p className="text-[#414751] font-plus-jakarta">Que a paz de Cristo esteja com você hoje.</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className={cn(
            "rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between shadow-sm border gap-2 sm:gap-0",
            liturgicalTime.themeColor,
            liturgicalTime.color === 'white' ? "border-gray-200" : "border-transparent text-white"
          )}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                liturgicalTime.color === 'white'
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white/20 text-white"
              )}>
                <Church size={16} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold uppercase tracking-wider opacity-80 shrink-0",
                  liturgicalTime.color === 'white' ? "text-gray-500" : "text-white/80"
                )}>
                  Tempo Litúrgico:
                </p>
                <h3 className={cn(
                  "font-manrope font-bold text-base sm:text-lg truncate",
                  liturgicalTime.color === 'white' ? "text-gray-900" : "text-white"
                )}>
                  {liturgicalTime.name}
                </h3>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }}
            className="bg-white p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/15 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-manrope font-bold text-2xl text-[#1a1c1c]">Minhas Turmas</h3>
              <Link href="/turmas" className="text-[#005da7] font-bold text-sm bg-[#f8f9fa] px-4 py-2 rounded-full hover:bg-[#e8eaed] transition-colors">
                Ver Todas
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 flex-1 justify-center">
              {activeClasses.length > 0 ? activeClasses.map(cls => (
                <Link key={cls.id} href={`/turmas/${cls.id}`} className="group flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-black/15">
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#5AC8FA] to-[#007AFF] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                    {getIcon(cls.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-[#1a1c1c] truncate">{cls.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-[#717783] flex items-center gap-1"><Users size={12}/> {getStudentsCount(cls.id)}</span>
                      <span className="text-xs font-medium text-[#717783] flex items-center gap-1"><Calendar size={12}/> {cls.schedule}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[#c1c7d3] group-hover:text-[#007AFF] transition-colors shrink-0" />
                </Link>
              )) : (
                <p className="text-sm text-[#717783] text-center py-4 col-span-full">Nenhuma turma ativa.</p>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
