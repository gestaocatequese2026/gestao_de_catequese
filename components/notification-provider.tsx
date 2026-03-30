'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationSettings, INITIAL_NOTIFICATIONS, DEFAULT_SETTINGS } from '@/lib/notifications';
import { useAppStore } from '@/lib/store';

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
  const { classes, isLoaded } = useAppStore();

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
    if (!settings.enabled || !isLoaded) return;

    const checkEvents = () => {
      const now = new Date();

      setNotifications(prev => {
        const newNotifications: Notification[] = [];

        // 1. Check Birthdays
        const allBirthdays: { id: string, name: string, date: string, type: 'catequizando' | 'catequista' }[] = [];
        
        // Add Catequistas
        const usersStr = typeof window !== 'undefined' ? localStorage.getItem('app_users') : null;
        if (usersStr) {
          try {
            const users = JSON.parse(usersStr);
            users.forEach((u: any) => {
              if (u.dataNascimento) {
                allBirthdays.push({ id: `user_${u.id}`, name: u.name, date: u.dataNascimento, type: 'catequista' });
              }
            });
          } catch (e) {}
        }

        // Add Catequizandos
        classes.forEach(cls => {
          const studentsStr = typeof window !== 'undefined' ? localStorage.getItem(`studentsList_${cls.id}`) : null;
          if (studentsStr) {
            try {
              const students = JSON.parse(studentsStr);
              students.forEach((s: any) => {
                if (s.birthDate) {
                  allBirthdays.push({ id: `student_${s.id}`, name: s.name, date: s.birthDate, type: 'catequizando' });
                }
              });
            } catch (e) {}
          }
        });

        const currentMonth = now.getMonth();
        
        allBirthdays.forEach(birthday => {
          const [year, month, day] = birthday.date.split('-').map(Number);
          
          if (month - 1 === currentMonth) {
            const birthdayDate = new Date(now.getFullYear(), month - 1, day);
            const timeDiff = birthdayDate.getTime() - now.getTime();
            
            const exists = prev.some(n => {
              if (n.birthdayId !== birthday.id) return false;
              if (!n.eventDate) return true;
              return new Date(n.eventDate).getMonth() === currentMonth;
            });
            
            if (!exists) {
              const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
              let message = '';
              
              if (daysLeft === 0) {
                message = `${birthday.name} (${birthday.type}) faz aniversário hoje!`;
              } else if (daysLeft === 1) {
                message = `${birthday.name} (${birthday.type}) faz aniversário amanhã!`;
              } else if (daysLeft > 1) {
                message = `${birthday.name} (${birthday.type}) faz aniversário dia ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}.`;
              } else {
                message = `O aniversário de ${birthday.name} (${birthday.type}) foi dia ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}.`;
              }

              newNotifications.push({
                id: Math.random().toString(36).substring(2, 9),
                title: 'Aniversariante do Mês',
                message,
                type: 'birthday',
                link: '/',
                birthdayId: birthday.id,
                isRead: false,
                date: new Date().toISOString(),
                eventDate: birthdayDate.toISOString(),
              });
            }
          }
        });

        if (newNotifications.length === 0) return prev;
        return [...newNotifications, ...prev];
      });
    };

    checkEvents();
    const interval = setInterval(checkEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings, classes, isLoaded]);

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
