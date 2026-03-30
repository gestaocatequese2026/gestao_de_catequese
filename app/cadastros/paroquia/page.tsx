'use client';

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { 
  Church, User, MapPin, Phone, Mail, 
  Save, Landmark, ShieldCheck, Info,
  Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { ReportButton } from '@/components/report-button';

export default function ParoquiaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [parishId, setParishId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    priest_name: '',
    diocese: '',
    address: '',
    phone: '',
    email: ''
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadParishData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('parishes')
          .select('*')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 is code for "no rows found"
          throw error;
        }

        if (data) {
          setParishId(data.id);
          setFormData({
            name: data.name || '',
            priest_name: data.priest_name || '',
            diocese: data.diocese || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || ''
          });
        }
      } catch (err) {
        console.error('Erro ao carregar dados da paróquia:', err);
      } finally {
        setLoading(false);
      }
    }

    loadParishData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const payload = {
        ...formData,
        user_id: session.user.id
      };

      let result;
      if (parishId) {
        result = await supabase
          .from('parishes')
          .update(payload)
          .eq('id', parishId);
      } else {
        result = await supabase
          .from('parishes')
          .insert([payload])
          .select()
          .maybeSingle();
        
        if (result.data) setParishId(result.data.id);
      }

      if (result.error) throw result.error;

      showToast('Dados da paróquia salvos com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao salvar paróquia:', err);
      showToast(err.message || 'Erro ao salvar dados.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005da7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <TopBar 
        title="Cadastro da Paróquia" 
        actions={
          <ReportButton 
            moduleName="Paroquia"
            reportTitle="Ficha de Identificação Paroquial"
            reportSubtitle="Dados cadastrais para documentos e certificados"
            type="geral"
            data={formData.name ? [formData] : []}
            columns={[
              { key: 'name', label: 'Nome da Paróquia' },
              { key: 'priest_name', label: 'Pároco' },
              { key: 'diocese', label: 'Diocese' },
              { key: 'phone', label: 'Telefone' },
              { key: 'email', label: 'E-mail' }
            ]}
          />
        }
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-24 left-1/2 z-[100] px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm",
              toast.type === 'success' ? "bg-[#d1e9d2] text-[#146c2e]" : "bg-[#ffdad6] text-[#ba1a1a]"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[800px] mx-auto pt-24 px-6 space-y-8">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-[#005da7] to-[#003f73] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6">
              <Church size={32} />
            </div>
            <h2 className="text-3xl font-manrope font-bold mb-2">Informações da Comunidade</h2>
            <p className="text-white/80 leading-relaxed max-w-md">
              Mantenha os dados da sua paróquia ou comunidade atualizados para melhor organização da catequese.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </section>

        {/* Form Section */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/10 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* Pastoral Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Parish Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">Nome da Paróquia / Comunidade</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <Landmark size={20} />
                  </div>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Paróquia Santo Antônio"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Priest Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">Pároco / Responsável</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    value={formData.priest_name}
                    onChange={e => setFormData({...formData, priest_name: e.target.value})}
                    placeholder="Nome do Padre ou Coordenador"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Diocese */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">Diocese</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <input 
                    value={formData.diocese}
                    onChange={e => setFormData({...formData, diocese: e.target.value})}
                    placeholder="Ex: Diocese de São Paulo"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">E-mail de Contato</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="paroquia@email.com"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">Telefone / WhatsApp</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <Phone size={20} />
                  </div>
                  <input 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#717783] ml-1">Endereço Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <MapPin size={20} />
                  </div>
                  <input 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-[#eef5fd] rounded-2xl p-4 flex gap-3">
              <Info className="text-[#005da7] shrink-0" size={20} />
              <p className="text-sm text-[#005da7]/80 leading-relaxed italic">
                Essas informações poderão ser utilizadas futuramente para a geração de certificados e relatórios oficiais da paróquia.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className={cn(
                  "bg-[#005da7] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#005da7]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100",
                  saving && "cursor-not-allowed"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Salvar Dados
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
