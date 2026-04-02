'use client';

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Mail, Settings, Edit2, Check, X, Hourglass, Lock, Sparkles, Calendar, Phone, MapPin, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';

export default function CatequistaPerfil() {
  const router = useRouter();
  const params = useParams();
  const catechistId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [catechist, setCatechist] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadCatechist() {
      const { data, error } = await supabase
        .from('catechists')
        .select('*')
        .eq('id', catechistId)
        .single();
      
      if (data) {
        setCatechist({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          birthDate: data.birth_date,
          role: data.role,
          address: data.address,
          observations: data.observations,
          photo: data.photo_url || 'https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X=s96-c'
        });
      }
      setLoading(false);
    }
    if (catechistId) loadCatechist();
  }, [catechistId]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005da7]"></div>
      </div>
    );
  }

  if (!catechist) {
    return (
      <div className="min-h-screen pb-32 flex flex-col items-center justify-center bg-[#f8f9fa] gap-4">
        <p className="text-[#717783] font-bold">Catequista não encontrado.</p>
        <button onClick={() => router.back()} className="text-[#005da7] font-bold underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="Perfil do Catequista" showBackButton={true} />

      <main className="max-w-[1100px] mx-auto px-6 pt-24 pb-12">
        {/* Hero Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-16 items-start"
        >
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-[#e8e8e8] ring-4 ring-[#d4e3ff] flex items-center justify-center text-[#c1c7d3]">
              {catechist.photo ? (
                <Image 
                  src={catechist.photo}
                  alt={catechist.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Users size={64} />
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h2 className="font-manrope text-4xl font-extrabold tracking-tight text-[#005da7]">{catechist.name}</h2>
              <p className="font-plus-jakarta text-[#414751] font-medium text-lg">
                {catechist.role} {catechist.birthDate && `• ${calculateAge(catechist.birthDate)} Anos`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="bg-gradient-to-r from-[#005da7] to-[#2976c7] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 active:scale-95 duration-200">
                <Mail size={18} />
                Mandar Mensagem
              </button>
            </div>
          </div>
        </motion.section>

        {/* Bento Layout Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info Card */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 border border-[#edeeef]"
            >
              <h3 className="font-manrope text-2xl font-bold text-[#005da7] mb-6 flex items-center gap-2">
                <Users size={24} className="text-[#005da7]" />
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="E-mail" value={catechist.email || '--'} icon={Mail} />
                <InfoItem label="Contato" value={catechist.phone || '--'} icon={Phone} />
                <InfoItem label="Endereço" value={catechist.address || '--'} icon={MapPin} italic />
                <InfoItem label="Data de Nascimento" value={catechist.birthDate ? new Date(catechist.birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : '--'} icon={Calendar} />
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-[#edeeef]"
            >
              <h3 className="font-manrope text-2xl font-bold text-[#005da7] mb-6 flex items-center gap-2">
                <Sparkles size={24} className="text-[#005da7]" />
                Observações / Formação
              </h3>
              <div className="text-[#414751] whitespace-pre-wrap">
                {catechist.observations || 'Nenhuma observação cadastrada.'}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function InfoItem({ label, value, icon: Icon, italic = false }: { label: string, value: string, icon?: any, italic?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-xs uppercase tracking-widest text-[#414751] font-bold">{label}</span>
      <p className={`text-lg font-medium flex items-center gap-2 ${italic ? "italic" : ""}`}>
        {Icon && <Icon size={16} className="text-[#005da7]/50" />}
        {value}
      </p>
    </div>
  );
}
