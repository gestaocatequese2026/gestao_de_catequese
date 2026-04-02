'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { 
  Save, X, Plus, Mail, Phone, 
  Calendar, Camera, Loader2,
  Edit2, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { createClient } from '@/utils/supabase/client';

export default function CadastroCatequistas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [catechistToDelete, setCatechistToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [catechists, setCatechists] = useState<any[]>([]);
  const [editingCatechist, setEditingCatechist] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);

  // Photo state
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selfieInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        fetchCatechists();
        const { data } = await supabase.from('communities').select('*').order('name');
        if (data) setCommunities(data);
      }
    }
    init();
  }, []);

  const fetchCatechists = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('catechists')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) {
      setCatechists(data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        birthDate: c.birth_date,
        role: c.role,
        address: c.address,
        observations: c.observations,
        status: c.status,
        community_id: c.community_id,
        photo: c.photo_url || null
      })));
    }
    setLoading(false);
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
    const fileName = `${uid}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, photoFile, { contentType: photoFile.type, upsert: true });
    if (error) { console.error('Upload error:', error); return null; }
    const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleDelete = (id: string) => {
    setCatechistToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (catechistToDelete) {
      await supabase.from('catechists').delete().eq('id', catechistToDelete);
      setCatechists(prev => prev.filter(c => c.id !== catechistToDelete));
      setCatechistToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    
    // Upload photo if a new one was selected
    let photoUrl = editingCatechist?.photo || null;
    if (photoFile) {
      const uploaded = await uploadPhoto(userId);
      if (uploaded) photoUrl = uploaded;
    }

    const catechistData = {
      user_id: userId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      birth_date: formData.get('birthDate') as string || null,
      role: formData.get('role') as string,
      address: formData.get('address') as string,
      observations: formData.get('observations') as string,
      community_id: formData.get('community_id') as string || null,
      status: 'Ativo',
      photo_url: photoUrl
    };

    let result;
    if (editingCatechist) {
      result = await supabase.from('catechists').update(catechistData).eq('id', editingCatechist.id);
    } else {
      result = await supabase.from('catechists').insert([catechistData]);
    }

    setIsUploading(false);
    if (!result.error) {
      fetchCatechists();
      setIsModalOpen(false);
      setEditingCatechist(null);
      setPreviewPhoto(null);
      setPhotoFile(null);
    } else {
      console.error('Error saving catechist:', result.error);
      alert('Erro ao salvar catequista: ' + result.error.message);
    }
  };

  const openEditModal = (cat: any) => {
    setEditingCatechist(cat);
    setPreviewPhoto(cat.photo || null);
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingCatechist(null);
    setPreviewPhoto(null);
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-32 bg-[#f8f9fa]">
      <TopBar title="Cadastro de Catequistas" />


      <main className="max-w-7xl mx-auto px-6 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#001e40] font-manrope">Catequistas</h2>
            <p className="text-[#414751]">Gerencie a equipe de evangelizadores da paróquia.</p>
          </div>
          <button 
            onClick={openNewModal}
            className="bg-[#005da7] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={20} />
            Novo Catequista
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={36} className="animate-spin text-[#005da7]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catechists.map((cat) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-[#edeeef] shadow-sm flex flex-col gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f3f3f3] overflow-hidden border-2 border-[#005da7]/10 relative shrink-0 flex items-center justify-center">
                    {cat.photo ? (
                      <Image 
                        src={cat.photo} 
                        alt={cat.name} 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-2xl font-black text-[#005da7]">{cat.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-[#1a1c1c] truncate">{cat.name}</h3>
                    <span className="text-xs font-bold text-[#005da7] bg-[#d4e3ff] px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1">{cat.role}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-[#414751] bg-[#f8f9fa] p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#005da7] shrink-0" />
                    <span className="truncate">
                      {cat.birthDate ? new Date(cat.birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : '--'} 
                      {cat.birthDate && ` (${calculateAge(cat.birthDate)} anos)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#005da7] shrink-0" />
                    <span className="truncate">{cat.email || '--'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#005da7] shrink-0" />
                    <span className="truncate">{cat.phone || '--'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-[#edeeef]">
                  <Link 
                    href={`/cadastros/catequistas/${cat.id}`}
                    className="flex-1 bg-[#005da7]/10 text-[#005da7] py-2 rounded-xl font-bold text-sm hover:bg-[#005da7]/20 transition-colors text-center"
                  >
                    Ver Ficha Completa
                  </Link>
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="p-2 bg-[#f3f3f3] text-[#414751] hover:bg-[#e8e8e8] hover:text-[#005da7] rounded-xl transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 bg-[#ffdad6]/30 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
            {catechists.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-[#717783]">
                Nenhum catequista cadastrado.
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isUploading) setIsModalOpen(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#edeeef] flex justify-between items-center bg-[#f9f9f9] shrink-0">
                <h2 className="text-xl font-black text-[#001e40] font-manrope">
                  {editingCatechist ? 'Editar Catequista' : 'Novo Catequista'}
                </h2>
                <button onClick={() => { if (!isUploading) setIsModalOpen(false); }} className="p-2 hover:bg-[#eeeeee] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                
                {/* ── Photo capture (front camera / selfie) ── */}
                <div className="flex flex-col items-center gap-3">
                  <label className="relative group w-28 h-28 rounded-full bg-gradient-to-br from-[#005da7]/10 to-[#005da7]/20 border-2 border-dashed border-[#005da7]/40 overflow-hidden flex items-center justify-center hover:border-[#005da7] transition-all cursor-pointer">
                    {previewPhoto ? (
                      <Image src={previewPhoto} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-[#005da7]">
                        <Camera size={28} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Selfie</span>
                      </div>
                    )}
                    {/* overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  <p className="text-[10px] text-[#717783] font-semibold">Clique para tirar selfie com a câmera frontal</p>
                  {previewPhoto && (
                    <button
                      type="button"
                      onClick={() => { setPreviewPhoto(null); setPhotoFile(null); }}
                      className="text-[10px] font-bold text-[#ba1a1a] hover:underline"
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Nome Completo *</label>
                    <input name="name" defaultValue={editingCatechist?.name} required className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="Ex: Maria Helena Silva" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">E-mail</label>
                    <input name="email" type="email" defaultValue={editingCatechist?.email} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Telefone / WhatsApp</label>
                    <input name="phone" defaultValue={editingCatechist?.phone} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Data de Nascimento</label>
                    <input 
                      name="birthDate"
                      type="date" 
                      defaultValue={editingCatechist?.birthDate}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Serviço / Função</label>
                    <select name="role" defaultValue={editingCatechist?.role || 'Catequista'} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all">
                      <option value="Catequista">Catequista</option>
                      <option value="Coordenador(a)">Coordenador(a)</option>
                      <option value="Auxiliar">Auxiliar</option>
                      <option value="Palestrante">Palestrante</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Comunidade</label>
                    <select name="community_id" defaultValue={editingCatechist?.community_id || ''} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all">
                      <option value="">Nenhuma / Paróquia Sede</option>
                      {communities.map(comm => (
                        <option key={comm.id} value={comm.id}>{comm.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Endereço Residencial</label>
                  <input name="address" defaultValue={editingCatechist?.address} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all" placeholder="Rua, número, bairro..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717783]">Observações / Formação</label>
                  <textarea name="observations" defaultValue={editingCatechist?.observations} className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all min-h-[100px]" placeholder="Descreva a formação teológica ou experiência..." />
                </div>

                <div className="pt-6 mt-8 border-t border-[#edeeef] flex justify-end gap-4">
                  <button type="button" onClick={() => { if (!isUploading) setIsModalOpen(false); }} className="px-6 py-3 text-[#414751] font-bold hover:bg-[#f3f3f3] rounded-xl transition-all">Cancelar</button>
                  <button type="submit" disabled={isUploading} className="px-8 py-3 bg-[#005da7] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60">
                    {isUploading ? <><Loader2 size={18} className="animate-spin" /> Salvando...</> : <><Save size={20} /> Salvar Cadastro</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Catequista"
        message="Tem certeza que deseja excluir este catequista? Esta ação removerá o acesso e o cadastro permanentemente."
        confirmText="Excluir"
        type="danger"
      />

      <BottomNav />
    </div>
  );
}
