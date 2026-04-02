'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Church, GraduationCap, Users, ArrowRight, 
  CheckCircle2, Sparkles, X, LayoutDashboard 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasParish: boolean;
  hasClasses: boolean;
}

export function WelcomeModal({ isOpen, onClose, hasParish, hasClasses }: WelcomeModalProps) {
  const steps = [
    {
      id: 'parish',
      title: 'Cadastrar Paróquia',
      description: 'Configure os dados da sua comunidade e paróquia.',
      icon: Church,
      href: '/cadastros/paroquia',
      completed: hasParish,
      color: 'bg-blue-500'
    },
    {
      id: 'catechists',
      title: 'Cadastrar Catequistas',
      description: 'Adicione os catequistas que fazem parte da equipe.',
      icon: GraduationCap,
      href: '/cadastros/catequistas',
      completed: false, // We don't track this globally yet, but we can lead them there
      color: 'bg-purple-500'
    },
    {
      id: 'classes',
      title: 'Criar Turmas',
      description: 'Organize seus catequizandos em turmas.',
      icon: Users,
      href: '/turmas',
      completed: hasClasses,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Side: Branding/Visual */}
            <div className="md:w-2/5 bg-gradient-to-br from-[#005da7] to-[#003d6d] p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-[-5%] left-[-5%] w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-manrope font-black leading-tight tracking-tight mb-4">
                  Bem-vindo à sua Catequese Digital
                </h2>
                <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
                  Estamos felizes em ter você aqui! Vamos configurar o sistema para sua paróquia?
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/60">
                  <LayoutDashboard size={14} />
                  <span>Configuração Inicial</span>
                </div>
              </div>
            </div>

            {/* Right Side: content */}
            <div className="md:w-3/5 p-8 sm:p-10 bg-white relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-manrope font-bold text-gray-900 mb-2">Primeiros Passos</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Siga este roteiro para começar a usar todas as ferramentas do sistema.
                  </p>
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <Link 
                      key={step.id}
                      href={step.href}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                        step.completed 
                          ? "bg-gray-50 border-gray-100 opacity-80" 
                          : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                      )}>
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                          step.completed 
                            ? "bg-white border-green-100 text-green-500" 
                            : cn("text-white", step.color, "border-transparent")
                        )}>
                          {step.completed ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-tighter">Passo 0{index + 1}</span>
                            {step.completed && (
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Concluído</span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{step.description}</p>
                        </div>

                        {!step.completed && (
                          <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  Continuar para o Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
