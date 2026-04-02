'use client';

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Mail, Settings, Edit2, Check, X, Hourglass, Lock, Sparkles, Calendar, Phone, MapPin, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ConfirmationModal } from '@/components/confirmation-modal';

import { createClient } from '@/utils/supabase/client';

export default function CatequizandoPerfil() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const catequizandoId = params.catequizandoId as string;
  const supabase = createClient();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [catequizando, setCatequizando] = useState<any>(null);



  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '--';
    const today = new Date();
    const birth = new Date(birthDate + 'T12:00:00');
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!catequizandoId) return;
      
      // Load student
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', catequizandoId)
        .single();
      
      if (studentData) {
        // Load attendance history
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*, meetings(*)')
          .eq('student_id', catequizandoId)
          .eq('event_type', 'encontro')
          .order('created_at', { ascending: false });

        const history = (attendanceData || []).map(a => ({
          date: a.meetings?.date ? new Date(a.meetings.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '---',
          status: a.status === 'Presente' ? 'present' : 'absent'
        })).slice(0, 5);

        const totalEncontros = attendanceData?.length || 0;
        const presentes = attendanceData?.filter(a => a.status === 'Presente').length || 0;
        const freq = totalEncontros > 0 ? Math.round((presentes / totalEncontros) * 100) : 0;

        setCatequizando({
          ...studentData,
          age: calculateAge(studentData.birth_date),
          photo: studentData.photo_url,
          parents: studentData.parents_name,
          birthDate: studentData.birth_date,
          attendance: freq
        });
        setAttendance(history);
      }
      setLoading(false);
    }
    
    loadData();
  }, [catequizandoId]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', catequizandoId);
      
    if (!error) {
      router.push(`/turmas/${classId}`);
    } else {
      console.error('Error deleting catequizando:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <p className="text-[#717783]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="Perfil do Catequizando" showBackButton={true} />

      <main className="max-w-[1100px] mx-auto px-6 pt-24 pb-12">
        {/* Hero Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-16 items-start"
        >
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-[#e8e8e8] ring-4 ring-[#d4e3ff] flex items-center justify-center text-[#c1c7d3]">
              {catequizando.photo ? (
                <Image 
                  src={catequizando.photo}
                  alt={catequizando.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Users size={64} />
              )}
            </div>
            <div className="absolute bottom-2 right-2 bg-[#005da7] text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform">
              <Edit2 size={16} />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h2 className="font-manrope text-4xl font-extrabold tracking-tight text-[#005da7]">{catequizando.name}</h2>
              <p className="font-plus-jakarta text-[#414751] font-medium text-lg">{catequizando.age} Anos</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="bg-gradient-to-r from-[#005da7] to-[#2976c7] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 active:scale-95 duration-200">
                <Mail size={18} />
                Mandar Mensagem
              </button>
              <button className="border border-[#c1c7d3]/20 text-[#005da7] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#eeeeee] transition-colors active:scale-95 duration-200">
                <Settings size={18} />
                Editar Perfil
              </button>
              <button 
                onClick={handleDelete}
                className="border border-[#ffdad6] text-[#ba1a1a] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#ffdad6]/30 transition-colors active:scale-95 duration-200"
              >
                <Trash2 size={18} />
                Excluir Cadastro
              </button>
            </div>
          </div>
        </motion.section>

        {/* Bento Layout Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Info Card */}
          <div className="md:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-[#edeeef]"
            >
              <h3 className="font-manrope text-2xl font-bold text-[#005da7] mb-6 flex items-center gap-2">
                <Users size={24} className="text-[#005da7]" />
                Informações Familiares
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Pais" value={catequizando.parents || '--'} />
                <InfoItem label="Contato" value={catequizando.phone || '--'} icon={Phone} />
                <InfoItem label="Endereço" value={catequizando.address || '--'} icon={MapPin} italic />
                <InfoItem label="Data de Nascimento" value={catequizando.birthDate || '--'} icon={Calendar} />
              </div>
            </motion.div>

            {/* Presence Calendar Simplified */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#f3f3f3] rounded-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-manrope text-2xl font-bold text-[#005da7] flex items-center gap-2">
                  <Calendar size={24} />
                  Presença Recente
                </h3>
                <span className="text-sm font-bold text-[#735c00] bg-[#ffe088] px-3 py-1 rounded-full">{catequizando.attendance}% Frequência</span>
              </div>
              <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                {attendance.length > 0 ? (
                  attendance.map((item, i) => (
                    <PresenceItem key={i} date={item.date} status={item.status} />
                  ))
                ) : (
                  <p className="text-sm text-[#717783] py-4 italic">Nenhum registro de presença encontrado.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Jornada de Fé Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#d4e3ff] rounded-xl p-8 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={96} />
            </div>
            <h3 className="font-manrope text-2xl font-bold text-[#005da7] mb-8 relative z-10">Jornada de Fé</h3>
            <div className="space-y-10 relative z-10 flex-1">
              {/* Sacrament Item */}
              <div className="relative flex gap-4">
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#735c00] opacity-30"></div>
                <div className="w-8 h-8 rounded-full bg-[#735c00] text-white flex items-center justify-center shrink-0">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <p className="font-bold text-[#001c39] leading-none">Batismo</p>
                  <p className="text-sm text-[#004883] mt-1">Realizado</p>
                </div>
              </div>
              {/* Sacrament Item */}
              <div className="relative flex gap-4">
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#c1c7d3] opacity-30"></div>
                <div className="w-8 h-8 rounded-full bg-white text-[#735c00] flex items-center justify-center shrink-0 border-2 border-[#735c00] border-dashed">
                  <Hourglass size={14} />
                </div>
                <div>
                  <p className="font-bold text-[#001c39] opacity-60 leading-none">Primeira Eucaristia</p>
                  <p className="text-sm text-[#735c00] font-bold mt-1 uppercase tracking-tighter">Pendente</p>
                </div>
              </div>
              {/* Sacrament Item */}
              <div className="relative flex gap-4 opacity-40">
                <div className="w-8 h-8 rounded-full bg-[#e8e8e8] text-[#414751] flex items-center justify-center shrink-0">
                  <Lock size={14} />
                </div>
                <div>
                  <p className="font-bold text-[#001c39] leading-none">Crisma</p>
                  <p className="text-sm text-[#004883] mt-1">Etapa futura</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#005da7]/10">
              <p className="text-xs text-[#005da7] font-bold italic">&quot;Eu sou o caminho, a verdade e a vida.&quot;</p>
            </div>
          </motion.div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Cadastro"
        message="Tem certeza que deseja excluir este cadastro permanentemente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />

      <BottomNav />
    </div>
  );
}

function InfoItem({ label, value, icon: Icon, italic = false }: { label: string, value: string, icon?: any, italic?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-xs uppercase tracking-widest text-[#414751] font-bold">{label}</span>
      <p className={cn("text-lg font-medium flex items-center gap-2", italic && "italic")}>
        {Icon && <Icon size={16} className="text-[#005da7]/50" />}
        {value}
      </p>
    </div>
  );
}

function PresenceItem({ date, status }: { date: string, status: 'present' | 'absent' }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[60px]">
      <span className="text-[10px] font-bold text-[#414751] uppercase">{date}</span>
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
        status === 'present' ? "bg-[#005da7] text-white" : "bg-[#ffdad6] text-[#93000a]"
      )}>
        {status === 'present' ? <Check size={20} /> : <X size={20} />}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
