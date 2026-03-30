'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                type === 'danger' ? 'bg-red-100 text-red-600' : 
                type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                <AlertTriangle size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#001e40] font-manrope">{title}</h3>
                <p className="text-[#43474f] text-sm leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="p-6 bg-[#f9f9f9] border-t border-black/15 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all ${
                  type === 'danger' ? 'bg-red-600' : 
                  type === 'warning' ? 'bg-amber-600' : 
                  'bg-[#005da7]'
                }`}
              >
                {confirmText}
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#717783] hover:bg-[#eeeeee] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
