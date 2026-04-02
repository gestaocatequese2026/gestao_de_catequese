'use client';

import React from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Calendar, GraduationCap, BookOpen, Users, ChevronRight, Ticket, Baby, HeartHandshake, Church } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getCurrentLiturgicalSeason } from '@/lib/liturgical-calendar';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { WelcomeModal } from '@/components/welcome-modal';

export default function Dashboard() {
  const { classes, isLoaded, userId, hasParish } = useAppStore();
  const [criticalStudents, setCriticalStudents] = React.useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = React.useState(true);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const supabase = createClient();
  
  React.useEffect(() => {
    if (isLoaded && userId && classes.length > 0) {
      async function checkAbsences() {
        try {
          const activeClassIds = classes.filter(c => c.status !== 'Inativa').map(c => c.id);
          if (activeClassIds.length === 0) {
            setLoadingAlerts(false);
            return;
          }

          // Fetch all students for these classes
          const { data: students } = await supabase
            .from('students')
            .select('id, name, class_id')
            .in('class_id', activeClassIds);

          // Fetch attendance records
          const { data: attendance } = await supabase
            .from('attendance')
            .select('student_id, status, event_id')
            .in('class_id', activeClassIds);

          if (!students || !attendance) return;

          const studentAlerts = [];

          for (const student of students) {
            const studentAttendance = attendance.filter(a => a.student_id === student.id);
            const total = studentAttendance.length;
            if (total < 3) continue; // Don't alert if there are too few registered meetings

            const absences = studentAttendance.filter(a => a.status === 'Faltante').length;
            const absenceRate = absences / total;

            if (absenceRate >= 0.25) {
              const className = classes.find(c => c.id === student.class_id)?.name || 'Turma';
              studentAlerts.push({
                ...student,
                absenceRate: Math.round(absenceRate * 100),
                absences,
                total,
                className
              });
            }
          }

          setCriticalStudents(studentAlerts.sort((a, b) => b.absenceRate - a.absenceRate));
        } catch (err) {
          console.error('Error checking absences:', err);
        } finally {
          setLoadingAlerts(false);
        }
      }
      checkAbsences();
    }

    if (isLoaded && userId) {
      // Show welcome modal if no parish or no classes
      if (!hasParish || classes.length === 0) {
        setShowWelcome(true);
      }
    }
  }, [isLoaded, userId, classes, hasParish]);

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

        {/* Absence Alerts Section */}
        <AnimatePresence>
          {criticalStudents.length > 0 && (
            <motion.section
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#ba1a1a] to-[#93000a] rounded-[32px] p-6 md:p-8 text-white shadow-xl shadow-red-500/20 relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-black/10 rounded-full blur-2xl grow-0" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20 scale-110 shadow-lg">
                      <AlertTriangle size={30} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-manrope font-black tracking-tight mb-1">Atenção à Frequência</h3>
                      <p className="text-white/80 text-sm font-medium leading-relaxed max-w-md">
                        Identificamos {criticalStudents.length} {criticalStudents.length === 1 ? 'catequizando' : 'catequizandos'} com índice de faltas superior a 25%. Isso pode comprometer a caminhada de fé.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {criticalStudents.slice(0, 3).map((student) => (
                    <Link 
                      key={student.id} 
                      href={`/turmas/${student.class_id}`}
                      className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all group/item"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{student.className}</span>
                        <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black">{student.absenceRate}% de Faltas</div>
                      </div>
                      <p className="font-bold text-lg truncate group-hover/item:translate-x-1 transition-transform">{student.name}</p>
                      <p className="text-xs text-white/60 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {student.absences} faltas em {student.total} encontros registrados
                      </p>
                    </Link>
                  ))}
                  {criticalStudents.length > 3 && (
                    <div className="flex items-center justify-center p-4">
                      <p className="text-sm font-bold text-white/60">+ {criticalStudents.length - 3} outros casos críticos</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

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

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)}
        hasParish={hasParish}
        hasClasses={classes.length > 0}
      />
    </div>
  );
}
