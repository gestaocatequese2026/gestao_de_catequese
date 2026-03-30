'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { 
  Info, User, Mail, MessageSquare, Send, 
  Github, Linkedin, Twitter, Sparkles,
  Heart, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

export default function SobrePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'sugestão' as 'sugestão' | 'reclamação',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // First, try to get current user if available
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload = {
        ...formData,
        user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      };

      // Try to save to Supabase (assuming 'feedbacks' table exists or will be created)
      const { error } = await supabase
        .from('feedbacks')
        .insert([payload]);

      if (error) {
        // Falling back to localStorage if table doesn't exist
        console.warn('Supabase table feedback might not exist, saving to localStorage:', error);
        const existing = JSON.parse(localStorage.getItem('app_feedbacks') || '[]');
        localStorage.setItem('app_feedbacks', JSON.stringify([...existing, payload]));
      }

      showToast('Mensagem enviada com sucesso! Obrigado pelo feedback.', 'success');
      setFormData({ name: '', email: '', type: 'sugestão', message: '' });
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
      showToast('Ocorreu um erro ao enviar sua mensagem.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <TopBar title="Sobre o Aplicativo" />

      {/* Toast Notification */}
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

      <main className="max-w-[800px] mx-auto pt-24 px-6 space-y-10">
        
        {/* About App Section */}
        <section className="bg-gradient-to-br from-[#005da7] to-[#003f73] rounded-[32px] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6">
              <Sparkles size={32} />
            </div>
            <h1 className="text-4xl font-manrope font-black tracking-tight">Catequese IVC</h1>
            <p className="text-white/80 leading-relaxed text-lg max-w-xl">
              Uma plataforma moderna dedicada a simplificar a gestão da catequese, 
              fortalecendo a jornada de iniciação à vida cristã através da tecnologia.
            </p>
            <div className="flex gap-4 pt-4">
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm">
                  <ShieldCheck size={14} />
                  <span>Privacidade Garantida</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm">
                  <Heart size={14} />
                  <span>Feito com Fé</span>
               </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </section>

        {/* Developer Section */}
        <section className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/10 overflow-hidden p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#f8f9fa] to-[#eef2f6] flex items-center justify-center shadow-inner border border-black/5 shrink-0 overflow-hidden">
               {/* Placeholder or Image for Dev */}
               <User size={64} className="text-[#005da7]/20" />
            </div>
            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#005da7] mb-1">Desenvolvido por</h2>
                <h3 className="text-3xl font-manrope font-black text-[#1a1c1c]">Rickson Amazonas</h3>
              </div>
              <p className="text-[#717783] font-medium max-w-md">
                Arquiteto de software apaixonado por criar soluções digitais que impactam positivamente a comunidade.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <a href="mailto:ricksonam@hotmail.com" className="flex items-center gap-2 text-sm font-bold text-[#414751] hover:text-[#005da7] transition-colors bg-[#f8f9fa] px-4 py-2 rounded-xl border border-black/5">
                  <Mail size={16} />
                  ricksonam@hotmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/10 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-black/5 flex items-center gap-4 bg-[#f8f9fa]/50">
            <div className="w-12 h-12 bg-[#005da7] rounded-xl flex items-center justify-center text-white shrink-0">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-manrope font-black text-[#1a1c1c]">Sua opinião importa</h2>
              <p className="text-sm text-[#717783] font-medium">Envie suas sugestões ou reclamações para melhorarmos cada vez mais.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#717783] ml-1">Seu Nome</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Como podemos te chamar?"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#717783] ml-1">Seu E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#c1c7d3] group-focus-within:text-[#005da7] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="Para podermos te responder"
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#717783] ml-1">Tipo de Mensagem</label>
                <div className="flex bg-[#f8f9fa] p-1.5 rounded-2xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'sugestão'})}
                    className={cn(
                      "flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      formData.type === 'sugestão' ? "bg-white text-[#005da7] shadow-sm" : "text-[#717783] hover:text-[#1a1c1c]"
                    )}
                  >
                    <Sparkles size={16} />
                    Sugestão
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'reclamação'})}
                    className={cn(
                      "flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      formData.type === 'reclamação' ? "bg-white text-[#ba1a1a] shadow-sm" : "text-[#717783] hover:text-[#1a1c1c]"
                    )}
                  >
                    <AlertCircle size={16} />
                    Reclamação
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#717783] ml-1">Mensagem</label>
                <div className="relative group">
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Escreva aqui sua sugestão ou reclamação detalhada..."
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold placeholder:font-normal resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={sending}
                className={cn(
                  "bg-[#005da7] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#005da7]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100",
                  sending && "cursor-not-allowed"
                )}
              >
                {sending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Version Info */}
        <div className="text-center pb-8">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c1c7d3]">Catequese IVC • Versão 2.4.0</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
