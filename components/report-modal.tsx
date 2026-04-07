'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Printer, Share2, Download, 
  FileText, Calendar, Church, Users, 
  CheckCircle2, Loader2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: any | any[];
  type: 'turmas' | 'biblioteca' | 'calendario' | 'mural' | 'geral' | 'catequese';
  reportType?: 'ficha-encontro' | 'ficha-catequizando' | 'relatorio-mensal' | 'grade-frequencia' | 'tabela-simples';
  columns?: { key: string; label: string; render?: (val: any) => React.ReactNode }[];
}

export function ReportModal({ 
  isOpen, onClose, title, subtitle, data, type, reportType = 'tabela-simples', columns = [] 
}: ReportModalProps) {
  const [parish, setParish] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      async function loadParish() {
        try {
          const { data: parishData } = await supabase
            .from('parishes')
            .select('*')
            .maybeSingle();
          setParish(parishData);
        } catch (err) {
          console.error('Error loading parish for report:', err);
        } finally {
          setLoading(false);
        }
      }
      loadParish();
    }
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `Relatório: ${title}\n${subtitle || ''}\nGerado em: ${new Date().toLocaleDateString('pt-BR')}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório Catequese IVC - ${title}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Resumo do relatório copiado para a área de transferência!');
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center sm:p-4 overflow-hidden print:p-0 print:static print:overflow-visible">
        {/* Backdrop - Hidden during print */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md print:hidden"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white sm:rounded-[40px] shadow-2xl flex flex-col h-full sm:max-h-[85vh] overflow-hidden print:shadow-none print:rounded-none print:max-h-none print:h-auto print:static"
        >
          
          {/* Controls Bar - Hidden during print */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#005da7] rounded-xl flex items-center justify-center text-white">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-[#1a1c1c] leading-tight">Visualizar Relatório</h3>
                <p className="text-[10px] font-bold text-[#005da7] uppercase tracking-wider">{type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#f0f2f5] text-[#414751] hover:bg-[#e4e6e9] transition-all active:scale-95"
                title="Compartilhar"
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-[#005da7] text-white hover:bg-[#004a87] transition-all active:scale-95 flex items-center gap-2 px-5"
              >
                <Printer size={20} />
                <span className="font-bold text-sm hidden sm:inline">Imprimir / PDF</span>
              </button>
              <div className="w-[1px] h-6 bg-black/10 mx-2" />
              <button 
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-black/5 text-[#717783] transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Report Content - This is what gets printed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-10 no-scrollbar print:overflow-visible print:p-0">
            <div id="report-printable" className="bg-white mx-auto max-w-[800px] min-h-[500px] flex flex-col">
              
              {/* Report Header */}
              <div className="border-b-4 border-[#005da7] pb-8 mb-8 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#005da7] flex items-center justify-center text-white print:bg-[#005da7] print:text-white print:[print-color-adjust:exact]">
                      <Church size={20} />
                    </div>
                    <span className="font-manrope font-black text-xl tracking-tight text-[#001e40]">Catequese IVC</span>
                  </div>
                  <h1 className="text-4xl font-manrope font-black text-[#1a1c1c] leading-tight mb-2 uppercase">{title}</h1>
                  {subtitle && <p className="text-[#414751] font-bold text-lg">{subtitle}</p>}
                </div>

                <div className="text-right flex flex-col justify-between h-full min-h-[120px]">
                  {loading ? (
                    <Loader2 className="animate-spin text-[#c1c7d3] h-6 w-6 ml-auto" />
                  ) : parish ? (
                    <div className="space-y-1">
                      <p className="font-black text-[#1a1c1c] text-base">{parish.name}</p>
                      <p className="text-xs font-bold text-[#717783]">{parish.diocese}</p>
                      <p className="text-xs text-[#717783]">{parish.address}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#c1c7d3] italic pt-4">Dados da paróquia não configurados</p>
                  )}
                  <div className="mt-auto">
                    <p className="text-[10px] font-black text-[#005da7] uppercase tracking-wider">Documento Oficial</p>
                    <p className="text-[10px] font-bold text-[#b1b5bd] uppercase tracking-tighter">Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* Conditional Rendering based on Report Type */}
              <div className="flex-1">
                {reportType === 'tabela-simples' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/10">
                        {columns.map(col => (
                          <th key={col.key} className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) && data.length > 0 ? data.map((item, idx) => (
                        <tr key={idx} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                          {columns.map(col => (
                            <td key={col.key} className="py-3 px-2 text-sm text-[#1a1c1c] font-medium">
                              {col.render ? col.render(item[col.key]) : item[col.key] || '-'}
                            </td>
                          ))}
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={columns.length} className="py-20 text-center text-[#717783] italic text-sm">
                            Nenhum registro encontrado para este relatório.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {reportType === 'ficha-encontro' && data && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8 bg-[#f8f9fa] p-6 rounded-2xl border border-black/5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Tema / Título</p>
                        <p className="font-bold text-[#1a1c1c]">{data.tema || data.title}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Data do Encontro</p>
                        <p className="font-bold text-[#1a1c1c]">{new Date(data.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Leitura Bíblica</p>
                        <p className="font-bold text-[#1a1c1c]">{data.leituraBiblica || 'Não informada'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-manrope font-black text-lg text-[#005da7] uppercase tracking-tight mb-4 border-b-2 border-[#005da7]/10 pb-2">Roteiro do Encontro</h3>
                      <div className="space-y-4">
                        {data.roteiro?.map((step: any, idx: number) => (
                          <div key={idx} className="p-4 bg-white border border-black/5 rounded-xl flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#f0f2f5] flex items-center justify-center font-black text-[#005da7] text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-[#1a1c1c]">{step.label}</p>
                                <span className="text-[10px] font-black text-[#717783] uppercase">{step.tempo}</span>
                              </div>
                              <p className="text-xs text-[#414751] leading-relaxed mb-2">{step.descricao}</p>
                              <p className="text-[10px] font-bold text-[#005da7] uppercase tracking-wider">Responsável: {step.responsavel}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {data.attendance && (
                      <div>
                        <h3 className="font-manrope font-black text-lg text-[#005da7] uppercase tracking-tight mb-4 border-b-2 border-[#005da7]/10 pb-2">Registro de Presença</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                          {data.attendance.map((att: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-black/5 text-xs">
                              <span className="font-medium text-[#1a1c1c]">{att.studentName}</span>
                              <span className={cn(
                                "font-black uppercase tracking-tighter text-[9px] px-2 py-0.5 rounded",
                                att.status === 'Presente' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              )}>
                                {att.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {reportType === 'ficha-catequizando' && data && (
                  <div className="space-y-8">
                    <div className="flex gap-8 items-start">
                      <div className="w-32 h-32 rounded-3xl bg-[#f0f2f5] border-2 border-black/5 overflow-hidden shrink-0">
                        {data.avatar && <img src={data.avatar} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Nome Completo</p>
                          <p className="text-xl font-black text-[#1a1c1c]">{data.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Data de Nascimento</p>
                          <p className="font-bold text-[#1a1c1c]">{new Date(data.birthDate + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Telefone / Contato</p>
                          <p className="font-bold text-[#1a1c1c]">{data.phone || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Responsáveis</p>
                          <p className="font-bold text-[#1a1c1c]">{data.parents || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-manrope font-black text-lg text-[#005da7] uppercase tracking-tight mb-4 border-b-2 border-[#005da7]/10 pb-2">Histórico Detalhado de Presença</h3>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/10">
                            <th className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">Evento / Encontro</th>
                            <th className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">Data</th>
                            <th className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">Status</th>
                            <th className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">Justificativa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.attendanceHistory?.map((entry: any, idx: number) => (
                            <tr key={idx} className="border-b border-black/5">
                              <td className="py-3 px-2 text-xs font-bold text-[#1a1c1c]">{entry.eventName}</td>
                              <td className="py-3 px-2 text-xs font-medium text-[#414751]">{new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                              <td className="py-3 px-2 text-xs">
                                <span className={cn(
                                  "font-black uppercase tracking-tighter text-[9px] px-2 py-0.5 rounded",
                                  entry.status === 'Presente' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                  {entry.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs italic text-[#717783]">{entry.justification || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {reportType === 'relatorio-mensal' && data && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-black/5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Total de Encontros</p>
                        <p className="text-2xl font-black text-[#005da7]">{data.stats?.totalEvents}</p>
                      </div>
                      <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-black/5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Média de Presença</p>
                        <p className="text-2xl font-black text-[#34C759]">{data.stats?.averageAttendance}%</p>
                      </div>
                      <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-black/5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#717783] mb-1">Faltas Justificadas</p>
                        <p className="text-2xl font-black text-[#FF9500]">{data.stats?.justifiedAbsences}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-manrope font-black text-lg text-[#005da7] uppercase tracking-tight mb-4 border-b-2 border-[#005da7]/10 pb-2">Temas Abordados no Período</h3>
                      <div className="space-y-4">
                        {data.events?.map((event: any, idx: number) => (
                          <div key={idx} className="p-4 bg-white border border-black/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-[#717783] uppercase">{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                              <span className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider">{event.presenceCount} Presentes</span>
                            </div>
                            <h4 className="font-bold text-[#1a1c1c] mb-1">{event.title}</h4>
                            <p className="text-xs text-[#414751] line-clamp-2 italic">{event.summary || 'Encontro realizado conforme roteiro.'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {reportType === 'grade-frequencia' && data && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-2 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783] sticky left-0 bg-white z-10 w-48 border-b border-black/10">Catequizando</th>
                          {data.dates?.map((d: any) => (
                            <th key={d} className="py-2 px-2 text-[9px] font-black uppercase tracking-widest text-[#717783] text-center border-b border-black/10 min-w-[50px]">
                              {new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.students?.map((student: any) => (
                          <tr key={student.id} className="border-b border-black/5">
                            <td className="py-2 px-2 text-[11px] font-bold text-[#1a1c1c] sticky left-0 bg-white z-10 border-r border-black/5">{student.name}</td>
                            {data.dates?.map((d: any) => {
                              const att = student.attendance?.[d];
                              return (
                                <td key={d} className="py-2 px-2 text-center border-r border-black/5">
                                  {att === 'Presente' ? (
                                    <CheckCircle2 size={12} className="text-[#34C759] mx-auto" />
                                  ) : att === 'Faltante' ? (
                                    <X size={12} className="text-[#ba1a1a] mx-auto" />
                                  ) : (
                                    <span className="text-[10px] text-[#c1c7d3] mx-auto">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Report Footer */}
              <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-center text-[10px] text-[#b1b5bd] font-bold uppercase tracking-widest">
                <span>© {new Date().getFullYear()} Catequese IVC - Software de Gestão Pastoral</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Documento Gerado pelo Coordenador</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#f8f9fa] border-t border-black/10 flex items-center justify-center gap-3 print:hidden shrink-0">
             <Info className="text-[#717783]" size={16} />
             <p className="text-xs text-[#717783]">Dica: Salve como PDF na tela de impressão para arquivar o relatório digitalmente.</p>
          </div>
          
          <style jsx global>{`
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
                background-color: white !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              #report-printable {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            }
          `}</style>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
