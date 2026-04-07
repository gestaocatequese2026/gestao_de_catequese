'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { cn, getClassColor } from '@/lib/utils';
import { 
  Search, CheckCircle, Circle, ArrowLeft, Users, UserCheck, 
  Calendar, ClipboardList, Activity, Flag, Plus, Eye, 
  Presentation, Edit2, X, Clock, BookOpen, MessageSquare, 
  Heart, Info, ChevronRight, ChevronDown, Save, Library, Play, Pause, RotateCcw, 
  SkipForward, SkipBack, Maximize2,
  Baby, Camera, Trash2, GripVertical, LayoutGrid, List, MapPin, FileText, Printer, Loader2
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { initialTemplates, CatequeseTemplate } from '@/lib/templates';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ReportButton } from '@/components/report-button';
import { NotificationBell } from '@/components/notification-bell';
import { createClient } from '@/utils/supabase/client';

// Mock Data removed

type MeetingStatus = 'Planejado' | 'Realizado' | 'Transferido' | 'Cancelado';

interface CatequeseRoteiroStep {
  id: string;
  label: string;
  tempo: string;
  responsavel: string;
  descricao: string;
  tipo?: string;
}

interface Meeting {
  id: string;
  tema: string;
  data: string;
  leituraBiblica: string;
  materialApoio: string;
  status: MeetingStatus;
  image?: string;
  roteiro: CatequeseRoteiroStep[];
}

export default function TurmaDetalhes() {
  const params = useParams();
  const classId = params?.id as string;
  const { classes, isLoaded, userId, refreshData } = useAppStore();
  const currentClass = classes.find((c: any) => c.id === classId);
  const supabase = createClient();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [catequizandosList, setCatequizandosList] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [catechists, setCatechists] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  // Photo state
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Prepare data for Grade de Frequência
  const frequencyData = React.useMemo(() => {
    if (!meetings.length || !catequizandosList.length) return { dates: [], students: [] };
    
    const dates = [...new Set(meetings.map(m => m.data))].sort();
    const studentsWithAttendance = catequizandosList.map(student => {
      const attendanceMap: Record<string, string> = {};
      attendanceRecords
        .filter(record => record.student_id === student.id)
        .forEach(record => {
          const meeting = meetings.find(m => m.id === record.event_id);
          if (meeting) {
            attendanceMap[meeting.data] = record.status;
          }
        });
      
      return {
        ...student,
        attendance: attendanceMap
      };
    });

    return { dates, students: studentsWithAttendance };
  }, [meetings, catequizandosList, attendanceRecords]);

  // Load data from Supabase
  useEffect(() => {
    if (isLoaded && userId && classId) {
      const loadClassData = async () => {
        // Fetch Meetings
        const { data: meetingsData } = await supabase
          .from('meetings')
          .select('*')
          .eq('class_id', classId)
          .order('date', { ascending: true });
        
        if (meetingsData) {
          setMeetings(meetingsData.map(m => ({
            id: m.id,
            tema: m.title,
            data: m.date,
            leituraBiblica: m.biblical_reading,
            materialApoio: m.support_material,
            status: m.status,
            image: m.image_url,
            roteiro: m.roteiro || []
          })));
        }

        // Fetch Students
        const { data: studentsData } = await supabase
          .from('students')
          .select('*')
          .eq('class_id', classId)
          .order('name', { ascending: true });
        
        if (studentsData) {
          setCatequizandosList(studentsData.map(s => ({
            id: s.id,
            name: s.name,
            birthDate: s.birth_date,
            parents: s.parents_name,
            phone: s.phone,
            address: s.address,
            medicalNotes: s.medical_notes,
            avatar: s.photo_url,
            sacraments: s.sacraments || [],
            attendance: '100%', // Placeholder, implement logic if needed
            present: true
          })));
        }

        // Fetch Activities
        const { data: activitiesData } = await supabase
          .from('activities')
          .select('*')
          .eq('class_id', classId)
          .order('date', { ascending: true });
        
        if (activitiesData) {
          setActivities(activitiesData.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            type: a.type,
            date: a.date,
            time: a.time,
            location: a.location,
            nature: a.nature,
            conductionType: a.conduction_type,
            requireDeclaration: a.require_declaration,
            observation: a.observation,
            status: a.status,
            participants: a.participants,
            objective: a.objective,
            agendas: a.agendas,
            followUps: a.follow_ups,
            announcements: a.announcements,
            preparationPlan: a.preparation_plan,
            preparationDetails: a.preparation_details || {}
          })));
        }

        // Fetch Catechists
        const { data: catechistsData } = await supabase
          .from('catechists')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'Ativo')
          .order('name', { ascending: true });
        
        if (catechistsData) {
          setCatechists(catechistsData);
        }

        // Fetch Attendance
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*')
          .eq('class_id', classId);
        
        if (attendanceData) {
          setAttendanceRecords(attendanceData);
        }
      };

      loadClassData();
    }
  }, [isLoaded, userId, classId]);

  const [planoFilter, setPlanoFilter] = useState<'all' | 'semester1' | 'semester2' | 'cycle'>('all');
  const [planoMonthFilter, setPlanoMonthFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [meetingFilter, setMeetingFilter] = useState<string>('Todos');
  const [monthFilter, setMonthFilter] = useState<string>('Todos');
  const [viewModeEncontros, setViewModeEncontros] = useState<'grid' | 'list'>('grid');
  const [searchCatequizando, setSearchCatequizando] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [selectedActivityForPrep, setSelectedActivityForPrep] = useState<any>(null);
  const [isExternalActivity, setIsExternalActivity] = useState(false);
  const [isCatequizandoModalOpen, setIsCatequizandoModalOpen] = useState(false);
  const [selectedCatequizando, setSelectedCatequizando] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isActivityEditing, setIsActivityEditing] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationMeeting, setPresentationMeeting] = useState<Meeting | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    id: string | number;
    type: 'meeting' | 'catequizando' | 'activity';
    title: string;
    message: string;
  } | null>(null);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedSacraments, setSelectedSacraments] = useState<string[]>([]);
  const [activitySelectionMode, setActivitySelectionMode] = useState<'all' | 'specific'>('all');
  const [selectedCatequizandosForActivity, setSelectedCatequizandosForActivity] = useState<number[]>([]);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [meetingToTransfer, setMeetingToTransfer] = useState<Meeting | null>(null);
  const [transferDate, setTransferDate] = useState<string>('');
  const [conflictMeeting, setConflictMeeting] = useState<Meeting | null>(null);

  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
  const [selectedActivityForDeclaration, setSelectedActivityForDeclaration] = useState<any>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceEvent, setAttendanceEvent] = useState<{ id: string, name: string, type: 'encontro' | 'atividade' } | null>(null);
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, { status: 'Presente' | 'Faltante', justification?: string }>>({});

  const handleGenerateDeclaration = (activity: any) => {
    setSelectedActivityForDeclaration(activity);
    setIsDeclarationModalOpen(true);
  };

  const handlePrintDeclaration = () => {
    window.print();
  };

  const [activityForm, setActivityForm] = useState({
    id: '',
    name: '',
    description: '',
    type: 'Celebração',
    date: '',
    time: '',
    location: '',
    nature: 'Interna',
    conductionType: 'Ônibus Fretado',
    requireDeclaration: true,
    observation: '',
    status: 'Planejado' as MeetingStatus,
    objective: '',
    agendas: '',
    followUps: '',
    announcements: '',
    preparationPlan: '',
    preparationDetails: {
      date: '',
      time: '',
      location: '',
      requirements: ''
    }
  });

  const handleOpenActivityModal = (activity: any = null, edit = false) => {
    if (activity) {
      setActivityForm({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        type: activity.type,
        date: activity.date,
        time: activity.time || '',
        location: activity.location || '',
        nature: activity.nature,
        conductionType: activity.conductionType || 'Ônibus Fretado',
        requireDeclaration: activity.requireDeclaration,
        observation: activity.observation || '',
        status: activity.status || 'Planejado',
        objective: activity.objective || '',
        agendas: activity.agendas || '',
        followUps: activity.followUps || '',
        announcements: activity.announcements || '',
        preparationPlan: activity.preparationPlan || '',
        preparationDetails: activity.preparationDetails || {
          date: '',
          time: '',
          location: '',
          requirements: ''
        }
      });
      setIsExternalActivity(activity.nature === 'Externa');
      setActivitySelectionMode(activity.participants === 'all' ? 'all' : 'specific');
      setSelectedCatequizandosForActivity(activity.participants === 'all' ? [] : activity.participants);
    } else {
      setActivityForm({
        id: '',
        name: '',
        description: '',
        type: 'Celebração',
        date: '',
        time: '',
        location: '',
        nature: 'Interna',
        conductionType: 'Ônibus Fretado',
        requireDeclaration: true,
        observation: '',
        status: 'Planejado',
        objective: '',
        agendas: '',
        followUps: '',
        announcements: '',
        preparationPlan: '',
        preparationDetails: {
          date: '',
          time: '',
          location: '',
          requirements: ''
        }
      });
      setIsExternalActivity(false);
      setActivitySelectionMode('all');
      setSelectedCatequizandosForActivity([]);
    }
    setIsActivityEditing(edit);
    setIsActivityModalOpen(true);
  };

  const handleOpenAttendanceModal = (event: any, type: 'encontro' | 'atividade') => {
    setAttendanceEvent({ id: event.id, name: event.tema || event.name, type });
    
    // Pre-fill with existing records or default to Presente
    const records = attendanceRecords.filter(r => r.event_id === event.id);
    const initialPresence: Record<string, any> = {};
    
    catequizandosList.forEach(s => {
      const record = records.find(r => r.student_id === s.id);
      initialPresence[s.id] = {
        status: record ? record.status : 'Presente',
        justification: record ? record.justification : ''
      };
    });
    
    setCurrentAttendance(initialPresence);
    setIsAttendanceModalOpen(true);
  };

  const handleSaveAttendance = async () => {
    if (!attendanceEvent || !userId) return;
    
    // Check if the event ID is valid (not a temp/random ID)
    if (attendanceEvent.id.length < 20) {
      setToast({ message: "Salve o registro primeiro antes de fazer a chamada.", type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const recordsToSave = Object.entries(currentAttendance).map(([studentId, data]) => ({
      class_id: classId,
      user_id: userId,
      event_id: attendanceEvent.id,
      event_type: attendanceEvent.type,
      student_id: studentId,
      status: data.status,
      justification: data.justification || null
    }));

    if (recordsToSave.length === 0) {
      setIsAttendanceModalOpen(false);
      return;
    }

    // Try to save directly with upsert or delete/insert
    try {
      const { error: deleteError } = await supabase
        .from('attendance')
        .delete()
        .eq('event_id', attendanceEvent.id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('attendance')
        .insert(recordsToSave);

      if (insertError) throw insertError;

      setToast({ message: "Presenças salvas com sucesso!", type: 'success' });
      
      const { data: updatedData } = await supabase
        .from('attendance')
        .select('*')
        .eq('class_id', classId);
      if (updatedData) setAttendanceRecords(updatedData);
      
      setIsAttendanceModalOpen(false);
    } catch (err: any) {
      console.error('Attendance error:', err);
      setToast({ message: "Erro detalhado: " + (err.message || "Erro desconhecido"), type: 'error' });
    }
    
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveActivity = async () => {
    if (!activityForm.name || !activityForm.date || !userId) {
      setToast({ message: 'Preencha o nome e a data da atividade.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const activityData = {
      class_id: classId,
      user_id: userId,
      name: activityForm.name,
      description: activityForm.description,
      type: activityForm.type,
      date: activityForm.date,
      time: activityForm.time,
      location: activityForm.location,
      nature: activityForm.nature,
      conduction_type: activityForm.conductionType,
      require_declaration: activityForm.requireDeclaration,
      observation: activityForm.observation,
      status: activityForm.status,
      participants: activitySelectionMode === 'all' ? 'all' : selectedCatequizandosForActivity,
      objective: activityForm.objective,
      agendas: activityForm.agendas,
      followUps: activityForm.followUps,
      announcements: activityForm.announcements,
      preparation_plan: activityForm.preparationPlan,
      preparation_details: activityForm.preparationDetails,
    };

    let result;
    if (activityForm.id && !activityForm.id.startsWith('temp_')) {
      // Edit existing activity
      result = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', activityForm.id);
    } else {
      // Create new activity
      result = await supabase
        .from('activities')
        .insert([activityData]);
    }

    if (result.error) {
      console.error('Error saving activity:', result.error);
      setToast({ message: 'Erro ao salvar atividade.', type: 'error' });
    } else {
      setToast({ message: 'Atividade salva com sucesso!', type: 'success' });
      // Refresh list
      const { data } = await supabase.from('activities').select('*').eq('class_id', classId).order('date', { ascending: true });
      if (data) setActivities(data.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        type: a.type,
        date: a.date,
        time: a.time,
        location: a.location,
        nature: a.nature,
        conductionType: a.conduction_type,
        requireDeclaration: a.require_declaration,
        observation: a.observation,
        status: a.status,
        participants: a.participants,
        objective: a.objective,
        agendas: a.agendas,
        followUps: a.follow_ups,
        announcements: a.announcements,
        preparationPlan: a.preparation_plan,
        preparationDetails: a.preparation_details || {
          date: '',
          time: '',
          location: '',
          requirements: ''
        }
      })));
    }

    setIsActivityModalOpen(false);
    setActivityForm({
      id: '',
      name: '',
      description: '',
      type: 'Celebração',
      date: '',
      time: '',
      location: '',
      nature: 'Interna',
      conductionType: 'Ônibus Fretado',
      requireDeclaration: true,
      observation: '',
      status: 'Planejado',
      objective: '',
      agendas: '',
      followUps: '',
      announcements: '',
      preparationPlan: '',
      preparationDetails: {
        date: '',
        time: '',
        location: '',
        requirements: ''
      }
    });
    setActivitySelectionMode('all');
    setSelectedCatequizandosForActivity([]);
    setIsExternalActivity(false);
    
    setTimeout(() => setToast(null), 3000);
  };

  const handleSavePreparation = async () => {
    if (!selectedActivityForPrep || !userId) return;

    const prepDetails = {
      date: (document.getElementById('prep-date') as HTMLInputElement)?.value,
      time: (document.getElementById('prep-time') as HTMLInputElement)?.value,
      location: (document.getElementById('prep-location') as HTMLInputElement)?.value,
      requirements: (document.getElementById('prep-requirements') as HTMLTextAreaElement)?.value,
    };

    const { error } = await supabase
      .from('activities')
      .update({ preparation_details: prepDetails })
      .eq('id', selectedActivityForPrep.id);

    if (error) {
      console.error('Error saving preparation:', error);
      setToast({ message: 'Erro ao salvar planejamento.', type: 'error' });
    } else {
      setToast({ message: 'Planejamento salvo com sucesso!', type: 'success' });
      // Update local state
      setActivities(activities.map(a => 
        a.id === selectedActivityForPrep.id ? { ...a, preparationDetails: prepDetails } : a
      ));
      setIsPrepModalOpen(false);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate + 'T12:00:00');
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleOpenCatequizandoModal = (catequizando: any = null) => {
    setSelectedCatequizando(catequizando);
    if (catequizando) {
      setSelectedSacraments(catequizando.sacraments || []);
      setPreviewPhoto(catequizando.avatar || null);
    } else {
      setSelectedSacraments([]);
      setPreviewPhoto(null);
    }
    setPhotoFile(null);
    setIsCatequizandoModalOpen(true);
  };

  const handleCloseCatequizandoModal = () => {
    setIsCatequizandoModalOpen(false);
    setSelectedCatequizando(null);
    setSelectedSacraments([]);
    setPreviewPhoto(null);
    setPhotoFile(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (uid: string): Promise<string | null> => {
    if (!photoFile) return null;
    const ext = photoFile.name.split('.').pop() || 'jpg';
    const fileName = `${uid}/students/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, photoFile, { contentType: photoFile.type, upsert: true });
    if (error) { console.error('Upload error:', error); return null; }
    const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSaveCatequizando = async () => {
    const nameInput = document.getElementById('catequizando-name') as HTMLInputElement;
    const birthDateInput = document.getElementById('catequizando-birthdate') as HTMLInputElement;
    const parentsInput = document.getElementById('catequizando-parents') as HTMLInputElement;
    const phoneInput = document.getElementById('catequizando-phone') as HTMLInputElement;
    const addressInput = document.getElementById('catequizando-address') as HTMLInputElement;
    const medicalInput = document.getElementById('catequizando-medical') as HTMLTextAreaElement;
    
    const name = nameInput?.value || 'Novo Catequizando';
    const birthDate = birthDateInput?.value || null;
    
    if (!userId) return;
    setIsUploading(true);

    let photoUrl = selectedCatequizando?.avatar || '';
    if (photoFile) {
      const uploaded = await uploadPhoto(userId);
      if (uploaded) photoUrl = uploaded;
    }

    const catequizandoData = {
      class_id: classId,
      user_id: userId,
      name,
      birth_date: birthDate,
      parents_name: parentsInput?.value || '',
      phone: phoneInput?.value || '',
      address: addressInput?.value || '',
      medical_notes: medicalInput?.value || '',
      sacraments: selectedSacraments,
      photo_url: photoUrl
    };

    let result;
    const studentId = selectedCatequizando?.id;
    
    if (studentId) {
      // Update existing
      result = await supabase
        .from('students')
        .update(catequizandoData)
        .eq('id', studentId);
    } else {
      result = await supabase
        .from('students')
        .insert([catequizandoData]);
    }

    setIsUploading(false);

    if (result.error) {
      console.error('Error saving catequizando:', result.error);
      showToast('Erro ao salvar catequizando.', 'error');
    } else {
      showToast(selectedCatequizando ? 'Perfil atualizado!' : 'Catequizando cadastrado!');
      // Refresh students
      const { data } = await supabase.from('students').select('*').eq('class_id', classId).order('name', { ascending: true });
      if (data) setCatequizandosList(data.map(s => ({
        id: s.id,
        name: s.name,
        birthDate: s.birth_date,
        parents: s.parents_name,
        phone: s.phone,
        address: s.address,
        medicalNotes: s.medical_notes,
        avatar: s.photo_url,
        sacraments: s.sacraments || [],
        attendance: '100%',
        present: true
      })));
      refreshData(); // Updates global counter
    }
    handleCloseCatequizandoModal();
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'encontros', label: 'Encontros', icon: Calendar, color: 'from-[#FF9500] to-[#FF5E3A]' },
    { id: 'catequizandos', label: 'Catequizandos', icon: Users, color: 'from-[#5AC8FA] to-[#007AFF]' },
    { id: 'plano', label: 'Plano da Turma', icon: ClipboardList, color: 'from-[#4CD964] to-[#34AADC]' },
    { id: 'atividades-eventos', label: 'Atividades e Eventos', icon: Activity, color: 'from-[#FF2D55] to-[#FF3B30]' },
  ];

  const handleOpenModal = (meeting: Meeting | null = null, edit = false) => {
    if (!meeting) {
      // Initialize a new meeting object
      const newMeeting: Meeting = {
        id: Math.random().toString(36).substr(2, 9),
        tema: '',
        data: new Date().toISOString().split('T')[0],
        leituraBiblica: '',
        materialApoio: '',
        status: 'Planejado',
        roteiro: [
          { id: 'acolhida', label: 'Acolhida', tempo: '', responsavel: '', descricao: '' },
          { id: 'oracaoInicial', label: 'Oração Inicial', tipo: 'Oração básica', tempo: '', responsavel: '', descricao: '' },
          { id: 'desenvolvimento', label: 'Desenvolvimento do Tema', tempo: '', responsavel: '', descricao: '' },
          { id: 'dinamica', label: 'Dinâmica', tempo: '', responsavel: '', descricao: '' },
          { id: 'compromisso', label: 'Compromisso', tempo: '', responsavel: '', descricao: '' },
          { id: 'avisos', label: 'Avisos', tempo: '', responsavel: '', descricao: '' },
          { id: 'oracaoFinal', label: 'Oração Final', tempo: '', responsavel: '', descricao: '' }
        ]
      };
      setSelectedMeeting(newMeeting);
    } else {
      setSelectedMeeting(meeting);
    }
    setIsEditing(edit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
    setIsEditing(false);
  };

  const handleDeleteActivity = (id: string) => {
    setDeleteConfig({
      id,
      type: 'activity',
      title: 'Excluir Atividade',
      message: 'Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.'
    });
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (meetingId: string, newStatus: MeetingStatus) => {
    if (newStatus === 'Transferido') {
      const meeting = meetings.find(m => m.id === meetingId);
      if (meeting) {
        setMeetingToTransfer(meeting);
        setTransferDate(meeting.data);
        setConflictMeeting(null);
        setTransferModalOpen(true);
      }
      return;
    }

    const { error } = await supabase
      .from('meetings')
      .update({ status: newStatus })
      .eq('id', meetingId);

    if (error) {
      console.error('Error updating status:', error);
      showToast('Erro ao atualizar status.', 'error');
    } else {
      const updatedMeetings = meetings.map(m => m.id === meetingId ? { ...m, status: newStatus } : m);
      setMeetings(updatedMeetings);
      if (selectedMeeting?.id === meetingId) {
        setSelectedMeeting(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Status alterado para ${newStatus}`);
    }
  };

  const handleTransferDateChange = (date: string) => {
    setTransferDate(date);
    const existing = meetings.find(m => m.data === date && m.id !== meetingToTransfer?.id);
    setConflictMeeting(existing || null);
  };

  const confirmTransfer = async (action: 'cancel' | 'reschedule' | 'normal' = 'normal') => {
    if (!meetingToTransfer) return;

    let success = false;

    if (action === 'cancel' && conflictMeeting) {
      const { error: err1 } = await supabase.from('meetings').update({ data: transferDate, status: 'Transferido' }).eq('id', meetingToTransfer.id);
      const { error: err2 } = await supabase.from('meetings').update({ status: 'Cancelado' }).eq('id', conflictMeeting.id);
      if (!err1 && !err2) {
        showToast('Encontro transferido e encontro conflitante cancelado!');
        success = true;
      }
    } else if (action === 'reschedule' && conflictMeeting) {
      const conflictDateObj = new Date(conflictMeeting.data + 'T12:00:00');
      const nextDateObj = new Date(conflictDateObj);
      nextDateObj.setDate(nextDateObj.getDate() + 7);
      let nextDateStr = nextDateObj.toISOString().split('T')[0];
      
      while (meetings.some(m => m.data === nextDateStr && m.id !== conflictMeeting.id && m.id !== meetingToTransfer.id)) {
        nextDateObj.setDate(nextDateObj.getDate() + 7);
        nextDateStr = nextDateObj.toISOString().split('T')[0];
      }

      const { error: err1 } = await supabase.from('meetings').update({ data: transferDate, status: 'Transferido' }).eq('id', meetingToTransfer.id);
      const { error: err2 } = await supabase.from('meetings').update({ data: nextDateStr, status: 'Transferido' }).eq('id', conflictMeeting.id);
      if (!err1 && !err2) {
        showToast('Encontro transferido e encontro conflitante remanejado!');
        success = true;
      }
    } else {
      const { error } = await supabase.from('meetings').update({ data: transferDate, status: 'Transferido' }).eq('id', meetingToTransfer.id);
      if (!error) {
        showToast('Encontro transferido com sucesso!');
        success = true;
      }
    }

    if (success) {
      // Refresh meetings
      const { data } = await supabase.from('meetings').select('*').eq('class_id', classId).order('date', { ascending: true });
      if (data) {
        const mapped = data.map(m => ({
          id: m.id,
          tema: m.title,
          data: m.date,
          leituraBiblica: m.biblical_reading,
          materialApoio: m.support_material,
          status: m.status,
          image: m.image_url,
          roteiro: m.roteiro || []
        }));
        setMeetings(mapped);
        if (selectedMeeting) {
          const updatedSelected = mapped.find(m => m.id === selectedMeeting.id);
          setSelectedMeeting(updatedSelected || null);
        }
      }
    }
    
    setTransferModalOpen(false);
    setMeetingToTransfer(null);
    setConflictMeeting(null);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting || !userId) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const meetingData = {
      class_id: classId,
      user_id: userId,
      title: formData.get('tema') as string,
      date: formData.get('data') as string,
      biblical_reading: formData.get('leituraBiblica') as string,
      support_material: formData.get('materialApoio') as string,
      status: selectedMeeting.status || 'Planejado',
      image_url: selectedMeeting.image || '',
      roteiro: selectedMeeting.roteiro.map(step => {
        const customLabel = formData.get(`roteiro-${step.id}-label`) as string;
        return {
          ...step,
          label: customLabel || step.label,
          tempo: formData.get(`roteiro-${step.id}-tempo`) as string,
          responsavel: formData.get(`roteiro-${step.id}-responsavel`) as string,
          descricao: formData.get(`roteiro-${step.id}-descricao`) as string,
          ...(step.id === 'oracaoInicial' ? { tipo: formData.get(`roteiro-${step.id}-tipo`) as string } : {})
        };
      })
    };

    let result;
    if (selectedMeeting.id && !selectedMeeting.id.startsWith('temp_') && selectedMeeting.id.length > 20) {
      // Logic for real UUID IDs
      result = await supabase
        .from('meetings')
        .update(meetingData)
        .eq('id', selectedMeeting.id);
    } else {
      result = await supabase
        .from('meetings')
        .insert([meetingData]);
    }

    if (result.error) {
      console.error('Error saving meeting:', result.error);
      showToast('Erro ao salvar encontro.', 'error');
    } else {
      showToast(selectedMeeting.id && selectedMeeting.id.length > 20 ? 'Encontro atualizado com sucesso!' : 'Novo encontro criado com sucesso!');
      // Refresh meetings
      const { data } = await supabase.from('meetings').select('*').eq('class_id', classId).order('date', { ascending: true });
      if (data) setMeetings(data.map(m => ({
        id: m.id,
        tema: m.title,
        data: m.date,
        leituraBiblica: m.biblical_reading,
        materialApoio: m.support_material,
        status: m.status,
        image: m.image_url,
        roteiro: m.roteiro || []
      })));
    }

    handleCloseModal();
  };

  const handleAddCatequeseRoteiroStep = () => {
    if (!selectedMeeting) return;
    const newStep: CatequeseRoteiroStep = {
      id: `custom-${Date.now()}`,
      label: 'Nova Etapa',
      tempo: '10 min',
      responsavel: '',
      descricao: ''
    };
    setSelectedMeeting({
      ...selectedMeeting,
      roteiro: [...selectedMeeting.roteiro, newStep]
    });
  };

  const handleRemoveCatequeseRoteiroStep = (stepId: string) => {
    if (!selectedMeeting) return;
    setSelectedMeeting({
      ...selectedMeeting,
      roteiro: selectedMeeting.roteiro.filter(s => s.id !== stepId)
    });
  };

  const handleDeleteMeeting = (id: string) => {
    setDeleteConfig({
      id,
      type: 'meeting',
      title: 'Excluir Encontro',
      message: 'Tem certeza que deseja excluir este encontro? Esta ação não pode ser desfeita.'
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCatequizando = (id: number) => {
    setDeleteConfig({
      id,
      type: 'catequizando',
      title: 'Excluir Catequizando',
      message: 'Tem certeza que deseja excluir este catequizando? Esta ação não pode ser desfeita.'
    });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfig) return;

    let table = '';
    if (deleteConfig.type === 'meeting') table = 'meetings';
    else if (deleteConfig.type === 'catequizando') table = 'students';
    else if (deleteConfig.type === 'activity') table = 'activities';

    if (table) {
      const { error } = await supabase.from(table).delete().eq('id', deleteConfig.id);
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        showToast('Erro ao excluir registro.', 'error');
      } else {
        if (deleteConfig.type === 'meeting') {
          setMeetings(meetings.filter(m => m.id !== deleteConfig.id));
          showToast('Encontro excluído.');
          handleCloseModal();
        } else if (deleteConfig.type === 'catequizando') {
          setCatequizandosList(catequizandosList.filter(s => s.id !== deleteConfig.id));
          showToast('Catequizando excluído!');
          handleCloseCatequizandoModal();
          refreshData();
        } else if (deleteConfig.type === 'activity') {
          setActivities(activities.filter(a => a.id !== deleteConfig.id));
          showToast('Atividade excluída com sucesso!');
        }
      }
    }
    
    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  const applyTemplate = (templateId: string) => {
    if (!selectedMeeting) return;
    
    const tpl = initialTemplates.find(t => t.id === templateId);
    if (!tpl) return;

    const templateMeeting: Meeting = {
      ...selectedMeeting,
      tema: tpl.title,
      leituraBiblica: tpl.leituraBiblica,
      materialApoio: typeof tpl.materialApoio === 'string' 
        ? tpl.materialApoio 
        : tpl.materialApoio.map(m => m.label).join(', '),
      image: tpl.image,
      roteiro: tpl.roteiro.map(step => ({
        id: step.id,
        label: step.label,
        tempo: step.tempo,
        responsavel: step.responsavel,
        descricao: step.descricao
      }))
    };
    setSelectedMeeting(templateMeeting);
    setIsTemplateModalOpen(false);
    showToast('Modelo da biblioteca aplicado!');
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 0;
  };

  const startPresentation = (meeting: Meeting) => {
    const steps = meeting.roteiro;
    setPresentationMeeting(meeting);
    setActiveStepIndex(0);
    setTimeLeft(parseTime(steps[0]?.tempo));
    setIsTimerRunning(false);
    setIsPresenting(true);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGroupedPlanEvents = () => {
    const combined = [
      ...meetings.map(m => ({
        id: m.id,
        type: 'meeting' as const,
        date: m.data,
        title: m.tema || 'Sem tema',
        status: m.status,
        original: m
      })),
      ...activities.map(a => ({
        id: a.id,
        type: 'activity' as const,
        date: a.date,
        title: a.name || 'Sem nome',
        status: a.status || 'Planejado',
        original: a
      }))
    ].filter(e => e.date);

    combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let filtered = combined;
    if (planoFilter === 'semester1') {
      filtered = filtered.filter(e => new Date(e.date + 'T12:00:00').getMonth() < 6);
    } else if (planoFilter === 'semester2') {
      filtered = filtered.filter(e => new Date(e.date + 'T12:00:00').getMonth() >= 6);
    }

    if (planoMonthFilter !== 'all') {
      filtered = filtered.filter(e => new Date(e.date + 'T12:00:00').getMonth().toString() === planoMonthFilter);
    }

    const grouped = filtered.reduce((acc, item) => {
      const dateObj = new Date(item.date + 'T12:00:00');
      const monthYear = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      const capitalizedMonth = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      if (!acc[capitalizedMonth]) acc[capitalizedMonth] = [];
      acc[capitalizedMonth].push(item);
      return acc;
    }, {} as Record<string, typeof combined>);

    return grouped;
  };

  const groupedPlanEvents = getGroupedPlanEvents();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/15 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          {activeTab ? (
            <button onClick={() => setActiveTab(null)} className="active:scale-95 duration-200 hover:bg-[#eeeeee] transition-colors p-2 rounded-full">
              <ArrowLeft size={24} className="text-[#005da7]" />
            </button>
          ) : (
            <Link href="/turmas" className="active:scale-95 duration-200 hover:bg-[#eeeeee] transition-colors p-2 rounded-full">
              <ArrowLeft size={24} className="text-[#005da7]" />
            </Link>
          )}
          <h1 className="font-manrope font-bold tracking-tight text-[#005da7] text-xl">
            {activeTab ? tabs.find(t => t.id === activeTab)?.label : `Turma: ${currentClass ? currentClass.name : 'Carregando...'}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {currentClass && (
            <>
              <ReportButton 
                moduleName="Turmas"
                reportTitle={`Lista de Catequizandos - ${currentClass.name}`}
                reportSubtitle={`Turma: ${currentClass.level} | ${currentClass.schedule}`}
                type="turmas"
                data={catequizandosList}
                columns={[
                  { key: 'name', label: 'Nome Completo' },
                  { key: 'birthDate', label: 'Idade', render: (val) => val ? `${calculateAge(val)} anos` : '-' },
                  { key: 'present', label: 'Situação', render: (val) => val ? 'Presente' : 'Ausente' }
                ]}
              />
              <ReportButton 
                moduleName="Turmas"
                reportTitle={`Cronograma de Encontros - ${currentClass.name}`}
                reportSubtitle="Planejamento Semestral de Catequese"
                type="calendario"
                data={meetings}
                columns={[
                  { key: 'data', label: 'Data', render: (val) => new Date(val + 'T12:00:00').toLocaleDateString('pt-BR') },
                  { key: 'tema', label: 'Tema do Encontro' },
                  { key: 'status', label: 'Status' }
                ]}
              />
            </>
          )}
          <NotificationBell />
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-24">
        {!activeTab ? (
          <>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {tabs.map((tab) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="bg-white rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 shadow-sm border border-black/15 aspect-square hover:shadow-md transition-all group"
              >
                <div className={cn("w-16 h-16 rounded-[20px] bg-gradient-to-br text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105", tab.color)}>
                  <tab.icon size={32} />
                </div>
                <span className="font-bold text-[#1a1c1c] text-center text-sm md:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>
            {/* Dashboard Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/15"
            >
              <h3 className="font-manrope font-bold text-2xl text-[#1a1c1c] mb-6">Resumo da Turma</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-black/15 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#005da7]/10 text-[#005da7] flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#717783] uppercase tracking-wider">Encontros</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1a1c1c]">{meetings.length}</span>
                      <span className="text-xs font-bold text-[#005da7] bg-[#005da7]/10 px-2 py-0.5 rounded-full">
                        {meetings.filter(m => m.status === 'Realizado').length} realizados
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-black/15 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5AC8FA]/10 text-[#007AFF] flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#717783] uppercase tracking-wider">Catequizandos</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1a1c1c]">{catequizandosList.length}</span>
                      <span className="text-xs font-bold text-[#717783]">matriculados</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-black/15 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center shrink-0">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#717783] uppercase tracking-wider">Próximo Encontro</p>
                    {meetings.find(m => m.status === 'Planejado') ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1a1c1c] truncate max-w-[150px]">
                          {new Date(meetings.find(m => m.status === 'Planejado')!.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-xs font-medium text-[#717783] truncate max-w-[150px]">
                          {meetings.find(m => m.status === 'Planejado')!.tema || 'Sem tema'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[#717783]">Nenhum planejado</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <AnimatePresence mode="wait">
          {activeTab === 'encontros' && (
            <motion.div
              key="encontros"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h2 className="font-manrope font-bold text-2xl text-[#1a1c1c] mb-4">Encontros de Catequese</h2>
                <button 
                  onClick={() => handleOpenModal(null, true)}
                  className="bg-[#007AFF] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#0056b3] transition-colors shadow-sm mb-6"
                >
                  <Plus size={16} />
                  Novo Encontro
                </button>

                <div className="flex items-center gap-3 mb-6 print:hidden">
                  <ReportButton 
                    variant="button"
                    type="turmas"
                    reportType="grade-frequencia"
                    reportTitle="Grade de Frequência"
                    reportSubtitle={`Turma: ${currentClass?.name || ''}`}
                    moduleName="Turmas"
                    data={frequencyData}
                  />
                  <ReportButton 
                    variant="button"
                    type="turmas"
                    reportType="relatorio-mensal"
                    reportTitle="Relatório Mensal"
                    reportSubtitle={`Turma: ${currentClass?.name || ''} - ${monthFilter}`}
                    moduleName="Turmas"
                    data={(() => {
                      const filteredMeetings = meetings.filter(m => monthFilter === 'Todos' || new Date(m.data + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'long' }).toLowerCase() === monthFilter.toLowerCase());
                      const totalPresence = attendanceRecords.filter(r => filteredMeetings.some(m => m.id === r.event_id) && r.status === 'Presente').length;
                      const totalPossible = filteredMeetings.length * catequizandosList.length;
                      
                      return { 
                        month: monthFilter, 
                        class: currentClass, 
                        meetings: filteredMeetings,
                        students: catequizandosList,
                        events: filteredMeetings.map(m => ({
                          date: m.data,
                          title: m.tema,
                          presenceCount: attendanceRecords.filter(r => r.event_id === m.id && r.status === 'Presente').length,
                          summary: m.leituraBiblica
                        })),
                        stats: {
                          totalEvents: filteredMeetings.length,
                          averageAttendance: totalPossible > 0 ? Math.round((totalPresence / totalPossible) * 100) : 0,
                          justifiedAbsences: attendanceRecords.filter(r => filteredMeetings.some(m => m.id === r.event_id) && r.status === 'Faltante' && r.justification).length
                        }
                      };
                    })()}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select 
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="bg-white border border-black/15 rounded-xl px-4 py-2 text-sm font-bold text-[#1a1c1c] focus:ring-2 focus:ring-[#007AFF] outline-none w-full sm:w-auto shadow-sm"
                    >
                      <option value="Todos">Todos os Meses</option>
                      <option value="Janeiro">Janeiro</option>
                      <option value="Fevereiro">Fevereiro</option>
                      <option value="Março">Março</option>
                      <option value="Abril">Abril</option>
                      <option value="Maio">Maio</option>
                      <option value="Junho">Junho</option>
                      <option value="Julho">Julho</option>
                      <option value="Agosto">Agosto</option>
                      <option value="Setembro">Setembro</option>
                      <option value="Outubro">Outubro</option>
                      <option value="Novembro">Novembro</option>
                      <option value="Dezembro">Dezembro</option>
                    </select>
                  </div>
                  
                  <div className="flex bg-[#f3f3f3] p-1 rounded-xl">
                    <button
                      onClick={() => setViewModeEncontros('grid')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewModeEncontros === 'grid' ? "bg-white shadow-sm text-[#007AFF]" : "text-[#717783] hover:text-[#1a1c1c]"
                      )}
                      title="Visualização em Grade"
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewModeEncontros('list')}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        viewModeEncontros === 'list' ? "bg-white shadow-sm text-[#007AFF]" : "text-[#717783] hover:text-[#1a1c1c]"
                      )}
                      title="Visualização em Lista"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={cn(
                "gap-4",
                viewModeEncontros === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2" 
                  : "flex flex-col max-w-3xl mx-auto"
              )}>
                {meetings.filter(m => {
                  const monthMatch = monthFilter === 'Todos' || new Date(m.data + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'long' }).toLowerCase() === monthFilter.toLowerCase();
                  return monthMatch;
                }).map((meeting, index) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    index={index}
                    onView={() => handleOpenModal(meeting)}
                    onPresent={() => startPresentation(meeting)}
                    onAttendance={() => handleOpenAttendanceModal(meeting, 'encontro')}
                    onDelete={() => handleDeleteMeeting(meeting.id)}
                    onStatusChange={(status) => handleStatusChange(meeting.id, status)}
                    viewMode={viewModeEncontros}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'catequizandos' && (
            <motion.div
              key="catequizandos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h2 className="font-manrope font-bold text-2xl text-[#1a1c1c] mb-2">Catequizandos</h2>
                <p className="text-sm text-[#717783] mb-6">Gerencie a frequência e acompanhe a jornada espiritual.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mb-4">
                  <button 
                    onClick={() => handleOpenCatequizandoModal()}
                    className="bg-[#007AFF] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0056b3] transition-colors shadow-sm w-full sm:w-auto"
                  >
                    <Plus size={16} />
                    Novo Catequizando
                  </button>
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717783]" size={18} />
                      <input 
                        placeholder="Pesquisar catequizando..."
                        value={searchCatequizando}
                        onChange={(e) => setSearchCatequizando(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#007AFF] outline-none transition-all shadow-sm"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-black/15 shadow-sm max-w-5xl mx-auto overflow-hidden">
                <div className="divide-y divide-[#edeeef]">
                {catequizandosList.filter(c => c.name.toLowerCase().includes(searchCatequizando.toLowerCase())).map((catequizando, index) => (
                  <motion.div 
                    key={catequizando.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] transition-colors group relative"
                  >
                    <Link href={`/turmas/${classId}/catequizando/${catequizando.id}`} className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      <div className="flex items-center gap-4 sm:min-w-[300px]">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#edeeef] shrink-0 bg-white">
                          {catequizando.avatar ? (
                            <Image src={catequizando.avatar} alt={catequizando.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center text-[#c1c7d3]">
                              <Baby size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-manrope text-base font-bold text-[#1a1c1c] group-hover:text-[#005da7] transition-colors line-clamp-1">{catequizando.name}</h3>
                          <span className="text-xs text-[#717783] sm:hidden mt-0.5">
                             {catequizando.birthDate ? `${calculateAge(catequizando.birthDate)} anos • ${new Date(catequizando.birthDate + 'T12:00:00').toLocaleDateString('pt-BR')}` : 'Sem data de nascimento'}
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-1 justify-between items-center text-sm pr-4">
                        <div className="flex flex-col w-20">
                           <span className="text-[10px] font-bold text-[#717783] uppercase tracking-widest mb-1">Idade</span>
                           <span className="font-medium text-[#1a1c1c]">{catequizando.birthDate ? `${calculateAge(catequizando.birthDate)} anos` : '-'}</span>
                        </div>
                        <div className="flex flex-col w-32">
                           <span className="text-[10px] font-bold text-[#717783] uppercase tracking-widest mb-1">Nascimento</span>
                           <span className="font-medium text-[#1a1c1c]">
                             {catequizando.birthDate ? new Date(catequizando.birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}
                           </span>
                        </div>
                        <div className="flex flex-col w-24">
                           <span className="text-[10px] font-bold text-[#717783] uppercase tracking-widest mb-1">Status</span>
                           <span className="font-bold text-[#146c2e] bg-[#146c2e]/10 px-2 py-0.5 rounded-md self-start text-xs border border-[#146c2e]/20">Ativo</span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
                      <ReportButton 
                        variant="chip"
                        iconOnly
                        type="turmas"
                        reportType="ficha-catequizando"
                        reportTitle={`Ficha: ${catequizando.name}`}
                        moduleName="Turmas"
                        data={catequizando}
                      />
                      <button 
                        onClick={() => handleOpenCatequizandoModal(catequizando)}
                        className="p-2.5 text-[#717783] hover:bg-black/5 hover:text-[#1a1c1c] rounded-xl transition-colors active:scale-95"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCatequizando(catequizando.id)}
                        className="p-2.5 text-[#717783] hover:bg-red-50 hover:text-[#ba1a1a] rounded-xl transition-colors active:scale-95"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {catequizandosList.length === 0 && (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#f8f9fa] border border-[#edeeef] rounded-full flex items-center justify-center mx-auto text-[#c1c7d3]">
                      <Baby size={32} />
                    </div>
                    <p className="text-[#717783] font-medium text-sm">Nenhum catequizando nesta turma.</p>
                  </div>
                )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'plano' && (
            <motion.div
              key="plano"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[32px] p-6 md:p-8 border border-black/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                  <h2 className="font-manrope font-bold text-2xl text-[#1a1c1c] mb-2">Plano da Turma</h2>
                  <p className="text-sm text-[#717783] mb-6">Visão geral de todos os encontros e atividades planejadas.</p>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
                    <div className="flex bg-[#f3f3f3] p-1 rounded-full overflow-hidden">
                      <button 
                        onClick={() => setPlanoFilter('all')}
                        className={cn("px-4 py-1.5 text-sm font-bold rounded-full transition-all", planoFilter === 'all' ? "bg-white text-[#005da7] shadow-sm" : "text-[#717783] hover:text-[#1a1c1c]")}
                      >
                        Ano Todo
                      </button>
                      <button 
                        onClick={() => setPlanoFilter('semester1')}
                        className={cn("px-4 py-1.5 text-sm font-bold rounded-full transition-all", planoFilter === 'semester1' ? "bg-white text-[#005da7] shadow-sm" : "text-[#717783] hover:text-[#1a1c1c]")}
                      >
                        1º Semestre
                      </button>
                      <button 
                        onClick={() => setPlanoFilter('semester2')}
                        className={cn("px-4 py-1.5 text-sm font-bold rounded-full transition-all", planoFilter === 'semester2' ? "bg-white text-[#005da7] shadow-sm" : "text-[#717783] hover:text-[#1a1c1c]")}
                      >
                        2º Semestre
                      </button>
                    </div>

                    <select 
                      value={planoMonthFilter}
                      onChange={(e) => setPlanoMonthFilter(e.target.value)}
                      className="bg-[#f3f3f3] text-[#414751] text-sm font-bold px-4 py-2 rounded-full border-none outline-none focus:ring-2 focus:ring-[#005da7]/20 appearance-none cursor-pointer"
                    >
                      <option value="all">Todos os Meses</option>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i} value={i.toString()}>
                          {new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#edeeef] before:to-transparent">
                  {Object.keys(groupedPlanEvents).length > 0 ? (
                    Object.entries(groupedPlanEvents).map(([month, events]) => (
                      <div key={month} className="relative z-10">
                        <div className="sticky top-20 z-20 flex items-center justify-center mb-6">
                          <div className="bg-white px-6 py-2 rounded-full border border-black/15 shadow-sm font-manrope font-extrabold text-[#005da7] uppercase tracking-widest text-sm">
                            {month}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {events.map((item, i) => (
                            <div 
                              key={item.id} 
                              onClick={() => {
                                if (item.type === 'meeting') {
                                  handleOpenModal(item.original, false);
                                } else {
                                  handleOpenActivityModal(item.original, false);
                                }
                              }}
                              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer"
                            >
                              {/* Timeline dot */}
                              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#005da7] -translate-x-1/2 z-10 group-hover:scale-150 group-hover:bg-[#005da7] transition-all duration-300 shadow-[0_0_0_4px_white]" />
                              
                              {/* Content Card */}
                              <div className="w-full pl-14 md:pl-0 md:w-[calc(50%-2rem)]">
                                <div className={cn(
                                  "p-5 bg-white rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg",
                                  item.type === 'meeting' ? "border-[#005da7]/20 group-hover:border-[#005da7]" : "border-[#146c2e]/20 group-hover:border-[#146c2e]"
                                )}>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                                      item.type === 'meeting' ? "bg-[#005da7]/10 text-[#005da7]" : "bg-[#146c2e]/10 text-[#146c2e]"
                                    )}>
                                      {item.type === 'meeting' ? 'Encontro' : 'Atividade'}
                                    </span>
                                    <span className="text-xs font-bold text-[#717783] flex items-center gap-1">
                                      <Calendar size={12} />
                                      {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-[#1a1c1c] text-lg mb-3 line-clamp-2">{item.title}</h3>
                                  <div className="flex justify-end">
                                    <StatusBadge 
                                      status={item.status as any} 
                                      readOnly 
                                      className="!text-[10px] !px-2 !py-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-[#717783] relative z-10 bg-white">
                      <div className="w-16 h-16 bg-[#f3f3f3] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={24} className="text-[#c1c7d3]" />
                      </div>
                      <p className="font-bold text-[#1a1c1c]">Nenhum evento planejado</p>
                      <p className="text-sm mt-1">Ajuste os filtros ou crie novos encontros e atividades.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'atividades-eventos' && (
            <motion.div
              key="atividades-eventos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h2 className="font-manrope font-bold text-2xl text-[#1a1c1c] mb-2">Atividades e Eventos</h2>
                <p className="text-sm text-[#717783] mb-6">Planeje momentos especiais para sua turma.</p>
                <button 
                  onClick={() => handleOpenActivityModal(null, true)}
                  className="bg-[#007AFF] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0056b3] transition-colors shadow-sm w-full sm:w-auto"
                >
                  <Plus size={16} />
                  Nova Atividade/Evento
                </button>
              </div>

              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((activity) => (
                    <div 
                      key={activity.id} 
                      onClick={() => handleOpenActivityModal(activity, false)}
                      className="bg-white rounded-3xl p-6 border border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#005da7] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                          activity.nature === 'Externa' ? "bg-[#005da7]/10 text-[#005da7]" : "bg-[#146c2e]/10 text-[#146c2e]"
                        )}>
                          <Activity size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                              activity.nature === 'Externa' ? "bg-[#e8f0fe] text-[#1a73e8]" : "bg-[#d1e9d2] text-[#146c2e]"
                            )}>
                              {activity.nature}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#f0f0f0] text-[#717783] px-2 py-0.5 rounded-md">
                              {activity.type}
                            </span>
                            {activity.nature === 'Externa' && activity.requireDeclaration && (
                              <span className="text-[10px] font-black uppercase tracking-widest bg-[#fff8e6] text-[#735c00] px-2 py-0.5 rounded-md">
                                Requer Autorização
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-[#1a1c1c]">{activity.name}</h3>
                          <p className="text-sm text-[#414751] mt-1">{activity.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-[#717783]">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(activity.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                            {activity.time && <span className="flex items-center gap-1"><Clock size={14} /> {activity.time}</span>}
                            {activity.location && <span className="flex items-center gap-1"><MapPin size={14} /> {activity.location}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
                        <button 
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="flex-none px-3 py-2 bg-[#fff0f0] text-[#ba1a1a] font-bold rounded-xl hover:bg-[#ffdad6] transition-colors flex items-center justify-center"
                          title="Excluir Atividade"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenActivityModal(activity, true);
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#f3f3f3] text-[#414751] font-bold rounded-xl hover:bg-[#e8e8e8] transition-colors text-sm"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAttendanceModal(activity, 'atividade');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#34C759] text-white font-bold rounded-xl hover:bg-[#2eb350] transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <UserCheck size={16} />
                          Chamada
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivityForPrep(activity);
                            setIsPrepModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#007AFF] text-white font-bold rounded-xl hover:bg-[#0056b3] transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Activity size={16} />
                          Planejar Preparação
                        </button>
                        {activity.nature === 'Externa' && activity.requireDeclaration && (
                          <button 
                            onClick={() => handleGenerateDeclaration(activity)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <FileText size={16} />
                            <span className="hidden sm:inline">Gerar Autorizações</span>
                            <span className="sm:hidden">Autorizações</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-black/15 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#f3f3f3] flex items-center justify-center mb-4 text-[#c1c7d3]">
                    <Activity size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1c1c]">Nenhuma atividade agendada</h3>
                  <p className="text-[#414751] max-w-xs mt-2">Clique no botão acima para criar a primeira atividade ou evento da turma.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>

      {/* Modal for New/View Meeting */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-black/15 flex flex-col items-center bg-white shrink-0">
                <button 
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 px-4 py-2 bg-[#f3f3f3] text-[#414751] font-bold rounded-xl hover:bg-[#e8e8e8] transition-all flex items-center gap-2"
                >
                  <X size={18} />
                  Fechar
                </button>

                <div className="flex flex-col items-center gap-3 mt-2">
                  <div className="w-12 h-12 rounded-full bg-[#1a73e8] text-white flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#001e40] font-manrope text-center">
                    {isEditing ? (selectedMeeting?.id ? 'Editar Encontro' : 'Novo Encontro') : 'Ficha do Encontro'}
                  </h2>
                </div>
                
                {!isEditing && selectedMeeting && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <StatusBadge 
                      status={selectedMeeting.status} 
                      onStatusChange={(s) => handleStatusChange(selectedMeeting.id, s)} 
                      size="lg"
                    />
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[#1a73e8] bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 rounded-xl font-bold transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button 
                        onClick={() => selectedMeeting && handleDeleteMeeting(selectedMeeting.id)}
                        className="flex items-center gap-2 px-4 py-2 text-[#ba1a1a] bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 rounded-xl font-bold transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8f9fa]">
                <form id="meeting-form" key={JSON.stringify(selectedMeeting)} onSubmit={handleSaveMeeting} className="space-y-8">
                  {/* Template Selection Button */}
                  {isEditing && (
                    <div className="mb-8">
                      <button 
                        type="button" 
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="w-full bg-gradient-to-r from-[#005da7] to-[#003f75] text-white hover:opacity-90 transition-all py-5 px-6 rounded-2xl font-bold flex flex-col md:flex-row items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Library size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-extrabold font-manrope">Usar Modelo da Biblioteca</h3>
                            <p className="text-sm text-white/80 font-normal">Preencha o encontro automaticamente com nossos modelos prontos.</p>
                          </div>
                        </div>
                        <div className="bg-white text-[#005da7] px-4 py-2 rounded-full text-sm font-bold shrink-0">
                          Explorar Modelos
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-3xl border border-black/15 shadow-sm">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Tema do Encontro</label>
                      <input 
                        name="tema"
                        disabled={!isEditing}
                        defaultValue={selectedMeeting?.tema}
                        className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold disabled:bg-white disabled:opacity-100"
                        placeholder="Ex: Sacramento do Batismo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Data</label>
                      <input 
                        name="data"
                        type="date"
                        disabled={!isEditing}
                        defaultValue={selectedMeeting?.data}
                        className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] font-bold disabled:bg-white disabled:opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Leitura Bíblica</label>
                      <input 
                        name="leituraBiblica"
                        disabled={!isEditing}
                        defaultValue={selectedMeeting?.leituraBiblica}
                        className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] disabled:bg-white disabled:opacity-100"
                        placeholder="Ex: João 3:1-16"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Material de Apoio</label>
                      <input 
                        name="materialApoio"
                        disabled={!isEditing}
                        defaultValue={selectedMeeting?.materialApoio}
                        className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c] disabled:bg-white disabled:opacity-100"
                        placeholder="Ex: Bíblia, Velas, Som"
                      />
                    </div>
                    {isEditing && selectedMeeting?.id && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Status</label>
                        <StatusBadge 
                          status={selectedMeeting.status} 
                          onStatusChange={(s) => handleStatusChange(selectedMeeting.id, s)} 
                          className="w-full justify-between py-4 px-4 text-sm font-bold border border-black/15"
                          position="bottom"
                        />
                      </div>
                    )}
                  </div>

                  {/* Roteiro Section */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-black/15 pb-2">
                      <h3 className="font-manrope font-bold text-xl text-[#001e40]">Roteiro do Encontro</h3>
                      {isEditing && (
                        <button 
                          type="button"
                          onClick={handleAddCatequeseRoteiroStep}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a73e8] hover:bg-[#1a73e8]/5 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Plus size={14} />
                          Adicionar Etapa
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {isEditing && selectedMeeting ? (
                        <Reorder.Group 
                          axis="y" 
                          values={selectedMeeting.roteiro} 
                          onReorder={(newOrder) => setSelectedMeeting({...selectedMeeting, roteiro: newOrder})}
                          className="space-y-4"
                        >
                          {selectedMeeting.roteiro.map((step) => (
                            <DraggableRoteiroItem 
                              key={step.id} 
                              step={step} 
                              isEditing={isEditing} 
                              onDelete={() => handleRemoveCatequeseRoteiroStep(step.id)}
                              catechists={catechists}
                            />
                          ))}
                        </Reorder.Group>
                      ) : (
                        selectedMeeting?.roteiro.map((step) => (
                          <RoteiroItem 
                            key={step.id}
                            step={step}
                            isEditing={isEditing} 
                            catechists={catechists}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  {isEditing ? (
                    <div className="pt-6 mt-8 border-t border-[#edeeef] flex justify-end gap-4">
                      <button 
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-3 text-[#414751] font-bold hover:bg-[#e8e8e8] bg-white border border-[#edeeef] rounded-xl transition-all shadow-sm"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-8 py-3 bg-[#1a73e8] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-sm shadow-[#1a73e8]/20"
                      >
                        <Save size={20} />
                        Salvar Encontro
                      </button>
                    </div>
                  ) : (
                    <div className="pt-6 mt-8 border-t border-[#edeeef] flex justify-end gap-4">
                      <button 
                        type="button"
                        onClick={handleCloseModal}
                        className="px-8 py-3 bg-white border border-[#edeeef] text-[#414751] font-bold rounded-xl hover:bg-[#f3f3f3] transition-all flex items-center gap-2 shadow-sm"
                      >
                        Fechar Encontro
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPresenting && presentationMeeting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white text-[#1a1c1c] overflow-hidden flex flex-col font-sans"
          >
            {/* Atmospheric Background (Light) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#005da7]/5 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#005da7]/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center border-b border-[#edeeef] backdrop-blur-md bg-white/80">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-[#005da7] text-white flex items-center justify-center">
                  <Presentation size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-manrope font-black tracking-tight text-[#001e40]">{presentationMeeting.tema}</h1>
                  <p className="text-[10px] font-black text-[#717783] uppercase tracking-widest">Apresentação do Encontro</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPresenting(false)}
                className="p-2 hover:bg-[#f3f3f3] rounded-full transition-all active:scale-90 text-[#414751]"
              >
                <X size={24} />
              </button>
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Side: Current Step & Timer */}
              {(() => {
                const steps = presentationMeeting.roteiro;
                const currentStep = steps[activeStepIndex];

                return (
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) => {
                      const threshold = 100;
                      if (info.offset.x > threshold && activeStepIndex > 0) {
                        const prevIndex = activeStepIndex - 1;
                        setActiveStepIndex(prevIndex);
                        setTimeLeft(parseTime(steps[prevIndex].tempo));
                        setIsTimerRunning(false);
                      } else if (info.offset.x < -threshold && activeStepIndex < steps.length - 1) {
                        const nextIndex = activeStepIndex + 1;
                        setActiveStepIndex(nextIndex);
                        setTimeLeft(parseTime(steps[nextIndex].tempo));
                        setIsTimerRunning(false);
                      }
                    }}
                    className="flex-1 p-8 md:p-12 flex flex-col items-center text-center space-y-8 cursor-grab active:cursor-grabbing"
                  >
                    {/* Topic Info Section */}
                    <div className="w-full flex-1 flex flex-col items-center pt-4 md:pt-8 pointer-events-none">
                      <motion.div
                        key={activeStepIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex flex-col items-center space-y-6 md:space-y-10"
                      >
                        {/* Smaller Label at the top */}
                        <div className="space-y-2">
                          <span className="inline-block px-4 py-1 bg-[#005da7]/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#005da7]">
                            Etapa {activeStepIndex + 1} de {steps.length}
                          </span>
                          <h2 className="text-xl md:text-2xl font-manrope font-black uppercase tracking-widest text-[#717783]">
                            {currentStep.label}
                          </h2>
                        </div>

                        {/* Larger Description in the middle */}
                        <div className="flex-1 flex items-center justify-center min-h-[200px] py-4">
                          {currentStep.descricao ? (
                            <p className="text-3xl md:text-5xl lg:text-6xl font-manrope font-black text-[#1a1c1c] max-w-4xl leading-tight">
                              &quot;{currentStep.descricao}&quot;
                            </p>
                          ) : (
                            <p className="text-2xl md:text-4xl font-manrope font-black text-[#c1c7d3] italic opacity-50">
                              Sem descrição detalhada
                            </p>
                          )}
                        </div>

                        {/* Responsible below description */}
                        <div className="pb-4">
                          <p className="text-lg md:text-xl text-[#717783] font-medium">
                            Responsável: <span className="text-[#005da7] font-bold">{currentStep.responsavel}</span>
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Visual Division */}
                    <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#edeeef] to-transparent" />

                    {/* Timer Display (At the bottom) */}
                    <div className="relative flex flex-col items-center pb-4 md:pb-8">
                      <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center rounded-full border-4 border-[#edeeef] bg-white group active:scale-95 transition-transform overflow-hidden"
                      >
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-[#f3f3f3]"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="301.59"
                            animate={{ 
                              strokeDashoffset: 301.59 * (1 - (timeLeft / (parseTime(currentStep.tempo) || 1))) 
                            }}
                            transition={{ duration: 1, ease: "linear" }}
                            className={cn(
                              "transition-colors duration-500",
                              timeLeft < 60 && timeLeft > 0 ? "text-red-500" : "text-[#005da7]"
                            )}
                          />
                        </svg>

                        <div className="relative flex flex-col items-center z-10">
                          <span className={cn(
                            "text-2xl md:text-3xl font-manrope font-black tracking-tighter transition-all duration-300",
                            timeLeft < 60 && timeLeft > 0 ? "text-red-500" : "text-[#1a1c1c]"
                          )}>
                            {formatTime(timeLeft)}
                          </span>
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#c1c7d3] mt-[-2px]">
                            {isTimerRunning ? 'Pausar' : 'Iniciar'}
                          </span>
                        </div>

                        {/* Status Overlay */}
                        <AnimatePresence>
                          {!isTimerRunning && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-[#005da7]/5 flex items-center justify-center"
                            >
                              <Play size={20} className="text-[#005da7] opacity-20" fill="currentColor" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                      
                      {/* Timer Controls (Compact) */}
                      <div className="flex items-center gap-4 mt-6">
                        <button 
                          onClick={() => {
                            if (activeStepIndex > 0) {
                              const prevIndex = activeStepIndex - 1;
                              setActiveStepIndex(prevIndex);
                              setTimeLeft(parseTime(steps[prevIndex].tempo));
                              setIsTimerRunning(false);
                            }
                          }}
                          disabled={activeStepIndex === 0 || (isTimerRunning && timeLeft > 0)}
                          className="p-2 bg-white hover:bg-[#f3f3f3] rounded-lg border border-[#edeeef] transition-all disabled:opacity-20 active:scale-90 text-[#717783]"
                        >
                          <SkipBack size={14} />
                        </button>
                        
                        <button 
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className={cn(
                            "px-5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-2",
                            isTimerRunning ? "bg-white text-[#1a1c1c] border border-[#edeeef]" : "bg-[#005da7] text-white"
                          )}
                        >
                          {isTimerRunning ? <><Pause size={12} fill="currentColor" /> Pausar</> : <><Play size={12} fill="currentColor" /> Iniciar</>}
                        </button>

                        <button 
                          onClick={() => {
                            if (activeStepIndex < steps.length - 1) {
                              const nextIndex = activeStepIndex + 1;
                              setActiveStepIndex(nextIndex);
                              setTimeLeft(parseTime(steps[nextIndex].tempo));
                              setIsTimerRunning(false);
                            }
                          }}
                          disabled={activeStepIndex === steps.length - 1 || (isTimerRunning && timeLeft > 0)}
                          className="p-2 bg-white hover:bg-[#f3f3f3] rounded-lg border border-[#edeeef] transition-all disabled:opacity-20 active:scale-90 text-[#717783]"
                        >
                          <SkipForward size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setTimeLeft(parseTime(steps[activeStepIndex].tempo));
                          setIsTimerRunning(false);
                        }}
                        className="mt-3 flex items-center gap-2 text-[#c1c7d3] hover:text-[#005da7] transition-colors text-[8px] font-black uppercase tracking-widest"
                      >
                        <RotateCcw size={8} />
                        Reiniciar Etapa
                      </button>
                    </div>

                    <p className="text-[10px] font-bold text-[#c1c7d3] uppercase tracking-[0.3em] mt-auto">
                      Arraste para o lado para trocar de etapa
                    </p>
                  </motion.div>
                );
              })()}

              {/* Right Side: Sidebar with Roteiro & Resources */}
              <div className="w-full md:w-[350px] border-l border-[#edeeef] bg-white p-8 flex flex-col gap-10 overflow-y-auto">
                {/* Meeting Info */}
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717783]">Informações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#edeeef]">
                      <div className="w-8 h-8 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center text-[#1a73e8]">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-[#717783]">Leitura Bíblica</p>
                        <p className="text-sm font-bold text-[#1a1c1c]">{presentationMeeting.leituraBiblica}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#edeeef]">
                      <div className="w-8 h-8 rounded-lg bg-[#1a73e8]/10 flex items-center justify-center text-[#1a73e8]">
                        <Library size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-[#717783]">Material</p>
                        <p className="text-sm font-bold text-[#1a1c1c]">{presentationMeeting.materialApoio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Roteiro List */}
                <div className="space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717783]">Roteiro Completo</h3>
                  <div className="space-y-2">
                    {presentationMeeting.roteiro.map((step, idx) => (
                      <button 
                        key={step.id}
                        onClick={() => {
                          setActiveStepIndex(idx);
                          setTimeLeft(parseTime(step.tempo));
                          setIsTimerRunning(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left group",
                          activeStepIndex === idx 
                            ? "bg-[#005da7] border-[#005da7]" 
                            : "bg-white border-[#edeeef] hover:bg-[#f9f9f9]"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                          activeStepIndex === idx ? "bg-white text-[#005da7]" : "bg-[#f3f3f3] text-[#717783]"
                        )}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-bold capitalize truncate text-xs",
                            activeStepIndex === idx ? "text-white" : "text-[#1a1c1c]"
                          )}>
                            {step.label}
                          </p>
                          <p className={cn(
                            "text-[8px] font-bold uppercase tracking-widest",
                            activeStepIndex === idx ? "text-white/60" : "text-[#717783]"
                          )}>
                            {step.tempo} • {step.responsavel}
                          </p>
                        </div>
                        {activeStepIndex === idx && (
                          <motion.div layoutId="active-indicator-light" className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="h-1.5 bg-[#edeeef] relative z-10">
              <motion.div 
                className="h-full bg-[#005da7]"
                initial={{ width: 0 }}
                animate={{ width: `${((activeStepIndex + 1) / presentationMeeting.roteiro.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Catequizando Registration */}
      <AnimatePresence>
        {isCatequizandoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCatequizandoModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center">
                    <Baby size={20} />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">
                    {selectedCatequizando ? 'Editar Perfil' : 'Novo Catequizando'}
                  </h2>
                </div>
                <button onClick={handleCloseCatequizandoModal} className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="flex justify-center mb-8">
                  <label className="relative group cursor-pointer block">
                    <div className="w-32 h-32 rounded-full bg-[#f3f3f3] border-4 border-white overflow-hidden flex items-center justify-center relative shadow-sm">
                      {previewPhoto ? (
                        <Image 
                          src={previewPhoto} 
                          alt="Foto do Catequizando"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Camera size={40} className="text-[#c1c7d3]" />
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-[#005da7] animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 p-2 bg-[#005da7] text-white rounded-full border-2 border-white hover:scale-110 transition-transform">
                      <Camera size={16} />
                    </div>
                    <input 
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Nome Completo</label>
                    <input 
                      id="catequizando-name"
                      defaultValue={selectedCatequizando?.name}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                      placeholder="Nome do catequizando" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Data de Nascimento</label>
                    <input 
                      type="date"
                      id="catequizando-birthdate"
                      defaultValue={selectedCatequizando?.birthDate}
                      onChange={(e) => {
                        const age = calculateAge(e.target.value);
                        const ageInput = document.getElementById('catequizando-age') as HTMLInputElement;
                        if (ageInput) ageInput.value = age.toString();
                      }}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Idade (Automático)</label>
                    <input 
                      id="catequizando-age"
                      readOnly
                      defaultValue={selectedCatequizando?.birthDate ? calculateAge(selectedCatequizando.birthDate) : ''}
                      className="w-full bg-[#eeeeee] border-none rounded-xl py-4 px-4 text-[#717783] font-bold" 
                      placeholder="0" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Nome do Responsável</label>
                    <input id="catequizando-parents" className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="Pai, Mãe ou Tutor" defaultValue={selectedCatequizando?.parents} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Telefone de Contato</label>
                    <input id="catequizando-phone" className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="(00) 00000-0000" defaultValue={selectedCatequizando?.phone} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Endereço</label>
                    <input id="catequizando-address" className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="Rua, número, bairro..." defaultValue={selectedCatequizando?.address} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Sacramentos Recebidos</label>
                  <div className="grid grid-cols-1 gap-4">
                    {['Batismo', 'Eucaristia', 'Crisma'].map((sac) => (
                      <div key={sac} className="space-y-3 p-4 bg-white rounded-2xl border border-[#edeeef]">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedSacraments.includes(sac)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSacraments([...selectedSacraments, sac]);
                              } else {
                                setSelectedSacraments(selectedSacraments.filter(s => s !== sac));
                              }
                            }}
                            className="w-5 h-5 rounded border-[#c1c7d3] text-[#005da7] focus:ring-[#005da7]" 
                          />
                          <span className="font-bold text-[#1a1c1c]">{sac}</span>
                        </label>
                        
                        {selectedSacraments.includes(sac) && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-2 border-t border-[#edeeef]"
                          >
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-[#717783]">Paróquia</label>
                              <input className="w-full bg-white border border-[#edeeef] rounded-lg py-2 px-3 text-xs" placeholder="Nome da paróquia" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-[#717783]">Data</label>
                              <input type="date" className="w-full bg-white border border-[#edeeef] rounded-lg py-2 px-3 text-xs" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Observações Médicas / Alergias</label>
                  <textarea id="catequizando-medical" className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-24 resize-none" placeholder="Informações importantes sobre a saúde do catequizando" defaultValue={selectedCatequizando?.medicalNotes} />
                </div>

                <div className="pt-6 mt-8 border-t border-[#edeeef] flex justify-between items-center">
                  <div>
                    {selectedCatequizando && (
                      <button 
                        onClick={() => handleDeleteCatequizando(selectedCatequizando.id)}
                        className="flex items-center gap-2 px-4 py-2 text-[#ba1a1a] font-bold hover:bg-[#ffdad6]/30 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                        Excluir
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {!selectedCatequizando && (
                      <button onClick={handleCloseCatequizandoModal} className="px-6 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                    )}
                    <button 
                      onClick={handleSaveCatequizando}
                      className="px-8 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <Save size={20} />
                      Salvar Cadastro
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActivityModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsActivityModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">
                    {isActivityEditing ? (activityForm.id ? 'Editar Atividade' : 'Nova Atividade') : 'Detalhes da Atividade'}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  {!isActivityEditing && activityForm.id && (
                    <StatusBadge 
                      status={activityForm.status as any} 
                      onStatusChange={(s) => {
                        const updated = { ...activityForm, status: s };
                        setActivityForm(updated);
                        setActivities(activities.map(a => a.id === activityForm.id ? updated : a));
                      }} 
                      size="lg"
                    />
                  )}
                  <button onClick={() => setIsActivityModalOpen(false)} className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Tipo</label>
                    <select 
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all"
                      value={activityForm.type}
                      onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                    >
                      <option>Celebração</option>
                      <option>Encontro de pais</option>
                      <option>Eventos Geral</option>
                      <option>Gincana</option>
                      <option>Jornada</option>
                      <option>Passeios</option>
                      <option>Retiro</option>
                      <option>Reunião com os pais</option>
                      <option>Reunião com os catequistas</option>
                      <option>Outros</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">
                      {(activityForm.type === 'Reunião com os pais' || activityForm.type === 'Reunião com os catequistas') ? 'Tema da Reunião' : 'Nome da Atividade / Evento'}
                    </label>
                    <input 
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                      placeholder="Ex: Gincana Bíblica" 
                      value={activityForm.name}
                      onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                    />
                  </div>

                  {(activityForm.type === 'Reunião com os pais' || activityForm.type === 'Reunião com os catequistas') ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Data da Reunião</label>
                        <input 
                          type="date" 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          value={activityForm.date}
                          onChange={(e) => setActivityForm({...activityForm, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Horário</label>
                        <input 
                          type="time" 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          value={activityForm.time}
                          onChange={(e) => setActivityForm({...activityForm, time: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Local</label>
                        <input 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          placeholder="Ex: Salão Paroquial" 
                          value={activityForm.location}
                          onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Objetivo</label>
                        <textarea 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-20 resize-none" 
                          placeholder="Qual o objetivo desta reunião?" 
                          value={activityForm.objective}
                          onChange={(e) => setActivityForm({...activityForm, objective: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Pautas</label>
                        <textarea 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-32 resize-none" 
                          placeholder="Liste os assuntos a serem discutidos..." 
                          value={activityForm.agendas}
                          onChange={(e) => setActivityForm({...activityForm, agendas: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Encaminhamentos</label>
                        <textarea 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-24 resize-none" 
                          placeholder="Decisões e ações a serem tomadas..." 
                          value={activityForm.followUps}
                          onChange={(e) => setActivityForm({...activityForm, followUps: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Avisos</label>
                        <textarea 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-24 resize-none" 
                          placeholder="Avisos gerais para os participantes..." 
                          value={activityForm.announcements}
                          onChange={(e) => setActivityForm({...activityForm, announcements: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Descrição</label>
                        <textarea 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-24 resize-none" 
                          placeholder="Breve descrição do que será realizado..." 
                          value={activityForm.description}
                          onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Data</label>
                        <input 
                          type="date" 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          value={activityForm.date}
                          onChange={(e) => setActivityForm({...activityForm, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Horário</label>
                        <input 
                          type="time" 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          value={activityForm.time}
                          onChange={(e) => setActivityForm({...activityForm, time: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Local</label>
                        <input 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                          placeholder="Ex: Salão Paroquial" 
                          value={activityForm.location}
                          onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Natureza da Atividade</label>
                        <select 
                          className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all"
                          onChange={(e) => {
                            setIsExternalActivity(e.target.value === 'Externa');
                            setActivityForm({...activityForm, nature: e.target.value});
                          }}
                          value={isExternalActivity ? 'Externa' : 'Interna'}
                        >
                          <option value="Interna">Interna (na Paróquia)</option>
                          <option value="Externa">Externa (fora da Paróquia)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Plano de Preparação removido daqui e movido para modal próprio */}

                {isExternalActivity && (
                  <div className="space-y-6 p-6 bg-[#fff8e6] border border-[#ffe088] rounded-2xl">
                    <h4 className="font-bold text-[#735c00] flex items-center gap-2">
                      <Info size={18} />
                      Detalhes da Atividade Externa
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#735c00]">Tipo de Condução</label>
                        <select 
                          className="w-full bg-white border border-[#ffe088] rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all text-[#1a1c1c]"
                          value={activityForm.conductionType}
                          onChange={(e) => setActivityForm({...activityForm, conductionType: e.target.value})}
                        >
                          <option>Ônibus Fretado</option>
                          <option>Transporte Público</option>
                          <option>Carro Particular (Pais/Catequistas)</option>
                          <option>A pé</option>
                          <option>Outro</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#ffe088] cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-[#c1c7d3] text-[#005da7] focus:ring-[#005da7]" 
                            checked={activityForm.requireDeclaration}
                            onChange={(e) => setActivityForm({...activityForm, requireDeclaration: e.target.checked})}
                          />
                          <div>
                            <span className="font-bold text-[#1a1c1c] block">Exigir Declaração de Participação</span>
                            <span className="text-xs text-[#717783]">Gera um documento que deve ser assinado pelos pais ou responsáveis autorizando a participação do catequizando.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Observação</label>
                  <textarea 
                    className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all h-24 resize-none" 
                    placeholder="Observações adicionais..." 
                    value={activityForm.observation}
                    onChange={(e) => setActivityForm({...activityForm, observation: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Participantes</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActivitySelectionMode('all')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold border-2 transition-all",
                        activitySelectionMode === 'all' 
                          ? "bg-[#005da7] text-white border-[#005da7]" 
                          : "bg-white text-[#414751] border-[#edeeef] hover:bg-[#f3f3f3]"
                      )}
                    >
                      Toda a Turma
                    </button>
                    <button 
                      onClick={() => setActivitySelectionMode('specific')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold border-2 transition-all",
                        activitySelectionMode === 'specific' 
                          ? "bg-[#005da7] text-white border-[#005da7]" 
                          : "bg-white text-[#414751] border-[#edeeef] hover:bg-[#f3f3f3]"
                      )}
                    >
                      Selecionar Catequizandos
                    </button>
                  </div>

                  {activitySelectionMode === 'specific' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                    >
                      {catequizandosList.map((catequizando) => (
                        <label 
                          key={catequizando.id} 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                            selectedCatequizandosForActivity.includes(catequizando.id)
                              ? "bg-[#005da7]/5 border-[#005da7]"
                              : "bg-white border-[#edeeef] hover:bg-[#f9f9f9]"
                          )}
                        >
                          <input 
                            type="checkbox"
                            checked={selectedCatequizandosForActivity.includes(catequizando.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCatequizandosForActivity([...selectedCatequizandosForActivity, catequizando.id]);
                              } else {
                                setSelectedCatequizandosForActivity(selectedCatequizandosForActivity.filter(id => id !== catequizando.id));
                              }
                            }}
                            className="w-5 h-5 rounded border-[#c1c7d3] text-[#005da7] focus:ring-[#005da7]"
                          />
                          <div className="w-8 h-8 rounded-full bg-[#eeeeee] overflow-hidden relative">
                            {catequizando.avatar ? (
                              <Image 
                                src={catequizando.avatar} 
                                alt={catequizando.name} 
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#005da7] text-white font-bold text-sm">
                                {catequizando.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-[#1a1c1c]">{catequizando.name}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="pt-6 mt-8 border-t border-[#edeeef] flex justify-end gap-4">
                  {isActivityEditing ? (
                    <>
                      <button onClick={() => setIsActivityModalOpen(false)} className="px-6 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                      <button 
                        onClick={handleSaveActivity}
                        className="px-8 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        <Save size={20} />
                        Salvar Atividade
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsActivityEditing(true)}
                      className="px-8 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <Edit2 size={20} />
                      Editar Atividade
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preparation Planning Modal */}
      <AnimatePresence>
        {isPrepModalOpen && selectedActivityForPrep && (
          <div className="fixed inset-0 z-[155] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrepModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">Planejar Preparação</h2>
                    <p className="text-xs text-[#717783] font-bold uppercase tracking-wider">{selectedActivityForPrep.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsPrepModalOpen(false)} className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Data Prevista para Preparação</label>
                    <input 
                      id="prep-date"
                      type="date" 
                      defaultValue={selectedActivityForPrep.preparationDetails?.date}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#007AFF] transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Horário</label>
                    <input 
                      id="prep-time"
                      type="time" 
                      defaultValue={selectedActivityForPrep.preparationDetails?.time}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#007AFF] transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Local da Preparação</label>
                    <input 
                      id="prep-location"
                      placeholder="Ex: Salão Paroquial ou Sala da Catequese"
                      defaultValue={selectedActivityForPrep.preparationDetails?.location}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#007AFF] transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Provisões / Ações Necessárias</label>
                    <textarea 
                      id="prep-requirements"
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#007AFF] transition-all h-40 resize-none font-medium text-sm leading-relaxed" 
                      placeholder="Liste tudo o que precisa ser feito ou providenciado:
- Comprar insumos
- Contatar palestrante
- Preparar lembrancinhas
- etc..." 
                      defaultValue={selectedActivityForPrep.preparationDetails?.requirements}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#edeeef] flex justify-end gap-4 bg-[#f9fafb]">
                <button onClick={() => setIsPrepModalOpen(false)} className="px-6 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                <button 
                  onClick={handleSavePreparation}
                  className="px-8 py-3 bg-[#007AFF] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Save size={20} />
                  Salvar Planejamento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsTemplateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex flex-col p-6 border-b border-[#edeeef] shrink-0 gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#005da7] text-white flex items-center justify-center">
                      <Library size={20} />
                    </div>
                    <h2 className="font-manrope font-bold text-2xl text-[#001e40]">Modelos da Biblioteca</h2>
                  </div>
                  <button 
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-[#717783]" />
                  </div>
                  <input 
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Pesquisar por tema, categoria ou título..."
                    className="w-full bg-[#f3f3f3] border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#005da7] transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialTemplates
                    .filter(t => 
                      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
                      t.tema.toLowerCase().includes(templateSearch.toLowerCase()) ||
                      t.category.toLowerCase().includes(templateSearch.toLowerCase())
                    )
                    .map((template) => (
                      <motion.div 
                        key={template.id}
                        whileHover={{ y: -4 }}
                        className="group bg-white border border-[#edeeef] rounded-2xl overflow-hidden hover:border-[#005da7] transition-all cursor-pointer flex flex-col"
                        onClick={() => applyTemplate(template.id)}
                      >
                        <div className="relative h-32 w-full overflow-hidden">
                          <Image 
                            src={template.image} 
                            alt={template.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-[#005da7] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                              {template.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-[#001e40] text-sm mb-1 line-clamp-1">{template.title}</h3>
                          <p className="text-[11px] text-[#414751] mb-3 line-clamp-2 flex-1">{template.tema}</p>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#edeeef]">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-[#74777f]">
                              <Clock size={12} /> {template.time}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-[#74777f]">
                              <BookOpen size={12} /> {template.leituraBiblica.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
                
                {initialTemplates.filter(t => 
                  t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  t.tema.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  t.category.toLowerCase().includes(templateSearch.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#f3f3f3] rounded-full flex items-center justify-center mx-auto mb-4 text-[#c1c7d3]">
                      <Search size={32} />
                    </div>
                    <p className="text-[#717783] font-bold">Nenhum modelo encontrado</p>
                    <p className="text-sm text-[#c1c7d3]">Tente outros termos de pesquisa.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={deleteConfig?.title || ''}
        message={deleteConfig?.message || ''}
        confirmText="Excluir"
        type="danger"
      />

      <AnimatePresence>
        {transferModalOpen && meetingToTransfer && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#1a1c1c]/40 backdrop-blur-sm" onClick={() => setTransferModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffe088] text-[#735c00] flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">
                    Transferir Encontro
                  </h2>
                </div>
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 bg-[#f8f9fa] flex flex-col gap-4">
                <p className="text-sm text-[#414751]">
                  Selecione a nova data para o encontro <strong>{meetingToTransfer.tema}</strong>.
                </p>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#717783] uppercase tracking-wider">Nova Data</label>
                  <input 
                    type="date" 
                    value={transferDate}
                    onChange={(e) => handleTransferDateChange(e.target.value)}
                    className="bg-white border border-[#edeeef] rounded-xl px-4 py-3 text-sm font-bold text-[#1a1c1c] focus:ring-2 focus:ring-[#007AFF] outline-none shadow-sm w-full"
                  />
                </div>

                {conflictMeeting && (
                  <div className="mt-2 p-4 bg-[#fff8e6] border border-[#ffe088] rounded-xl flex flex-col gap-2">
                    <p className="text-sm text-[#735c00] font-bold">
                      Atenção: Já existe um encontro nesta data!
                    </p>
                    <p className="text-xs text-[#735c00]">
                      <strong>{conflictMeeting.tema}</strong> está marcado para {new Date(conflictMeeting.data + 'T12:00:00').toLocaleDateString('pt-BR')}.
                    </p>
                    <p className="text-xs text-[#735c00] mt-1">
                      O que deseja fazer com o encontro existente?
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[#edeeef] flex justify-end gap-2 bg-white flex-wrap">
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all"
                >
                  Voltar
                </button>
                {conflictMeeting ? (
                  <>
                    <button 
                      onClick={() => confirmTransfer('cancel')}
                      className="px-4 py-2 bg-[#ba1a1a] text-white font-bold rounded-xl hover:bg-[#93000a] transition-all shadow-sm"
                    >
                      Cancelar Existente
                    </button>
                    <button 
                      onClick={() => confirmTransfer('reschedule')}
                      className="px-4 py-2 bg-[#007AFF] text-white font-bold rounded-xl hover:bg-[#0056b3] transition-all shadow-sm"
                    >
                      Remanejar Existente
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => confirmTransfer('normal')}
                    className="px-6 py-2 bg-[#007AFF] text-white font-bold rounded-xl hover:bg-[#0056b3] transition-all shadow-sm"
                  >
                    Confirmar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />

      {/* Declaration Modal */}
      <AnimatePresence>
        {isDeclarationModalOpen && selectedActivityForDeclaration && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 print:p-0 print:bg-white">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeclarationModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm print:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl print:shadow-none print:max-h-none print:rounded-none"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005da7] text-white flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">Autorização de Participação</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrintDeclaration}
                    className="px-4 py-2 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-colors flex items-center gap-2"
                  >
                    <Printer size={18} />
                    Imprimir
                  </button>
                  <button onClick={() => setIsDeclarationModalOpen(false)} className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 print:p-0 print:overflow-visible bg-[#f8f9fa] print:bg-white">
                {/* Document Preview */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#edeeef] max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1a1c1c] uppercase tracking-wide">Autorização para Atividade Externa</h1>
                    <p className="text-[#717783] mt-2">Paróquia / Comunidade</p>
                  </div>

                  <div className="space-y-6 text-[#1a1c1c] leading-relaxed text-justify">
                    <p>
                      Eu, abaixo assinado(a), responsável legal pelo(a) catequizando(a) <span className="inline-block w-64 border-b border-black"></span>, 
                      autorizo sua participação na atividade <strong>{selectedActivityForDeclaration.name}</strong>, que será realizada no dia <strong>{new Date(selectedActivityForDeclaration.date + 'T12:00:00').toLocaleDateString('pt-BR')}</strong>, 
                      {selectedActivityForDeclaration.time && <span> às <strong>{selectedActivityForDeclaration.time}</strong>,</span>} no local <strong>{selectedActivityForDeclaration.location || '____________________'}</strong>.
                    </p>

                    <p>
                      Estou ciente de que o transporte será realizado por meio de <strong>{selectedActivityForDeclaration.conductionType}</strong>.
                    </p>

                    {selectedActivityForDeclaration.observation && (
                      <div className="p-4 bg-[#f8f9fa] border border-[#edeeef] rounded-lg">
                        <p className="text-sm font-bold mb-1">Observações da Coordenação:</p>
                        <p className="text-sm">{selectedActivityForDeclaration.observation}</p>
                      </div>
                    )}

                    <div className="pt-8">
                      <p className="mb-4">Em caso de emergência, contatar:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#717783]">Nome</p>
                          <div className="border-b border-black h-6"></div>
                        </div>
                        <div>
                          <p className="text-sm text-[#717783]">Telefone</p>
                          <div className="border-b border-black h-6"></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-16 flex flex-col items-center">
                      <div className="w-80 border-t border-black mb-2"></div>
                      <p className="text-sm font-bold">Assinatura do Responsável</p>
                      <p className="text-sm text-[#717783] mt-4">Data: ___/___/______</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl font-bold flex items-center gap-3",
              toast.type === 'success' ? "bg-[#005da7] text-white" : "bg-[#ba1a1a] text-white"
            )}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {isAttendanceModalOpen && attendanceEvent && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAttendanceModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#34C759] text-white flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#001e40] font-manrope">Chamada / Presença</h2>
                    <p className="text-xs text-[#717783] font-bold uppercase tracking-wider">{attendanceEvent.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsAttendanceModalOpen(false)} className="p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 no-scrollbar">
                {catequizandosList.map((catequizando) => (
                  <div key={catequizando.id} className="bg-white p-4 rounded-2xl border border-[#edeeef] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#eeeeee] overflow-hidden relative border border-[#edeeef]">
                          {catequizando.avatar ? (
                            <Image src={catequizando.avatar} alt={catequizando.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#005da7] text-white font-bold text-sm">
                              {catequizando.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[#1a1c1c]">{catequizando.name}</span>
                      </div>
                      
                      <div className="flex bg-[#f3f3f3] p-1 rounded-xl">
                        <button 
                          onClick={() => setCurrentAttendance({
                            ...currentAttendance,
                            [catequizando.id]: { ...currentAttendance[catequizando.id], status: 'Presente' }
                          })}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            currentAttendance[catequizando.id]?.status === 'Presente' ? "bg-white shadow-sm text-green-600" : "text-[#717783]"
                          )}
                        >
                          Presente
                        </button>
                        <button 
                          onClick={() => setCurrentAttendance({
                            ...currentAttendance,
                            [catequizando.id]: { ...currentAttendance[catequizando.id], status: 'Faltante' }
                          })}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            currentAttendance[catequizando.id]?.status === 'Faltante' ? "bg-white shadow-sm text-red-600" : "text-[#717783]"
                          )}
                        >
                          Faltante
                        </button>
                      </div>
                    </div>

                    {currentAttendance[catequizando.id]?.status === 'Faltante' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <input 
                          placeholder="Justificativa da falta (opcional)"
                          value={currentAttendance[catequizando.id]?.justification || ''}
                          onChange={(e) => setCurrentAttendance({
                            ...currentAttendance,
                            [catequizando.id]: { ...currentAttendance[catequizando.id], justification: e.target.value }
                          })}
                          className="w-full bg-[#f8f9fa] border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-red-200 transition-all shadow-inner"
                        />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-[#edeeef] flex justify-end gap-3 bg-[#f9fafb]">
                <button onClick={() => setIsAttendanceModalOpen(false)} className="px-6 py-2.5 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                <button 
                  onClick={handleSaveAttendance}
                  className="px-8 py-2.5 bg-[#34C759] text-white font-bold rounded-xl hover:bg-[#2eb350] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Save size={18} />
                  Salvar Chamada
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MeetingCard({ meeting, index = 0, onView, onPresent, onAttendance, onDelete, onStatusChange, viewMode = 'grid' }: { 
  meeting: Meeting, 
  index?: number,
  onView: () => void, 
  onPresent: () => void, 
  onAttendance: () => void,
  onDelete: () => void,
  onStatusChange: (status: MeetingStatus) => void,
  viewMode?: 'grid' | 'list'
}) {
  const meetingColors = [
    { bg: "bg-[#f0f7ff]", border: "border-[#cce3ff]" },
    { bg: "bg-[#fff0f5]", border: "border-[#ffccdd]" },
    { bg: "bg-[#f0fff4]", border: "border-[#c1e6d1]" },
    { bg: "bg-[#fff9e6]", border: "border-[#ffe6b3]" }
  ];
  const colorClass = meetingColors[index % meetingColors.length];

  if (viewMode === 'list') {
    return (
      <motion.div 
        whileHover={{ x: 4 }}
        className={cn(
          "rounded-[24px] border flex flex-col sm:flex-row overflow-hidden transition-all group relative shadow-sm hover:shadow-md",
          colorClass.bg, colorClass.border
        )}
      >
        {/* Date Section (Top on mobile, left on desktop) */}
        <div className="relative sm:w-48 flex-shrink-0 z-10 sm:border-r border-b sm:border-b-0 border-black/10 p-4 flex sm:flex-col items-center justify-between sm:justify-center">
          <span className="text-sm font-extrabold uppercase tracking-wider text-[#005da7]">
            {new Date(meeting.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <StatusBadge 
            status={meeting.status} 
            onStatusChange={onStatusChange} 
            readOnly 
            className="sm:hidden !text-[10px] !px-2 !py-1"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden z-10">
          <div className="flex justify-between items-start gap-4">
            <div className="overflow-hidden flex-1 text-left">
              <h3 className="text-lg font-extrabold font-manrope text-[#1a1c1c] leading-tight line-clamp-1 mb-1">
                {meeting.tema}
              </h3>
              <p className="text-xs text-[#414751] font-bold flex items-center justify-start gap-1.5 truncate">
                <BookOpen size={14} className="text-[#007AFF] flex-shrink-0" /> <span className="truncate">{meeting.leituraBiblica || 'Sem leitura'}</span>
              </p>
            </div>
            
            {/* Context Actions (Edit/Delete) */}
            <div className="flex gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute sm:relative top-3 right-3 sm:top-0 sm:right-0 bg-white/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-1 sm:p-0 rounded-2xl">
              <button 
                onClick={(e) => { e.stopPropagation(); onView(); }} 
                className="p-2 sm:p-2 bg-white sm:hover:bg-[#f3f3f3] shadow-sm sm:shadow-none rounded-xl sm:rounded-full text-[#717783] transition-all border border-[#edeeef]" 
                title="Editar"
              >
                <Edit2 size={16} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                className="p-2 sm:p-2 bg-white hover:bg-red-50 shadow-sm sm:shadow-none rounded-xl sm:rounded-full text-red-500 transition-all border border-[#edeeef]" 
                title="Excluir"
              >
                <Trash2 size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 mt-auto pt-2 sm:pt-0">
             <button onClick={onView} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2 bg-white sm:bg-[#34C759] border border-[#edeeef] sm:border-transparent hover:bg-[#f8f9fa] sm:hover:bg-[#2eb350] rounded-xl sm:rounded-xl text-xs font-bold uppercase tracking-wider text-[#1a1c1c] sm:text-white transition-all active:scale-95 shadow-sm">
               <Eye size={16} /> <span className="sm:hidden md:inline">Abrir</span>
             </button>
            <button onClick={onAttendance} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2 bg-white sm:bg-[#007AFF] border border-[#edeeef] sm:border-transparent hover:bg-[#f8f9fa] sm:hover:bg-[#0056b3] rounded-xl sm:rounded-xl text-xs font-bold uppercase tracking-wider text-[#1a1c1c] sm:text-white transition-all active:scale-95 shadow-sm">
              <UserCheck size={16} /> <span className="sm:hidden md:inline">Chamada</span>
            </button>
            <button onClick={onPresent} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2 bg-white sm:bg-gray-600 border border-[#edeeef] sm:border-transparent hover:bg-[#f8f9fa] sm:hover:bg-gray-700 rounded-xl sm:rounded-xl text-xs font-bold uppercase tracking-wider text-[#1a1c1c] sm:text-white transition-all active:scale-95 shadow-sm">
              <Presentation size={16} /> <span className="sm:hidden md:inline">Apresentar</span>
            </button>
            <div className="hidden sm:block">
              <ReportButton 
                variant="chip"
                iconOnly
                type="turmas"
                reportType="ficha-encontro"
                reportTitle={meeting.tema}
                moduleName="Turmas"
                data={meeting}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -1 }}
      className={cn(
        "rounded-[32px] border flex flex-col overflow-hidden transition-all group relative shadow-sm hover:shadow-md",
         colorClass.bg, colorClass.border
      )}
    >
      <div className="relative p-6 w-full z-10 border-b border-black/10 flex flex-col items-center justify-center text-center">
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <ReportButton 
            variant="chip"
            iconOnly
            type="turmas"
            reportType="ficha-encontro"
            reportTitle={meeting.tema}
            moduleName="Turmas"
            data={meeting}
          />
          <button 
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="p-1.5 bg-white hover:bg-[#f3f3f3] rounded-full text-[#717783] transition-all border border-[#edeeef]"
            title="Editar"
          >
            <Edit2 size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 bg-white hover:bg-red-50 rounded-full text-red-500 transition-all border border-[#edeeef]"
            title="Excluir"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <span className="text-sm font-extrabold uppercase tracking-wider text-[#005da7] mb-2 block">
          {new Date(meeting.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <h3 className="text-lg font-extrabold font-manrope text-[#1a1c1c] leading-tight line-clamp-2 transition-colors">
          {meeting.tema}
        </h3>
      </div>

      <div className="p-4 flex flex-col flex-1 z-10">
        <div className="flex-1 flex flex-col items-center text-center">
          <p className="text-sm text-[#414751] font-bold flex items-center justify-center gap-1.5 mb-3">
            <BookOpen size={16} className="text-[#007AFF]" /> {meeting.leituraBiblica || 'Sem leitura'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#c1c7d3]/30">
           <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[#edeeef] hover:bg-[#f8f9fa] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#1a1c1c] transition-all active:scale-95 shadow-sm"><Eye size={16} /> <span className="hidden sm:inline">Abrir</span></button>
          <button onClick={onAttendance} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#007AFF] text-white hover:bg-[#0056b3] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"><UserCheck size={16} /> <span className="hidden sm:inline">Chamada</span></button>
          <button onClick={onPresent} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-600 text-white hover:bg-gray-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"><Presentation size={16} /> <span className="hidden sm:inline">Telão</span></button>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status, onStatusChange, className, position = 'bottom', readOnly = false, size = 'sm' }: { 
  status: MeetingStatus, 
  onStatusChange?: (status: MeetingStatus) => void,
  className?: string,
  position?: 'top' | 'bottom',
  readOnly?: boolean,
  size?: 'sm' | 'lg'
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusBadgeColors = {
    'Planejado': 'bg-[#e8f0fe] text-[#1a73e8]',
    'Realizado': 'bg-[#d1e9d2] text-[#146c2e]',
    'Transferido': 'bg-[#ffe088] text-[#735c00]',
    'Cancelado': 'bg-[#ffdad6] text-[#ba1a1a]'
  };

  if (readOnly) {
    return (
      <div className={cn(
        "font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-1 w-fit",
        size === 'lg' ? "text-xs px-4 py-2" : "text-[9px] px-3 py-1.5",
        statusBadgeColors[status],
        className
      )}>
        {status}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-1",
          size === 'lg' ? "text-xs px-4 py-2" : "text-[9px] px-3 py-1.5",
          statusBadgeColors[status],
          className
        )}
      >
        {status}
        <ChevronDown size={size === 'lg' ? 14 : 10} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[110]" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: position === 'bottom' ? 5 : -5 }}
              className={cn(
                "absolute right-0 bg-white rounded-xl border border-[#edeeef] p-1 z-[120] min-w-[140px] shadow-xl",
                position === 'bottom' ? "top-full mt-2" : "bottom-full mb-2"
              )}
            >
              {(['Planejado', 'Realizado', 'Transferido', 'Cancelado'] as MeetingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStatusChange) onStatusChange(s);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                    status === s ? statusBadgeColors[s] : "text-[#717783] hover:bg-black/5"
                  )}
                >
                  {s}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DraggableRoteiroItem({ step, isEditing, onDelete, catechists }: { step: CatequeseRoteiroStep, isEditing: boolean, onDelete?: () => void, catechists: any[] }) {
  const controls = useDragControls();
  
  return (
    <Reorder.Item 
      value={step} 
      dragListener={false} 
      dragControls={controls}
      className="touch-none"
    >
      <RoteiroItem step={step} isEditing={isEditing} dragControls={controls} onDelete={onDelete} catechists={catechists} />
    </Reorder.Item>
  );
}

function RoteiroItem({ step, isEditing, dragControls, onDelete, catechists }: { step: CatequeseRoteiroStep, isEditing: boolean, dragControls?: any, onDelete?: () => void, catechists: any[] }) {
  const { id, label, tipo, tempo, responsavel, descricao } = step;
  const hasTypeSelect = id === 'oracaoInicial';
  const isCustom = id.startsWith('custom-');

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#edeeef] shadow-sm space-y-5 relative group/item w-full transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1">
          {isEditing && (
            <div 
              onPointerDown={(e) => dragControls?.start(e)}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/5 rounded transition-colors text-[#717783] touch-none"
            >
              <GripVertical size={16} />
            </div>
          )}
          {isEditing && isCustom ? (
            <input 
              name={`roteiro-${id}-label`}
              defaultValue={label}
              className="font-bold text-[#001e40] bg-transparent border-none p-0 focus:ring-0 w-full"
              placeholder="Nome da etapa"
            />
          ) : (
            <span className="font-bold text-[#001e40]">{label}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasTypeSelect && isEditing && (
            <select 
              name={`roteiro-${id}-tipo`}
              defaultValue={tipo || 'Oração básica'}
              className="text-xs font-bold bg-white border border-[#edeeef] rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#005da7]"
            >
              <option>Oração básica</option>
              <option>Oficio Divino</option>
              <option>Leitura Orante</option>
              <option>Celebrativo</option>
              <option>louvor</option>
            </select>
          )}
          {hasTypeSelect && !isEditing && (
            <span className="text-xs font-bold text-[#005da7] bg-[#d4e3ff] px-2 py-1 rounded-lg">
              {tipo || 'Oração básica'}
            </span>
          )}
          {isEditing && (
            <button 
              type="button"
              onClick={onDelete}
              className="p-1.5 text-[#717783] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-all"
              title="Remover etapa"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          name={`roteiro-${id}-descricao`}
          defaultValue={descricao}
          placeholder="Descrição do que será feito nesta etapa..."
          className="w-full bg-[#f8f9fa] border border-[#edeeef] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#005da7] transition-all min-h-[100px] resize-none"
        />
      ) : (
        descricao && (
          <p className="text-sm text-[#414751] bg-[#f8f9fa] p-5 rounded-xl border border-[#edeeef] leading-relaxed">
            {descricao}
          </p>
        )
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        {/* Tempo Balloon */}
        <div className="flex items-center gap-2 bg-[#f8f9fa] px-4 py-2.5 rounded-xl border border-[#edeeef]">
          <Clock size={16} className="text-[#005da7]" />
          {isEditing ? (
            <input 
              name={`roteiro-${id}-tempo`}
              className="w-20 text-sm font-bold border-none p-0 focus:ring-0 bg-transparent" 
              placeholder="Tempo" 
              defaultValue={tempo}
            />
          ) : (
            <span className="text-sm font-bold text-[#1a1c1c]">{tempo || '--'}</span>
          )}
        </div>

        {/* Catequista Balloon */}
        <div className="flex items-center gap-2 bg-[#f8f9fa] px-4 py-2.5 rounded-xl border border-[#edeeef]">
          <UserCheck size={16} className="text-[#005da7]" />
          {isEditing ? (
            <select 
              name={`roteiro-${id}-responsavel`}
              className="text-sm font-bold border-none p-0 focus:ring-0 bg-transparent"
              defaultValue={responsavel}
            >
              <option value="">Responsável</option>
              {catechists.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          ) : (
            <span className="text-sm font-bold text-[#1a1c1c]">{responsavel || '--'}</span>
          )}
        </div>
      </div>
    </div>
  );
}

