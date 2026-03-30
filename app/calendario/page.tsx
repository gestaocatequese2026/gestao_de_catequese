'use client';

import React, { useState, useMemo } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { liturgicalEvents, LiturgicalEvent } from '@/lib/liturgical-calendar';
import Image from 'next/image';
import { ReportButton } from '@/components/report-button';

type LiturgicalSeason = 'advent' | 'christmas' | 'lent' | 'easter' | 'ordinary' | 'triduum';

interface SeasonInfo {
  name: string;
  color: string;
  bgGradient: string;
  accentColor: string;
  description: string;
}

const seasons: Record<LiturgicalSeason, SeasonInfo> = {
  advent: {
    name: 'Tempo do Advento',
    color: 'purple',
    bgGradient: 'from-purple-900/20 via-purple-50/50 to-white',
    accentColor: 'text-purple-700',
    description: 'Tempo de preparação e expectativa para o Natal.'
  },
  christmas: {
    name: 'Tempo do Natal',
    color: 'white',
    bgGradient: 'from-yellow-100/30 via-white to-white',
    accentColor: 'text-yellow-700',
    description: 'Celebração do nascimento de Jesus Cristo.'
  },
  lent: {
    name: 'Tempo da Quaresma',
    color: 'purple',
    bgGradient: 'from-indigo-900/20 via-indigo-50/50 to-white',
    accentColor: 'text-indigo-800',
    description: 'Tempo de penitência e conversão rumo à Páscoa.'
  },
  triduum: {
    name: 'Tríduo Pascal',
    color: 'red',
    bgGradient: 'from-red-900/20 via-red-50/50 to-white',
    accentColor: 'text-red-700',
    description: 'O centro do ano litúrgico: Paixão, Morte e Ressurreição.'
  },
  easter: {
    name: 'Tempo da Páscoa',
    color: 'white',
    bgGradient: 'from-amber-100/30 via-white to-white',
    accentColor: 'text-amber-600',
    description: 'Cinquenta dias de alegria pela Ressurreição do Senhor.'
  },
  ordinary: {
    name: 'Tempo Comum',
    color: 'green',
    bgGradient: 'from-emerald-900/10 via-emerald-50/30 to-white',
    accentColor: 'text-emerald-700',
    description: 'Tempo de crescimento e seguimento de Jesus no dia a dia.'
  }
};

export default function CalendarioLiturgico() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Start in March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 25));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getLiturgicalSeason = (date: Date): LiturgicalSeason => {
    const month = date.getMonth();
    const day = date.getDate();

    // Simplified 2026 Liturgical Calendar
    if (month === 0 && day <= 11) return 'christmas';
    if ((month === 0 && day > 11) || (month === 1 && day < 18)) return 'ordinary';
    if ((month === 1 && day >= 18) || (month === 2) || (month === 3 && day <= 2)) return 'lent';
    if (month === 3 && day >= 2 && day <= 4) return 'triduum';
    if ((month === 3 && day >= 5) || (month === 4 && day <= 24)) return 'easter';
    if ((month === 4 && day > 24) || (month > 4 && month < 10) || (month === 10 && day <= 28)) return 'ordinary';
    if ((month === 10 && day > 28) || (month === 11 && day < 25)) return 'advent';
    return 'christmas';
  };

  const currentSeason = useMemo(() => getLiturgicalSeason(currentDate), [currentDate]);
  const seasonInfo = seasons[currentSeason];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const selectedDateString = selectedDate ? formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : '';
  const selectedEvents = selectedDateString ? liturgicalEvents[selectedDateString] || [] : [];

  // Prepare events list for report (current month)
  const monthlyEvents = useMemo(() => {
    const list: any[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    Object.entries(liturgicalEvents).forEach(([dateStr, events]) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (y === year && m === month + 1) { // month+1 because it's 1-indexed in dateStr
        events.forEach(e => {
          list.push({
            ...e,
            date: dateStr,
            dateFormatted: `${d}/${String(m).padStart(2, '0')}/${y}`
          });
        });
      }
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [currentDate]);

  const getEventImage = (event: LiturgicalEvent) => {
    const title = event.title.toLowerCase();
    if (title.includes('maria') || title.includes('nossa senhora')) {
      return 'https://images.unsplash.com/photo-1572889613146-24e038827018?q=80&w=800&auto=format&fit=crop';
    }
    if (title.includes('cristo') || title.includes('jesus') || title.includes('senhor')) {
      return 'https://images.unsplash.com/photo-1548625361-f6dbcd00fa9e?q=80&w=800&auto=format&fit=crop';
    }
    if (event.color === 'red') {
      return 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800&auto=format&fit=crop';
    }
    if (event.color === 'purple') {
      return 'https://images.unsplash.com/photo-1519818187318-718b2c2834b9?q=80&w=800&auto=format&fit=crop';
    }
    if (event.color === 'white') {
      return 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=800&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1548427357-124b8d752f25?q=80&w=800&auto=format&fit=crop';
  };

  const getEventDotColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'purple': return 'bg-purple-500';
      case 'white': return 'bg-amber-400';
      case 'green': return 'bg-emerald-500';
      case 'rose': return 'bg-rose-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={cn("min-h-screen pb-24 font-plus-jakarta transition-colors duration-1000 bg-gradient-to-b", seasonInfo.bgGradient)}>
      <TopBar 
        title="Calendário Litúrgico" 
        actions={
          <ReportButton 
            moduleName="Calendario"
            reportTitle={`Calendário Litúrgico - ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            reportSubtitle="Eventos, Solemnidades e Memórias"
            type="calendario"
            data={monthlyEvents}
            columns={[
              { key: 'dateFormatted', label: 'Data' },
              { key: 'title', label: 'Celebração' },
              { key: 'type', label: 'Grau' },
              { key: 'color', label: 'Cor Litúrgica' }
            ]}
          />
        }
      />

      <main className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Liturgical Season Tab */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shadow-inner shrink-0",
              seasonInfo.color === 'purple' ? "bg-purple-100 text-purple-700" :
              seasonInfo.color === 'red' ? "bg-red-100 text-red-700" :
              seasonInfo.color === 'white' ? "bg-amber-50 text-amber-600" :
              "bg-emerald-100 text-emerald-700"
            )}>
              <Sparkles size={12} />
            </div>
            <div className="flex flex-col">
              <h2 className={cn("font-manrope font-bold text-sm tracking-tight leading-none", seasonInfo.accentColor)}>
                {seasonInfo.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200/50">
              <div className={cn("w-2 h-2 rounded-full", 
                seasonInfo.color === 'purple' ? "bg-purple-600" :
                seasonInfo.color === 'red' ? "bg-red-600" :
                seasonInfo.color === 'white' ? "bg-amber-400" :
                "bg-emerald-600"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717783]">Cor</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-white/60"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#717783] uppercase tracking-[0.2em] mb-1">Folhinha</span>
                <h3 className="font-manrope font-black text-3xl text-[#1a1c1c] capitalize">
                  {monthNames[currentDate.getMonth()]} <span className="text-[#717783] font-light">{currentDate.getFullYear()}</span>
                </h3>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-black/15 hover:bg-[#f8f9fa] transition-all active:scale-95">
                  <ChevronLeft size={20} className="text-[#414751]" />
                </button>
                <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-black/15 hover:bg-[#f8f9fa] transition-all active:scale-95">
                  <ChevronRight size={20} className="text-[#414751]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[10px] font-black text-[#717783] uppercase tracking-[0.15em]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[60px] md:min-h-[80px]" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateString = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day);
                const eventsForDay = liturgicalEvents[dateString] || [];
                const hasEvents = eventsForDay.length > 0;
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() && selectedDate?.getFullYear() === currentDate.getFullYear();
                
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const daySeason = getLiturgicalSeason(dayDate);
                const daySeasonInfo = seasons[daySeason];

                const primaryEventColor = hasEvents ? getEventDotColor(eventsForDay[0].color) : '';
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={cn(
                      "min-h-[60px] md:min-h-[80px] rounded-2xl flex flex-col items-center justify-start pt-2 px-1 relative transition-all duration-300 group overflow-hidden",
                      isSelected 
                        ? "bg-[#005da7] text-white shadow-lg shadow-[#005da7]/30 scale-105 z-10" 
                        : "hover:bg-white hover:shadow-md text-[#1a1c1c] border border-transparent hover:border-white/80",
                      hasEvents && !isSelected && "font-bold"
                    )}
                  >
                    <span className="text-base z-10 mb-1">{day}</span>
                    {hasEvents ? (
                      <div className="flex flex-col items-center w-full px-1 z-10">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mb-1 transition-transform group-hover:scale-125",
                          isSelected ? "bg-white" : primaryEventColor
                        )} />
                        <span className={cn(
                          "text-[8px] md:text-[9px] leading-tight text-center w-full line-clamp-2",
                          isSelected ? "text-white/90" : "text-[#717783]"
                        )}>
                          {eventsForDay[0].title}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full px-1 z-10 opacity-60">
                        <div className={cn(
                          "w-1 h-1 rounded-full mb-1",
                          daySeasonInfo.color === 'purple' ? "bg-purple-400" :
                          daySeasonInfo.color === 'red' ? "bg-red-400" :
                          daySeasonInfo.color === 'white' ? "bg-amber-300" :
                          "bg-emerald-400"
                        )} />
                        <span className={cn(
                          "text-[7px] md:text-[8px] leading-tight text-center w-full line-clamp-2",
                          isSelected ? "text-white/70" : "text-[#a1a7b3]"
                        )}>
                          {daySeasonInfo.name}
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <motion.div 
                        layoutId="selectedDay"
                        className="absolute inset-0 bg-[#005da7] rounded-2xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Day Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-white/60 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#005da7]/10 flex items-center justify-center text-[#005da7] shadow-inner">
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-manrope font-black text-xl text-[#1a1c1c]">Liturgia do Dia</h3>
                    <p className="text-xs font-bold text-[#717783] uppercase tracking-widest">
                      {selectedDate ? `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}` : 'Selecione uma data'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDateString}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {selectedEvents.length > 0 ? (
                      selectedEvents.map((event, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-[2rem] shadow-lg shadow-black/5 border border-black/15 group">
                          {/* Background Image with Overlay */}
                          <div className="absolute inset-0 z-0 h-full">
                            <Image 
                              src={getEventImage(event)} 
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className={cn(
                              "absolute inset-0 opacity-80 mix-blend-multiply",
                              event.color === 'white' ? "bg-amber-50 opacity-90" : 
                              event.color === 'red' ? "bg-red-900" :
                              event.color === 'purple' ? "bg-purple-900" :
                              event.color === 'green' ? "bg-emerald-900" : "bg-gray-900"
                            )} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          </div>

                          {/* Content */}
                          <div className="relative z-10 p-6 flex flex-col h-full min-h-[220px] justify-end">
                            <div className="absolute top-6 left-6">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md border",
                                event.color === 'white' ? "bg-white/90 text-gray-900 border-white" : "bg-black/40 text-white border-white/20"
                              )}>
                                {event.type === 'solemnity' ? 'Solenidade' : 
                                 event.type === 'feast' ? 'Festa' : 
                                 event.type === 'memorial' ? 'Memória' : 
                                 event.type === 'holiday' ? 'Feriado' :
                                 event.type === 'commemorative' ? 'Data Comemorativa' : 'Santo'}
                              </span>
                            </div>
                            
                            <div className="mt-auto">
                              <h4 className="font-manrope font-black text-2xl text-white mb-2 leading-tight drop-shadow-lg">
                                {event.title}
                              </h4>
                              <p className="text-sm text-white/80 line-clamp-3 font-medium leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-[#f8f9fa]/50 rounded-[2rem] border-2 border-dashed border-black/15">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                          <BookOpen size={28} className="text-[#717783]" />
                        </div>
                        <h4 className="font-manrope font-bold text-[#1a1c1c] mb-1">Dia Ferial</h4>
                        <p className="text-sm text-[#717783] leading-relaxed">Não há festas ou memórias obrigatórias registradas para este dia.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-[2rem] bg-[#005da7] text-white shadow-xl shadow-[#005da7]/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Info size={80} />
              </div>
              <h4 className="font-manrope font-black text-lg mb-2">Dica Litúrgica</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                As cores litúrgicas ajudam a expressar o caráter dos mistérios celebrados e o sentido da vida cristã no decorrer do ano.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}