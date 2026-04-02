'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { 
  PlusCircle, Plus, Users, Calendar, BookOpen, Baby, 
  HeartHandshake, Ticket, Edit2, Trash2, X, Save,
  Power, GraduationCap, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn, getClassColor } from '@/lib/utils';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { useAppStore, ClassItem } from '@/lib/store';
import { ReportButton } from '@/components/report-button';

export default function Turmas() {
  const { classes, addClass, updateClass, deleteClass, isLoaded, getStudentsCount } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenModal = (cls: ClassItem | null = null) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (id: string) => {
    setClassToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete);
      setClassToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await updateClass(id, { status: currentStatus === 'Inativa' ? 'Ativa' : 'Inativa' });
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const day = formData.get('day') as string;
    const time = formData.get('time') as string;
    const level = formData.get('level') as string;
    const location = formData.get('location') as string;
    
    let icon = 'BookOpen';
    if (name.includes('Crisma')) icon = 'Ticket';
    if (name.includes('Pré')) icon = 'Baby';
    if (name.includes('Perseverança')) icon = 'HeartHandshake';

    if (editingClass) {
      await updateClass(editingClass.id, {
        name,
        description,
        level,
        location,
        schedule: `${day}, ${time}`,
        icon
      });
    } else {
      await addClass({
        name,
        description,
        level,
        location,
        schedule: `${day}, ${time}`,
        status: 'Ativa',
        icon
      });
    }
    handleCloseModal();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={24} />;
      case 'Ticket': return <Ticket size={24} />;
      case 'Baby': return <Baby size={24} />;
      case 'HeartHandshake': return <HeartHandshake size={24} />;
      default: return <GraduationCap size={24} />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pb-32">
      <TopBar 
        title="Turmas de Catequese" 
        actions={
          <ReportButton 
            moduleName="Turmas"
            reportTitle="Relatório Geral de Turmas"
            reportSubtitle="Levantamento de turmas ativas e horários"
            type="turmas"
            data={classes}
            columns={[
              { key: 'name', label: 'Turma' },
              { key: 'level', label: 'Etapa/Nível' },
              { key: 'schedule', label: 'Horário' },
              { key: 'location', label: 'Local' },
              { key: 'status', label: 'Status' }
            ]}
          />
        }
      />

      <main className="max-w-7xl mx-auto px-6 pt-24">
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#1a73e8] font-bold uppercase tracking-widest text-xs mb-2 block">Administração</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#001e40] tracking-tight font-sans leading-tight">Turmas de Catequese</h2>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#007AFF] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0056b3] transition-colors shadow-sm w-full md:w-auto"
          >
            <Plus size={16} />
            Nova Turma
          </button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, idx) => {
            return (
            <motion.div 
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-5 rounded-3xl flex flex-col justify-between border-2 min-h-[200px] relative overflow-hidden group transition-all",
                getClassColor(cls.name),
                cls.status === 'Inativa' && "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter bg-white/50 text-[#1a1c1c]"
                  )}>
                    {cls.status}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(cls)}
                      className="p-2 hover:bg-white/50 rounded-full text-[#001e40]/40 hover:text-[#1a73e8] transition-all"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(cls.id, cls.status)}
                      className={cn(
                        "p-2 hover:bg-white/50 rounded-full transition-all",
                        cls.status === 'Inativa' ? "text-green-600" : "text-orange-600"
                      )}
                      title={cls.status === 'Inativa' ? "Ativar" : "Inativar"}
                    >
                      <Power size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cls.id)}
                      className="p-2 hover:bg-white/50 rounded-full text-[#001e40]/40 hover:text-red-600 transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#001e40] mb-1 font-manrope flex items-center gap-2">
                  <span className="text-[#1a73e8]">{getIcon(cls.icon)}</span>
                  {cls.name} {cls.level && <span className="text-sm font-normal text-[#717783] ml-2">({cls.level})</span>}
                </h3>
                {cls.description && (
                  <p className="text-sm text-[#717783] mb-4 line-clamp-2">{cls.description}</p>
                )}
                <div className="space-y-2 text-[#43474f] mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="text-sm font-medium">{getStudentsCount(cls.id)} Catequizandos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{cls.schedule}</span>
                  </div>
                  {cls.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">{cls.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <Link href={`/turmas/${cls.id}`} className="w-full py-3 bg-[#e1e3e4] text-[#191c1d] font-bold rounded-xl hover:bg-[#1a73e8] hover:text-white transition-all text-center block">
                  Abrir Turma
                </Link>
              </div>
            </motion.div>
          )})}

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => handleOpenModal()}
            className="border-2 border-dashed border-[#c3c6d1] rounded-3xl p-5 flex flex-col items-center justify-center min-h-[200px] text-[#43474f] opacity-60 hover:opacity-100 hover:bg-[#f3f4f5] transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-[#edeeef] flex items-center justify-center mb-4">
              <PlusCircle size={32} />
            </div>
            <p className="font-bold text-lg">Criar Nova Turma</p>
            <p className="text-sm text-center mt-2 px-8">Defina horários, catequistas e materiais para o próximo ciclo.</p>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-black/15 flex justify-between items-center bg-white shrink-0">
                <h2 className="text-xl font-black text-[#001e40] font-manrope">
                  {editingClass ? 'Editar Turma' : 'Nova Turma'}
                </h2>
                <button type="button" onClick={handleCloseModal} className="p-2 hover:bg-[#eeeeee] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form id="class-form" onSubmit={handleSaveClass} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Nome da Turma</label>
                    <select 
                      name="name"
                      required
                      defaultValue={editingClass?.name || "Eucaristia"}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all"
                    >
                      <option value="Pré-Catequese">Pré-Catequese</option>
                      <option value="Eucaristia">Eucaristia</option>
                      <option value="Perseverança">Perseverança</option>
                      <option value="Pré-Crisma">Pré-Crisma</option>
                      <option value="Crisma">Crisma</option>
                      <option value="Adultos">Adultos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Etapa / Nível</label>
                    <select 
                      name="level" 
                      required
                      defaultValue={editingClass?.level || "1° Ano"}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all"
                    >
                      <option value="1° Ano">1° Ano</option>
                      <option value="2° Ano">2° Ano</option>
                      <option value="3° Ano">3° Ano</option>
                      <option value="Ciclo 1">Ciclo 1</option>
                      <option value="Ciclo 2">Ciclo 2</option>
                      <option value="Ciclo 3">Ciclo 3</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Descrição da Turma</label>
                  <input 
                    name="description"
                    defaultValue={editingClass?.description}
                    className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all" 
                    placeholder="Ex: Turma de sábado de manhã" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Dia da Semana</label>
                    <select 
                      name="day"
                      required
                      defaultValue={editingClass?.schedule?.split(',')[0] || "Sábados"}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all"
                    >
                      <option value="Segundas">Segunda-feira</option>
                      <option value="Terças">Terça-feira</option>
                      <option value="Quartas">Quarta-feira</option>
                      <option value="Quintas">Quinta-feira</option>
                      <option value="Sextas">Sexta-feira</option>
                      <option value="Sábados">Sábado</option>
                      <option value="Domingos">Domingo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Horário</label>
                    <input 
                      name="time"
                      type="time"
                      required
                      defaultValue={editingClass?.schedule?.split(',')[1]?.trim() || "09:00"}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Local</label>
                  <input 
                    name="location"
                    required
                    defaultValue={editingClass?.location}
                    className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#1a73e8] transition-all" 
                    placeholder="Ex: Sala 3, Salão Paroquial" 
                  />
                </div>

                <div className="pt-6 mt-6 border-t border-black/15 flex justify-end gap-4">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                  <button type="submit" className="px-8 py-3 bg-[#1a73e8] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
                    <Save size={20} />
                    {editingClass ? 'Salvar Alterações' : 'Criar Turma'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Turma"
        message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
        confirmText="Excluir Turma"
        type="danger"
      />

      <BottomNav />
    </div>
  );
}
