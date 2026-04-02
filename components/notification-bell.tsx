'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Cake, Calendar, ClipboardList, Info } from 'lucide-react';
import { useNotifications } from './notification-provider';
import { NotificationType } from '@/lib/notifications';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'birthday': return <Cake size={16} className="text-pink-500" />;
    case 'meeting': return <Calendar size={16} className="text-blue-500" />;
    case 'activity': return <ClipboardList size={16} className="text-emerald-500" />;
    default: return <Info size={16} className="text-slate-500" />;
  }
};

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasImportantUnread = notifications.some(n => {
    if (n.isRead) return false;
    if (n.type === 'birthday' || n.type === 'activity') {
      if (!n.eventDate) return true;
      const eventDate = new Date(n.eventDate);
      const now = new Date();
      const timeDiff = eventDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      // Event is in the future and within 10 days, or it's today
      return daysDiff >= -1 && daysDiff <= 10;
    }
    return false;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 active:scale-95 ${
          hasImportantUnread 
            ? 'text-[#ba1a1a] bg-red-50 hover:bg-red-100 shadow-[0_0_15px_rgba(186,26,26,0.3)]' 
            : 'text-[#005da7] hover:bg-[#eeeeee]'
        }`}
      >
        <div className={hasImportantUnread ? 'animate-wiggle' : ''}>
          <Bell size={24} className={hasImportantUnread ? 'fill-red-100' : ''} />
        </div>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl border border-black/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-black/15 flex justify-between items-center bg-white">
              <h3 className="font-bold text-[#001e40] flex items-center gap-2">
                <Bell size={18} className="text-[#005da7]" />
                Notificações
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-[#005da7] font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                >
                  <Check size={14} /> Marcar lidas
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-[#717783] flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell size={28} className="text-gray-300" />
                  </div>
                  <p className="font-medium">Nenhuma notificação</p>
                  <p className="text-xs mt-1">Você está em dia com tudo!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#edeeef]">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 transition-colors hover:bg-[#f3f4f5] ${!notification.isRead ? 'bg-[#d4e3ff]/10' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.type === 'birthday' ? 'bg-pink-100' :
                          notification.type === 'activity' ? 'bg-emerald-100' :
                          notification.type === 'meeting' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-[#001e40]' : 'text-[#43474f]'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-[#43474f] mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              <span className="text-[10px] font-medium text-[#717783] mt-2 block">
                                {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              {!notification.isRead && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1.5 hover:bg-[#d4e3ff] rounded-full text-[#005da7] transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              {notification.link && (
                                <Link 
                                  href={notification.link}
                                  onClick={() => setIsOpen(false)}
                                  className="p-1.5 hover:bg-[#d4e3ff] rounded-full text-[#005da7] transition-colors"
                                  title="Ver detalhes"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-black/15 text-center bg-gray-50">
              <Link 
                href="/perfil" 
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#43474f] font-bold hover:text-[#005da7] transition-colors flex items-center justify-center gap-2"
              >
                Configurações de notificações
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
