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
  community_id?: string;
  catechist_id?: string;
}

export interface Student {
  id: string;
  class_id: string;
  user_id: string;
  name: string;
  birth_date?: string;
  parents_name?: string;
  phone?: string;
  address?: string;
  photo_url?: string;
}

interface AppContextType {
  classes: ClassItem[];
  students: Student[];
  setClasses: (classes: ClassItem[]) => void;
  addClass: (newClass: Omit<ClassItem, 'id' | 'user_id'>) => Promise<void>;
  updateClass: (id: string, updatedClass: Partial<ClassItem>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getStudentsCount: (classId: string) => number;
  refreshData: () => Promise<void>;
  isLoaded: boolean;
  userId: string | null;
  parish: any | null;
  hasParish: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [classes, setClassesState] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [parish, setParish] = useState<any | null>(null);
  
  const supabase = createClient();

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsLoaded(true);
      return;
    }
    
    const currentUserId = session.user.id;
    setUserId(currentUserId);

    // Fetch classes
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (classesError) {
      console.error('Error fetching classes:', classesError);
    } else {
      setClassesState(classesData as ClassItem[]);
    }

    // Fetch students to provide counts to the main list
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('id, class_id, user_id, name');

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
    } else {
      setStudents(studentsData as Student[]);
    }

    // Fetch parish info
    const { data: parishData } = await supabase
      .from('parishes')
      .select('*')
      .single();
    
    setParish(parishData);
    
    setIsLoaded(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const getStudentsCount = (classId: string) => {
    return students.filter(s => s.class_id === classId).length;
  };

  const setClasses = (newClasses: ClassItem[]) => {
    setClassesState(newClasses);
  };

  const addClass = async (newClass: Omit<ClassItem, 'id' | 'user_id'>) => {
    if (!userId) return;
    
    // Atualização otimista
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
          icon: newClass.icon,
          community_id: newClass.community_id,
          catechist_id: newClass.catechist_id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding class:', error);
      setClassesState(prev => prev.filter(c => c.id !== tempId));
    } else if (data) {
      setClassesState(prev => prev.map(c => c.id === tempId ? (data as ClassItem) : c));
    }
  };

  const updateClass = async (id: string, updatedClass: Partial<ClassItem>) => {
    const previousState = [...classes];
    setClassesState(prev => prev.map(c => c.id === id ? { ...c, ...updatedClass } : c));

    const { error } = await supabase
      .from('classes')
      .update(updatedClass)
      .eq('id', id);

    if (error) {
      console.error('Error updating class:', error);
      setClassesState(previousState);
    }
  };

  const deleteClass = async (id: string) => {
    const previousState = [...classes];
    setClassesState(prev => prev.filter(c => c.id !== id));

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting class:', error);
      setClassesState(previousState);
    }
  };

  return (
    <AppContext.Provider value={{ 
      classes, students, setClasses, addClass, updateClass, deleteClass, 
      getStudentsCount, refreshData, isLoaded, userId,
      parish, hasParish: !!parish
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
