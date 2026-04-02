'use client';

import React, { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportModal } from './report-modal';
import { cn } from '@/lib/utils';

interface ReportButtonProps {
  moduleName: string;
  reportTitle: string;
  reportSubtitle?: string;
  data: any | any[];
  columns?: { key: string; label: string; render?: (val: any) => React.ReactNode }[];
  type: 'turmas' | 'biblioteca' | 'calendario' | 'mural' | 'geral' | 'catequese';
  reportType?: 'ficha-encontro' | 'ficha-catequizando' | 'relatorio-mensal' | 'grade-frequencia' | 'tabela-simples';
  variant?: 'chip' | 'button';
  iconOnly?: boolean;
}

export function ReportButton({ 
  moduleName, reportTitle, reportSubtitle, data, columns = [], type, reportType = 'tabela-simples', variant = 'chip', iconOnly = false
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === 'chip' ? (
        <button 
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f2f5] text-[#414751] hover:bg-[#e4e6e9] transition-all active:scale-95 border border-black/5 group",
            iconOnly && "p-2 rounded-xl"
          )}
        >
          <FileText size={16} className="group-hover:text-[#005da7] transition-colors" />
          {!iconOnly && <span className="text-[10px] font-black uppercase tracking-widest">Relatório</span>}
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-black/10 text-[#1a1c1c] font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#005da7] flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          <div className="text-left">
            <span className="block text-xs text-[#717783] font-medium leading-none mb-1">Visualizar</span>
            <span className="block">{reportTitle}</span>
          </div>
        </button>
      )}

      {isOpen && (
        <ReportModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={reportTitle}
          subtitle={reportSubtitle}
          data={data}
          type={type}
          reportType={reportType}
          columns={columns}
        />
      )}
    </>
  );
}
