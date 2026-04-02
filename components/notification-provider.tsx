'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationSettings, INITIAL_NOTIFICATIONS, DEFAULT_SETTINGS } from '@/lib/notifications';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/utils/supabase/client';

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'date'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const { classes, isLoaded, userId } = useAppStore();
  const supabase = createClient();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'date'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false,
      date: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Check for upcoming events
  useEffect(() => {
    if (!settings.enabled || !isLoaded || !userId) return;

    const checkEvents = async () => {
      const now = new Date();
      const tenDaysFromNow = new Date();
      tenDaysFromNow.setDate(now.getDate() + 10);

      // Helper to check if a date is within the next 10 days (ignoring year for birthdays)
      const isWithinTenDays = (dateStr: string, isBirthday: boolean) => {
        const eventDate = new Date(dateStr);
        if (isBirthday) {
          eventDate.setFullYear(now.getFullYear());
          // If birthday already passed this year, check next year
          if (eventDate < new Date(now.setHours(0,0,0,0))) {
            eventDate.setFullYear(now.getFullYear() + 1);
          }
        }
        
        const diffTime = eventDate.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 10;
      };

      const newNotifications: Notification[] = [];

      // 1. Fetch Birthdays from Supabase
      // Catequistas
      const { data: catechists } = await supabase
        .from('catechists')
        .select('id, name, birth_date')
        .not('birth_date', 'is', null);
      
      if (catechists) {
        catechists.forEach(c => {
          if (isWithinTenDays(c.birth_date, true)) {
            const bday = new Date(c.birth_date);
            bday.setFullYear(now.getFullYear());
            if (bday < new Date(now.setHours(0,0,0,0))) bday.setFullYear(now.getFullYear() + 1);

            newNotifications.push({
              id: `bday_cat_${c.id}_${bday.getFullYear()}`,
              title: 'Aniversário Chegando!',
              message: `O catequista ${c.name} faz aniversário em breve (${bday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})!`,
              type: 'birthday',
              link: '/cadastros/catequistas',
              isRead: false,
              date: new Date().toISOString(),
              eventDate: bday.toISOString()
            });
          }
        });
      }

      // Catequizandos
      const { data: students } = await supabase
        .from('students')
        .select('id, name, birth_date, class_id')
        .not('birth_date', 'is', null);

      if (students) {
        students.forEach(s => {
          if (isWithinTenDays(s.birth_date, true)) {
            const bday = new Date(s.birth_date);
            bday.setFullYear(now.getFullYear());
            if (bday < new Date(now.setHours(0,0,0,0))) bday.setFullYear(now.getFullYear() + 1);

            newNotifications.push({
              id: `bday_stu_${s.id}_${bday.getFullYear()}`,
              title: 'Aniversário de Catequizando',
              message: `O catequizando ${s.name} faz aniversário dia ${bday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}!`,
              type: 'birthday',
              link: `/turmas/${s.class_id}/catequizando/${s.id}`,
              isRead: false,
              date: new Date().toISOString(),
              eventDate: bday.toISOString()
            });
          }
        });
      }

      // 2. Fetch Activities from Supabase
      const { data: activities } = await supabase
        .from('activities')
        .select('id, name, date, class_id')
        .gte('date', now.toISOString().split('T')[0])
        .lte('date', tenDaysFromNow.toISOString().split('T')[0]);

      if (activities) {
        activities.forEach(a => {
          newNotifications.push({
            id: `act_${a.id}`,
            title: 'Atividade Próxima',
            message: `A atividade "${a.name}" acontecerá dia ${new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')}!`,
            type: 'activity',
            link: `/turmas/${a.class_id}`,
            isRead: false,
            date: new Date().toISOString(),
            eventDate: new Date(a.date + 'T12:00:00').toISOString()
          });
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const trulyNew = newNotifications.filter(n => !existingIds.has(n.id));
          if (trulyNew.length === 0) return prev;
          return [...trulyNew, ...prev];
        });
      }
    };

    checkEvents();
    const interval = setInterval(checkEvents, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [settings, classes, isLoaded, userId]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      settings,
      unreadCount,
      markAsRead,
      markAllAsRead,
      updateSettings,
      addNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
