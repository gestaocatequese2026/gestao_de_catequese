'use client';

import React from 'react';
import { X, Bell, Mail, Smartphone, Clock, Save } from 'lucide-react';
import { useNotifications } from './notification-provider';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({ isOpen, onClose }: NotificationSettingsModalProps) {
  const { settings, updateSettings } = useNotifications();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleLeadTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ leadTimeHours: parseInt(e.target.value) });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-black/15 flex justify-between items-center bg-[#f9f9f9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005da7]/10 text-[#005da7] flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <h2 className="text-xl font-black text-[#001e40] font-manrope">Configurações de Notificações</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[#eeeeee] rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Main Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f3f4f5] rounded-2xl">
                <div className="flex items-center gap-4">
                  <Bell className={settings.enabled ? "text-[#005da7]" : "text-[#717783]"} />
                  <div>
                    <h4 className="font-bold text-[#001e40]">Ativar Notificações</h4>
                    <p className="text-xs text-[#43474f]">Receba alertas sobre encontros e atividades</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle('enabled')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enabled ? 'bg-[#005da7]' : 'bg-[#c1c7d3]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {settings.enabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Lead Time */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#43474f]">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Antecedência dos Alertas</span>
                    </div>
                    <select 
                      value={settings.leadTimeHours}
                      onChange={handleLeadTimeChange}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all font-bold text-[#001e40]"
                    >
                      <option value={1}>1 hora antes</option>
                      <option value={2}>2 horas antes</option>
                      <option value={6}>6 horas antes</option>
                      <option value={12}>12 horas antes</option>
                      <option value={24}>24 horas antes (Padrão)</option>
                      <option value={48}>2 dias antes</option>
                    </select>
                    <p className="text-[10px] text-[#717783]">Defina quanto tempo antes do encontro você deseja ser notificado.</p>
                  </div>

                  {/* Channels */}
                  <div className="space-y-4 pt-4 border-t border-black/15">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#717783]">Canais de Notificação</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-[#43474f]" />
                        <span className="font-bold text-[#001e40]">E-mail</span>
                      </div>
                      <button 
                        onClick={() => handleToggle('notifyByEmail')}
                        className={`w-10 h-5 rounded-full transition-colors relative ${settings.notifyByEmail ? 'bg-[#005da7]' : 'bg-[#c1c7d3]'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.notifyByEmail ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-[#43474f]" />
                        <span className="font-bold text-[#001e40]">Push (Celular)</span>
                      </div>
                      <button 
                        onClick={() => handleToggle('notifyByPush')}
                        className={`w-10 h-5 rounded-full transition-colors relative ${settings.notifyByPush ? 'bg-[#005da7]' : 'bg-[#c1c7d3]'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.notifyByPush ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 border-t border-black/15 bg-[#f9f9f9] flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 active:scale-95"
              >
                <Save size={20} />
                Salvar Preferências
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
