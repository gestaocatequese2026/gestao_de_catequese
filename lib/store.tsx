'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface ClassItem {
  id: string; // Will come from Supabase UUID
  user_id?: string;
  name: string;
  description?: string;
  level?: string;
  schedule: string;
  location?: string;
  status: 'Ativa' | 'Inativa' | 'Iniciando';
  icon: string;
}

interface AppContextType {
  classes: ClassItem[];
  setClasses: (classes: ClassItem[]) => void;
  addClass: (newClass: Omit<ClassItem, 'id' | 'user_id'>) => Promise<void>;
  updateClass: (id: string, updatedClass: Partial<ClassItem>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  isLoaded: boolean;
  userId: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [classes, setClassesState] = useState<ClassItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoaded(true);
        return;
      }
      
      setUserId(session.user.id);

      // Fetch classes from Supabase Real Database
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching classes:', error);
      } else {
        setClassesState(data as ClassItem[]);
      }
      
      setIsLoaded(true);
    }

    loadData();
  }, []);

  const setClasses = (newClasses: ClassItem[]) => {
    setClassesState(newClasses);
  };

  const addClass = async (newClass: Omit<ClassItem, 'id' | 'user_id'>) => {
    if (!userId) return;
    
    // Atualização otimista: Interface reage instantaneamente
    const tempId = `temp_${Date.now()}`;
    const optimisticClass: ClassItem = {
      ...newClass,
      id: tempId,
      user_id: userId,
      status: newClass.status || 'Ativa'
    };
    
    setClassesState(prev => [optimisticClass, ...prev]);

    const { data, error } = await supabase
      .from('classes')
      .insert([
        { 
          user_id: userId,
          name: newClass.name,
          description: newClass.description,
          level: newClass.level,
          schedule: newClass.schedule,
          location: newClass.location,
          status: newClass.status || 'Ativa',
          icon: newClass.icon
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding class:', error);
      // Reverte se a rede falhar
      setClassesState(prev => prev.filter(c => c.id !== tempId));
    } else if (data) {
      // Substitui o ID temporário pelo ID real do banco
      setClassesState(prev => prev.map(c => c.id === tempId ? (data as ClassItem) : c));
    }
  };

  const updateClass = async (id: string, updatedClass: Partial<ClassItem>) => {
    // Atualização otimista
    const previousState = [...classes];
    setClassesState(prev => prev.map(c => c.id === id ? { ...c, ...updatedClass } : c));

    const { error } = await supabase
      .from('classes')
      .update(updatedClass)
      .eq('id', id);

    if (error) {
      console.error('Error updating class:', error);
      // Reverte
      setClassesState(previousState);
    }
  };

  const deleteClass = async (id: string) => {
    // Atualização otimista
    const previousState = [...classes];
    setClassesState(prev => prev.filter(c => c.id !== id));

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting class:', error);
      // Reverte
      setClassesState(previousState);
    }
  };

  return (
    <AppContext.Provider value={{ 
      classes, setClasses, addClass, updateClass, deleteClass, 
      isLoaded, userId 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
