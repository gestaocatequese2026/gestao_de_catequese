'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { User, Mail, Lock, LogOut, Save, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function PerfilPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const currentUserStr = localStorage.getItem('app_currentUser');
      return currentUserStr ? JSON.parse(currentUserStr) : null;
    }
    return null;
  });
  const [name, setName] = useState(() => user?.name || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [dataNascimento, setDataNascimento] = useState(() => user?.dataNascimento || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('app_currentUser')) {
      router.push('/login');
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const usersStr = localStorage.getItem('app_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userIndex = users.findIndex((u: any) => u.id === user.id);

      if (userIndex !== -1) {
        // Verify current password if trying to change password
        if (newPassword) {
          if (users[userIndex].password !== currentPassword) {
            showToast('Senha atual incorreta.', 'error');
            setIsSaving(false);
            return;
          }
          if (newPassword.length < 6) {
            showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
            setIsSaving(false);
            return;
          }
          users[userIndex].password = newPassword;
        }

        // Update other fields
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].dataNascimento = dataNascimento;

        localStorage.setItem('app_users', JSON.stringify(users));
        
        // Update current user
        const updatedCurrentUser = { ...user, name, email, dataNascimento };
        if (newPassword) updatedCurrentUser.password = newPassword;
        
        localStorage.setItem('app_currentUser', JSON.stringify(updatedCurrentUser));
        setUser(updatedCurrentUser);
        
        setCurrentPassword('');
        setNewPassword('');
        showToast('Perfil atualizado com sucesso!', 'success');
      }
      
      setIsSaving(false);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('app_currentUser');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 md:pb-0 md:pl-64 flex flex-col">
      <TopBar title="Meu Perfil" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg text-sm font-bold text-white",
              toast.type === 'success' ? "bg-emerald-500" : "bg-red-500"
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-[32px] shadow-sm border border-black/15 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#005da7]/10 text-[#005da7] rounded-full flex items-center justify-center text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1a1c1c]">{name}</h2>
                <p className="text-[#717783]">{email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair da Conta</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-[#c1c7d3]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[#c1c7d3]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">Data de Nascimento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-[#c1c7d3]" />
                  </div>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/15">
              <h3 className="text-lg font-bold text-[#1a1c1c] mb-4">Alterar Senha</h3>
              <p className="text-sm text-[#717783] mb-6">Deixe em branco se não quiser alterar sua senha atual.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">Senha Atual</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[#c1c7d3]" />
                    </div>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[#c1c7d3]" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#005da7] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#004a87] transition-colors disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
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
