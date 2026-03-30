'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Church, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

type ViewState = 'login' | 'register' | 'forgot-password';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const supabase = createClient();
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message, 'error');
      setIsLoading(false);
    } else {
      showToast('Login realizado com sucesso!', 'success');
      router.push('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      showToast(error.message, 'error');
      setIsLoading(false);
      return;
    }

    if (!data.session) {
      showToast('Conta criada! Verifique seu e-mail para confirmar cadastro.', 'success');
      // Limpar os campos para um novo login
      setView('login');
      setPassword('');
      setIsLoading(false);
      return;
    }

    showToast('Conta criada com sucesso! Você já pode entrar.', 'success');
    router.push('/');
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/update-password`,
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Link de recuperação enviado para o seu e-mail!', 'success');
      setView('login');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      showToast('Erro ao conectar com Google.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
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
      <div className="hidden md:flex md:w-1/2 bg-[#005da7] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-white max-w-md text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/20">
            <Church size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-manrope font-bold mb-4">Catequese IVC</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Sistema de gestão para organizar, planejar e vivenciar a catequese com amor.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-8 left-0 right-0 flex justify-center md:hidden">
          <div className="flex items-center gap-2 text-[#005da7]">
            <Church size={24} />
            <span className="font-manrope font-bold text-xl">Catequese IVC</span>
          </div>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/15"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-manrope font-bold text-[#1a1c1c] mb-2">Bem-vindo de volta</h2>
                  <p className="text-[#717783] text-sm">Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
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
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#edeeef] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-[#1a1c1c]">Senha</label>
                      <button 
                        type="button" 
                        onClick={() => setView('forgot-password')}
                        className="text-sm text-[#005da7] hover:underline font-medium"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#c1c7d3]" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-black/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#005da7] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004a87] transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>Entrar <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-black/15"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[#717783]">Ou continue com</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="mt-6 w-full bg-white border border-black/15 text-[#1a1c1c] py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#f8f9fa] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-[#717783]">
                  Não tem uma conta?{' '}
                  <button onClick={() => setView('register')} className="text-[#005da7] font-bold hover:underline">
                    Criar agora
                  </button>
                </p>
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#edeeef]"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-manrope font-bold text-[#1a1c1c] mb-2">Criar Conta</h2>
                  <p className="text-[#717783] text-sm">Junte-se à nossa comunidade</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
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
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#edeeef] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="Seu nome"
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
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#edeeef] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">Senha</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#c1c7d3]" />
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#edeeef] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#005da7] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004a87] transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Cadastrar'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#717783]">
                  Já tem uma conta?{' '}
                  <button onClick={() => setView('login')} className="text-[#005da7] font-bold hover:underline">
                    Fazer login
                  </button>
                </p>
              </motion.div>
            )}

            {view === 'forgot-password' && (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/15"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4 text-[#005da7]">
                    <KeyRound size={28} />
                  </div>
                  <h2 className="text-2xl font-manrope font-bold text-[#1a1c1c] mb-2">Recuperar Senha</h2>
                  <p className="text-[#717783] text-sm">Enviaremos uma senha temporária para o seu e-mail.</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1c1c] mb-1.5">E-mail cadastrado</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-[#c1c7d3]" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#edeeef] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005da7]/20 focus:border-[#005da7] transition-all text-[#1a1c1c]"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#005da7] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004a87] transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Enviar E-mail'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#717783]">
                  Lembrou a senha?{' '}
                  <button onClick={() => setView('login')} className="text-[#005da7] font-bold hover:underline">
                    Voltar ao login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
