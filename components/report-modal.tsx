'use client';

import React, { useState, useEffect } from 'react';
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
  data: any[];
  type: 'turmas' | 'biblioteca' | 'calendario' | 'mural' | 'geral';
  columns: { key: string; label: string; render?: (val: any) => React.ReactNode }[];
}

export function ReportModal({ 
  isOpen, onClose, title, subtitle, data, type, columns 
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center sm:p-4 overflow-hidden print:p-0 print:static print:overflow-visible">
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
              <div className="border-b-2 border-black/5 pb-8 mb-8 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#005da7] flex items-center justify-center text-white print:bg-[#005da7] print:text-white">
                      <Church size={18} />
                    </div>
                    <span className="font-manrope font-black text-lg tracking-tight text-[#001e40]">Catequese IVC</span>
                  </div>
                  <h1 className="text-3xl font-manrope font-black text-[#1a1c1c] leading-tight mb-2 uppercase">{title}</h1>
                  {subtitle && <p className="text-[#717783] font-medium">{subtitle}</p>}
                </div>

                <div className="text-right">
                  {loading ? (
                    <Loader2 className="animate-spin text-[#c1c7d3] h-6 w-6 ml-auto" />
                  ) : parish ? (
                    <div className="space-y-1">
                      <p className="font-bold text-[#1a1c1c] text-sm">{parish.name}</p>
                      <p className="text-xs text-[#717783]">{parish.diocese}</p>
                      <p className="text-xs text-[#717783]">{parish.address}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#c1c7d3] italic pt-4">Dados da paróquia não configurados</p>
                  )}
                  <p className="text-[10px] font-bold text-[#b1b5bd] mt-4 uppercase tracking-tighter">Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10">
                      {columns.map(col => (
                        <th key={col.key} className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-[#717783]">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? data.map((item, idx) => (
                      <tr key={idx} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                        {columns.map(col => (
                          <td key={col.key} className="py-4 px-2 text-sm text-[#1a1c1c] font-medium leading-relaxed">
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
              </div>

              {/* Report Footer */}
              <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-center text-[10px] text-[#b1b5bd] font-bold uppercase tracking-widest">
                <span>© {new Date().getFullYear()} Catequese IVC - Software de Gestão Pastoral</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Documento Gerado pelo Coordenador</span>
              </div>
            </div>
          </div>

          {/* Footer UI - Only visible in app */}
          <div className="p-6 bg-[#f8f9fa] border-t border-black/10 flex items-center justify-center gap-3 print:hidden shrink-0">
             <Info className="text-[#717783]" size={16} />
             <p className="text-xs text-[#717783]">Dica: Salve como PDF na tela de impressão para arquivar o relatório digitalmente.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
