'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Filter, Camera, X, Trash2, Calendar, Tag, CheckCircle, Upload, Loader2, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { createClient } from '@/utils/supabase/client';
import { ReportButton } from '@/components/report-button';

const categories = ['Todos', 'Encontro', 'Atividades', 'Retiro', 'Celebrações', 'Diversas'];

interface MuralPhoto {
  id: string;
  user_id: string;
  title: string;
  date: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function Mural() {
  const [photos, setPhotos] = useState<MuralPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MuralPhoto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load user and photos from Supabase
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.id) {
        setCurrentUserId(session.user.id);
      }
      await fetchPhotos();
    }
    init();
  }, []);

  const fetchPhotos = async () => {
    setIsLoadingPhotos(true);
    const { data, error } = await supabase
      .from('mural_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      showToast('Erro ao carregar fotos.', 'error');
    } else {
      setPhotos(data as MuralPhoto[]);
    }
    setIsLoadingPhotos(false);
  };

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchesFilter = filter === 'Todos' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [photos, filter, searchTerm]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsAddModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUserId || !selectedFile) {
      showToast('Erro: nenhum arquivo selecionado ou usuário não autenticado.', 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;

    try {
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mural-images')
        .upload(fileName, selectedFile, { contentType: selectedFile.type });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mural-images')
        .getPublicUrl(uploadData.path);

      // Save metadata to database
      const { data: photoData, error: dbError } = await supabase
        .from('mural_photos')
        .insert({
          user_id: currentUserId,
          title,
          date,
          category,
          image_url: publicUrl,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setPhotos(prev => [photoData as MuralPhoto, ...prev]);
      setIsAddModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
      showToast('Foto adicionada ao mural!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      showToast('Erro ao fazer upload. Tente novamente.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    const photo = photos.find(p => p.id === photoToDelete);
    if (!photo) return;

    // Optimistic update
    setPhotos(prev => prev.filter(p => p.id !== photoToDelete));
    setIsDeleteModalOpen(false);
    setSelectedPhoto(null);

    try {
      // Extract storage path from URL
      const url = new URL(photo.image_url);
      const pathParts = url.pathname.split('/mural-images/');
      if (pathParts.length > 1) {
        await supabase.storage.from('mural-images').remove([pathParts[1]]);
      }

      const { error } = await supabase
        .from('mural_photos')
        .delete()
        .eq('id', photoToDelete);

      if (error) throw error;
      showToast('Foto removida do mural.');
    } catch (err) {
      console.error('Error deleting photo:', err);
      // Revert
      fetchPhotos();
      showToast('Erro ao remover foto.', 'error');
    } finally {
      setPhotoToDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-32 bg-[#f8f9fa]">
      <TopBar 
        title="Mural" 
        actions={
          <ReportButton 
            moduleName="Mural"
            reportTitle="Portfolio de Atividades"
            reportSubtitle="Memórias e registros da catequese"
            type="mural"
            data={filteredPhotos}
            columns={[
              { key: 'title', label: 'Evento / Descrição' },
              { key: 'date', label: 'Data', render: (val) => formatDate(val) },
              { key: 'category', label: 'Categoria' }
            ]}
          />
        }
      />

      {/* Hidden Inputs */}
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold uppercase tracking-widest text-[#0060ac] mb-2 block">
              Nossas Memórias
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black tracking-tight text-[#001e40] leading-tight font-manrope">
              Mural de Fotos da Turma
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-[#43474f] text-lg leading-relaxed">
              Reviva os momentos sagrados e as conexões construídas em nossa jornada de fé.
            </motion.p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 md:flex-none bg-white border border-black/15 text-[#191c1d] px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#f3f4f5] transition-all"
              >
                <Upload size={20} />
                Importar
              </button>
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`flex-1 md:flex-none border px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                  isSearchVisible
                    ? 'bg-[#001e40] border-[#001e40] text-white'
                    : 'bg-white border-black/15 text-[#191c1d] hover:bg-[#f3f4f5]'
                }`}
              >
                <Filter size={20} />
                {isSearchVisible ? 'Fechar' : 'Filtrar'}
              </button>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.section
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Filter size={20} className="text-[#74777f] group-focus-within:text-[#0060ac] transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por título ou categoria..."
                  className="w-full bg-white border border-black/15 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-[#0060ac] focus:border-transparent transition-all text-lg"
                  autoFocus
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-6 flex items-center text-[#74777f] hover:text-[#ba1a1a] transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <section className="mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#ffe16d] text-[#221b00] scale-105'
                    : 'bg-white border border-black/15 text-[#43474f] hover:bg-[#f3f4f5]'
                }`}
              >
                {cat === 'Todos' ? 'Todos os Momentos' : cat}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoadingPhotos ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="text-[#005da7] animate-spin" />
            <p className="text-[#717783]">Carregando mural...</p>
          </div>
        ) : (
          <>
            {/* Masonry Photo Grid */}
            <section className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo) => (
                  <motion.div
                    layout
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedPhoto(photo)}
                    className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-white cursor-pointer border border-black/15"
                  >
                    <Image
                      src={photo.image_url}
                      alt={photo.title}
                      width={400}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/90 via-[#001e40]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ffe16d] mb-1">{photo.category}</span>
                      <p className="text-white font-bold text-lg leading-tight">{photo.title}</p>
                      <p className="text-white/70 text-xs mt-1">{formatDate(photo.date)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>

            {filteredPhotos.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-[#edeeef] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageOff size={32} className="text-[#74777f]" />
                </div>
                <h3 className="text-xl font-bold text-[#001e40]">
                  {photos.length === 0 ? 'Nenhuma foto no mural ainda' : 'Nenhuma foto encontrada'}
                </h3>
                <p className="text-[#74777f] mt-1">
                  {photos.length === 0 ? 'Use o botão abaixo para adicionar a primeira foto!' : 'Tente mudar o filtro.'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-gradient-to-tr from-[#001e40] to-[#0060ac] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 group"
      >
        <Camera size={32} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedPhoto(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden"
            >
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
                <Image src={selectedPhoto.image_url} alt={selectedPhoto.title} fill className="object-contain" referrerPolicy="no-referrer" />
                <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors md:hidden">
                  <X size={24} />
                </button>
              </div>

              <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0060ac] mb-1 block">{selectedPhoto.category}</span>
                      <h3 className="text-2xl font-black text-[#001e40] leading-tight font-manrope">{selectedPhoto.title}</h3>
                    </div>
                    <button onClick={() => setSelectedPhoto(null)} className="hidden md:flex p-2 text-[#414751] hover:bg-[#f3f3f3] rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#43474f]">
                      <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-[#0060ac]">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#74777f]">Data do Registro</p>
                        <p className="font-bold">{formatDate(selectedPhoto.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[#43474f]">
                      <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] flex items-center justify-center text-[#0060ac]">
                        <Tag size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#74777f]">Categoria</p>
                        <p className="font-bold">{selectedPhoto.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {currentUserId === selectedPhoto.user_id && (
                  <div className="mt-8 pt-6 border-t border-black/15">
                    <button
                      onClick={() => { setPhotoToDelete(selectedPhoto.id); setIsDeleteModalOpen(true); }}
                      className="w-full py-4 rounded-2xl bg-[#fff0f0] text-[#ba1a1a] font-bold flex items-center justify-center gap-2 hover:bg-[#ffdad6] transition-colors"
                    >
                      <Trash2 size={20} />
                      Excluir do Mural
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { if (!isUploading) { setIsAddModalOpen(false); setPreviewImage(null); setSelectedFile(null); } }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/15 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#001e40]">Adicionar Nova Foto</h3>
                <button
                  onClick={() => { if (!isUploading) { setIsAddModalOpen(false); setPreviewImage(null); setSelectedFile(null); } }}
                  className="p-2 hover:bg-[#f3f3f3] rounded-full transition-colors"
                >
                  <X size={24} className="text-[#414751]" />
                </button>
              </div>

              <form onSubmit={handleAddPhoto} className="p-8 space-y-6">
                {previewImage && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#f3f4f5]">
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreviewImage(null); setSelectedFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {!previewImage && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-2xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#005da7] hover:bg-[#f8f9fa] transition-all"
                  >
                    <Upload size={32} className="text-[#74787f]" />
                    <p className="text-sm font-bold text-[#74787f]">Clique para selecionar uma foto</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Título da Foto</label>
                  <input
                    name="title"
                    required
                    placeholder="Ex: Encontro de Oração"
                    className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Data</label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#414751]">Categoria</label>
                    <select name="category" className="w-full bg-[#f3f3f3] border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#005da7] transition-all appearance-none">
                      {categories.filter(c => c !== 'Todos').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="w-full py-4 bg-gradient-to-tr from-[#001e40] to-[#0060ac] text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <><Loader2 size={20} className="animate-spin" /> Enviando...</>
                    ) : (
                      'Publicar no Mural'
                    )}
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
        onConfirm={handleDeletePhoto}
        title="Excluir Foto"
        message="Tem certeza que deseja remover esta foto do mural? Esta ação não pode ser desfeita."
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-[#001e40] text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} className="text-[#ffe16d]" /> : <X size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
