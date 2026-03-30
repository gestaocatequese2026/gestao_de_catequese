'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import {
  Search, Book, ArrowLeft,
  BookOpen, Share2, Copy,
  BookmarkCheck, Filter, X, Loader2, Trash2,
  Download, WifiOff, CheckCircle2, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────
// ESTRUTURA DA BÍBLIA CATÓLICA (73 livros)
// ─────────────────────────────────────────────
const OLD_TESTAMENT = [
  { name: 'Gênesis', abbrev: 'gn', chapters: 50 },
  { name: 'Êxodo', abbrev: 'ex', chapters: 40 },
  { name: 'Levítico', abbrev: 'lv', chapters: 27 },
  { name: 'Números', abbrev: 'nm', chapters: 36 },
  { name: 'Deuteronômio', abbrev: 'dt', chapters: 34 },
  { name: 'Josué', abbrev: 'js', chapters: 24 },
  { name: 'Juízes', abbrev: 'jz', chapters: 21 },
  { name: 'Rute', abbrev: 'rt', chapters: 4 },
  { name: '1 Samuel', abbrev: '1sm', chapters: 31 },
  { name: '2 Samuel', abbrev: '2sm', chapters: 24 },
  { name: '1 Reis', abbrev: '1rs', chapters: 22 },
  { name: '2 Reis', abbrev: '2rs', chapters: 25 },
  { name: '1 Crônicas', abbrev: '1cr', chapters: 29 },
  { name: '2 Crônicas', abbrev: '2cr', chapters: 36 },
  { name: 'Esdras', abbrev: 'ed', chapters: 10 },
  { name: 'Neemias', abbrev: 'ne', chapters: 13 },
  { name: 'Tobias', abbrev: 'tb', chapters: 14 },
  { name: 'Judite', abbrev: 'jt', chapters: 16 },
  { name: 'Ester', abbrev: 'et', chapters: 10 },
  { name: '1 Macabeus', abbrev: '1mc', chapters: 16 },
  { name: '2 Macabeus', abbrev: '2mc', chapters: 15 },
  { name: 'Jó', abbrev: 'jó', chapters: 42 },
  { name: 'Salmos', abbrev: 'sl', chapters: 150 },
  { name: 'Provérbios', abbrev: 'pv', chapters: 31 },
  { name: 'Eclesiastes', abbrev: 'ec', chapters: 12 },
  { name: 'Cântico dos Cânticos', abbrev: 'ct', chapters: 8 },
  { name: 'Sabedoria', abbrev: 'sb', chapters: 19 },
  { name: 'Eclesiástico', abbrev: 'eclo', chapters: 51 },
  { name: 'Isaías', abbrev: 'is', chapters: 66 },
  { name: 'Jeremias', abbrev: 'jr', chapters: 52 },
  { name: 'Lamentações', abbrev: 'lm', chapters: 5 },
  { name: 'Baruc', abbrev: 'br', chapters: 6 },
  { name: 'Ezequiel', abbrev: 'ez', chapters: 48 },
  { name: 'Daniel', abbrev: 'dn', chapters: 14 },
  { name: 'Oseias', abbrev: 'os', chapters: 14 },
  { name: 'Joel', abbrev: 'jl', chapters: 4 },
  { name: 'Amós', abbrev: 'am', chapters: 9 },
  { name: 'Abdias', abbrev: 'ab', chapters: 1 },
  { name: 'Jonas', abbrev: 'jn', chapters: 4 },
  { name: 'Miqueias', abbrev: 'mq', chapters: 7 },
  { name: 'Naum', abbrev: 'na', chapters: 3 },
  { name: 'Habacuc', abbrev: 'hc', chapters: 3 },
  { name: 'Sofonias', abbrev: 'sf', chapters: 3 },
  { name: 'Ageu', abbrev: 'ag', chapters: 2 },
  { name: 'Zacarias', abbrev: 'zc', chapters: 14 },
  { name: 'Malaquias', abbrev: 'ml', chapters: 3 },
];

const NEW_TESTAMENT = [
  { name: 'Mateus', abbrev: 'mt', chapters: 28 },
  { name: 'Marcos', abbrev: 'mc', chapters: 16 },
  { name: 'Lucas', abbrev: 'lc', chapters: 24 },
  { name: 'João', abbrev: 'jo', chapters: 21 },
  { name: 'Atos dos Apóstolos', abbrev: 'at', chapters: 28 },
  { name: 'Romanos', abbrev: 'rm', chapters: 16 },
  { name: '1 Coríntios', abbrev: '1co', chapters: 16 },
  { name: '2 Coríntios', abbrev: '2co', chapters: 13 },
  { name: 'Gálatas', abbrev: 'gl', chapters: 6 },
  { name: 'Efésios', abbrev: 'ef', chapters: 6 },
  { name: 'Filipenses', abbrev: 'fp', chapters: 4 },
  { name: 'Colossenses', abbrev: 'cl', chapters: 4 },
  { name: '1 Tessalonicenses', abbrev: '1ts', chapters: 5 },
  { name: '2 Tessalonicenses', abbrev: '2ts', chapters: 3 },
  { name: '1 Timóteo', abbrev: '1tm', chapters: 6 },
  { name: '2 Timóteo', abbrev: '2tm', chapters: 4 },
  { name: 'Tito', abbrev: 'tt', chapters: 3 },
  { name: 'Filémon', abbrev: 'fm', chapters: 1 },
  { name: 'Hebreus', abbrev: 'hb', chapters: 13 },
  { name: 'Tiago', abbrev: 'tg', chapters: 5 },
  { name: '1 Pedro', abbrev: '1pe', chapters: 5 },
  { name: '2 Pedro', abbrev: '2pe', chapters: 3 },
  { name: '1 João', abbrev: '1jo', chapters: 5 },
  { name: '2 João', abbrev: '2jo', chapters: 1 },
  { name: '3 João', abbrev: '3jo', chapters: 1 },
  { name: 'Judas', abbrev: 'jd', chapters: 1 },
  { name: 'Apocalipse', abbrev: 'ap', chapters: 22 },
];

const ALL_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT];

interface Verse {
  number: number;
  text: string;
}

// ─────────────────────────────────────────────
// CACHE KEYS
// ─────────────────────────────────────────────
const lsKey = (book: string, chapter: number) => `bible_v2_${book}_${chapter}`;

export default function BibliaOnline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'books' | 'chapters' | 'verses' | 'search'>('books');
  const [searchResults, setSearchResults] = useState<{ reference: string; text: string }[]>([]);
  const [isSearchingTheme, setIsSearchingTheme] = useState(false);
  const [cachedChaptersLocal, setCachedChaptersLocal] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isDownloadingBook, setIsDownloadingBook] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const supabase = createClient();

  // ─── Online/Offline detection ───
  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  // ─── Load local cache manifest ───
  useEffect(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('bible_v2_')) keys.push(key.replace('bible_v2_', ''));
    }
    setCachedChaptersLocal(keys);
  }, []);

  const isChapterCached = (book: string, chapter: number) =>
    cachedChaptersLocal.includes(`${book}_${chapter}`);

  const filteredBooksOT = OLD_TESTAMENT.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBooksNT = NEW_TESTAMENT.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveToLocalCache = (book: string, chapter: number, data: Verse[]) => {
    const key = lsKey(book, chapter);
    localStorage.setItem(key, JSON.stringify(data));
    setCachedChaptersLocal(prev => {
      const entry = `${book}_${chapter}`;
      return prev.includes(entry) ? prev : [...prev, entry];
    });
  };

  // ─────────────────────────────────────────────
  // FETCH VERSES — Strategy: localStorage → Supabase → Gemini AI
  // ─────────────────────────────────────────────
  const fetchVerses = useCallback(async (book: string, chapter: number) => {
    setIsLoading(true);
    setError(null);
    setViewMode('verses');
    setVerses([]);

    // 1. Check localStorage (works offline)
    const localData = localStorage.getItem(lsKey(book, chapter));
    if (localData) {
      try {
        setVerses(JSON.parse(localData));
        setIsLoading(false);
        return;
      } catch { /* ignore */ }
    }

    // 2. Need internet for Supabase or Gemini
    if (!navigator.onLine) {
      setError('Este capítulo não está disponível offline. Conecte-se à internet para baixá-lo.');
      setIsLoading(false);
      return;
    }

    // 3. Check Supabase shared cache
    try {
      const { data: cached } = await supabase
        .from('bible_chapters')
        .select('verses')
        .eq('book', book)
        .eq('chapter', chapter)
        .maybeSingle();

      if (cached?.verses) {
        const verseData = cached.verses as Verse[];
        setVerses(verseData);
        saveToLocalCache(book, chapter, verseData);
        setIsLoading(false);
        return;
      }
    } catch { /* continue to Gemini */ }

    // 4. Fetch from Gemini AI (CNBB translation)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Forneça o texto completo e fiel do capítulo ${chapter} do livro de ${book} da Bíblia Sagrada, seguindo a tradução da CNBB (Conferência Nacional dos Bispos do Brasil). Retorne APENAS um JSON válido no formato: { "verses": [{ "number": 1, "text": "texto do versículo exatamente como na CNBB" }, ...] }. Não inclua explicações, markdown, ou qualquer texto fora do JSON.`,
        config: { responseMimeType: 'application/json' },
      });

      const raw = response.text?.trim() || '{}';
      const data = JSON.parse(raw);

      if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        setVerses(data.verses);
        saveToLocalCache(book, chapter, data.verses);

        // Save to Supabase in background (shared cache)
        supabase.from('bible_chapters').insert({ book, chapter, verses: data.verses }).then();
      } else {
        throw new Error('Resposta inválida da IA.');
      }
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar este capítulo.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // ─────────────────────────────────────────────
  // DOWNLOAD ENTIRE BOOK FOR OFFLINE
  // ─────────────────────────────────────────────
  const downloadBookForOffline = async (bookName: string) => {
    const book = ALL_BOOKS.find(b => b.name === bookName);
    if (!book || !navigator.onLine) return;

    setIsDownloadingBook(true);
    setDownloadProgress(0);

    for (let ch = 1; ch <= book.chapters; ch++) {
      if (!isChapterCached(bookName, ch)) {
        // Check Supabase first
        const { data: cached } = await supabase
          .from('bible_chapters')
          .select('verses')
          .eq('book', bookName)
          .eq('chapter', ch)
          .maybeSingle();

        if (cached?.verses) {
          saveToLocalCache(bookName, ch, cached.verses as Verse[]);
        } else {
          // Fetch from Gemini
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
            const response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: `Forneça o texto completo do capítulo ${ch} de ${bookName} da Bíblia (tradução CNBB). Retorne APENAS JSON: { "verses": [{ "number": 1, "text": "..." }] }`,
              config: { responseMimeType: 'application/json' },
            });

            const data = JSON.parse(response.text?.trim() || '{}');
            if (data.verses) {
              saveToLocalCache(bookName, ch, data.verses);
              supabase.from('bible_chapters').insert({ book: bookName, chapter: ch, verses: data.verses }).then();
            }
          } catch { /* skip on error */ }
        }
      }
      setDownloadProgress(Math.round((ch / book.chapters) * 100));
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }

    setIsDownloadingBook(false);
    setDownloadProgress(0);
  };

  const handleThemeSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingTheme(true);
    setViewMode('search');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Encontre 5 versículos bíblicos da tradução CNBB relacionados ao tema: "${searchQuery}". Retorne APENAS JSON: { "results": [{ "reference": "Livro Cap:Versículo", "text": "..." }] }`,
        config: { responseMimeType: 'application/json' },
      });

      const data = JSON.parse(response.text?.trim() || '{}');
      if (data.results) setSearchResults(data.results);
    } catch { /* ignore */ } finally {
      setIsSearchingTheme(false);
    }
  };

  const copyChapter = () => {
    const text = verses.map(v => `${v.number} ${v.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const goBack = () => {
    if (viewMode === 'verses') { setViewMode('chapters'); setVerses([]); }
    else if (viewMode === 'chapters') { setViewMode('books'); setSelectedBook(null); }
    else if (viewMode === 'search') { setViewMode('books'); setSearchResults([]); }
  };

  const clearLocalCache = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('bible_v2_')) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setCachedChaptersLocal([]);
  };

  const currentBook = ALL_BOOKS.find(b => b.name === selectedBook);
  const cachedChaptersCount = cachedChaptersLocal.length;

  return (
    <div className="min-h-screen pb-32 bg-[#f8f9fa]">
      <TopBar />

      <main className="pt-24 px-6 max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              {viewMode !== 'books' && (
                <button onClick={goBack} className="p-2 hover:bg-[#edeeef] rounded-full transition-colors text-[#005da7]">
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="font-manrope font-extrabold text-3xl text-[#005da7] tracking-tight">
                {viewMode === 'books' && 'Bíblia Católica'}
                {viewMode === 'chapters' && selectedBook}
                {viewMode === 'verses' && `${selectedBook} ${selectedChapter}`}
                {viewMode === 'search' && 'Resultados'}
              </h2>
            </div>

            {/* Status & Cache controls */}
            <div className="flex items-center gap-2">
              {/* Online/Offline badge */}
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold',
                isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
              )}>
                {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {viewMode === 'books' && cachedChaptersCount > 0 && (
                <button
                  onClick={clearLocalCache}
                  className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                  Cache ({cachedChaptersCount})
                </button>
              )}
            </div>
          </div>

          <p className="text-[#717783] font-plus-jakarta text-sm">
            {viewMode === 'books' && `Tradução CNBB · ${cachedChaptersCount > 0 ? `${cachedChaptersCount} capítulos offline` : 'Explore as Sagradas Escrituras'}`}
            {viewMode === 'chapters' && 'Selecione o capítulo'}
            {viewMode === 'verses' && 'Leitura do capítulo'}
            {viewMode === 'search' && `Versículos sobre "${searchQuery}"`}
          </p>
        </div>

        {/* Search Bar */}
        {viewMode === 'books' && (
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-[#717783]" />
            </div>
            <input
              type="text"
              placeholder="Pesquise um livro ou tema bíblico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleThemeSearch()}
              className="w-full bg-white border border-black/15 rounded-2xl py-4 pl-12 pr-16 text-[#001e40] focus:ring-2 focus:ring-[#005da7] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleThemeSearch}
                disabled={!isOnline}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#005da7] text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                Buscar
              </button>
            )}
          </div>
        )}

        {/* Chapter Download Banner */}
        {viewMode === 'chapters' && selectedBook && isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#d4e3ff] rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Download size={20} className="text-[#005da7] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#005da7]">Baixar livro completo para offline</p>
                <p className="text-xs text-[#005da7]/70">
                  {currentBook && isChapterCached(selectedBook, 1) && isChapterCached(selectedBook, currentBook.chapters)
                    ? '✓ Livro completo disponível offline'
                    : 'Todos os capítulos serão salvos no seu dispositivo'}
                </p>
              </div>
            </div>
            {isDownloadingBook ? (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-24 bg-[#005da7]/20 rounded-full h-2">
                  <div className="bg-[#005da7] h-2 rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                </div>
                <span className="text-xs font-bold text-[#005da7]">{downloadProgress}%</span>
              </div>
            ) : (
              <button
                onClick={() => selectedBook && downloadBookForOffline(selectedBook)}
                className="shrink-0 bg-[#005da7] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#004a87] transition-colors"
              >
                Baixar
              </button>
            )}
          </motion.div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">

            {/* BOOKS LIST */}
            {viewMode === 'books' && (
              <motion.div key="books" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {filteredBooksOT.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#717783] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Filter size={14} />
                      Antigo Testamento ({filteredBooksOT.length} livros)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredBooksOT.map((book) => {
                        const firstCached = isChapterCached(book.name, 1);
                        return (
                          <button
                            key={book.name}
                            onClick={() => { setSelectedBook(book.name); setViewMode('chapters'); setSearchQuery(''); }}
                            className="bg-white p-4 rounded-xl border border-black/15 text-left hover:border-[#005da7] transition-all group relative"
                          >
                            {firstCached && (
                              <span className="absolute top-2 right-2">
                                <BookmarkCheck size={12} className="text-[#005da7]" />
                              </span>
                            )}
                            <p className="font-bold text-[#001e40] group-hover:text-[#005da7] transition-colors pr-4">{book.name}</p>
                            <p className="text-[10px] text-[#717783] uppercase">{book.chapters} capítulos</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredBooksNT.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#717783] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Filter size={14} />
                      Novo Testamento ({filteredBooksNT.length} livros)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredBooksNT.map((book) => {
                        const firstCached = isChapterCached(book.name, 1);
                        return (
                          <button
                            key={book.name}
                            onClick={() => { setSelectedBook(book.name); setViewMode('chapters'); setSearchQuery(''); }}
                            className="bg-white p-4 rounded-xl border border-black/15 text-left hover:border-[#005da7] transition-all group relative"
                          >
                            {firstCached && (
                              <span className="absolute top-2 right-2">
                                <BookmarkCheck size={12} className="text-[#005da7]" />
                              </span>
                            )}
                            <p className="font-bold text-[#001e40] group-hover:text-[#005da7] transition-colors pr-4">{book.name}</p>
                            <p className="text-[10px] text-[#717783] uppercase">{book.chapters} capítulos</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHAPTERS GRID */}
            {viewMode === 'chapters' && (
              <motion.div key="chapters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {Array.from({ length: currentBook?.chapters || 0 }, (_, i) => i + 1).map((chapter) => {
                  const cached = isChapterCached(selectedBook!, chapter);
                  return (
                    <button
                      key={chapter}
                      onClick={() => { setSelectedChapter(chapter); fetchVerses(selectedBook!, chapter); }}
                      className={cn(
                        'aspect-square bg-white flex flex-col items-center justify-center rounded-xl border font-bold text-[#001e40] hover:bg-[#005da7] hover:text-white hover:border-[#005da7] transition-all relative',
                        cached ? 'border-[#005da7]/40 bg-[#f0f5ff]' : 'border-black/15'
                      )}
                    >
                      {chapter}
                      {cached && (
                        <div className="absolute top-1 right-1">
                          <BookmarkCheck size={9} className="text-[#005da7]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* VERSES VIEW */}
            {viewMode === 'verses' && (
              <motion.div key="verses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl p-6 md:p-8 border border-black/15 relative">
                {/* Offline badge */}
                {selectedBook && selectedChapter && isChapterCached(selectedBook, selectedChapter) && (
                  <div className="absolute top-4 right-6 flex items-center gap-1.5 text-[10px] font-bold text-[#005da7] bg-[#d4e3ff] px-3 py-1 rounded-full">
                    <BookmarkCheck size={12} />
                    Offline
                  </div>
                )}

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="text-[#005da7] animate-spin" />
                    <p className="text-[#717783] animate-pulse">Buscando escrituras sagradas...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-2">
                      <WifiOff size={28} />
                    </div>
                    <p className="text-[#414751] font-bold">{error}</p>
                    {isOnline && (
                      <button
                        onClick={() => fetchVerses(selectedBook!, selectedChapter!)}
                        className="mt-2 px-6 py-3 bg-[#005da7] text-white rounded-xl font-bold active:scale-95 transition-transform"
                      >
                        Tentar Novamente
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {verses.map((v) => (
                      <div key={v.number} className="flex gap-4 group">
                        <span className="text-[#005da7] font-bold text-xs mt-1.5 shrink-0 w-6 text-right">{v.number}</span>
                        <p className="text-[#414751] leading-relaxed text-base md:text-lg">{v.text}</p>
                      </div>
                    ))}

                    {verses.length > 0 && (
                      <div className="pt-8 border-t border-dashed border-black/15 flex justify-center gap-3 flex-wrap">
                        <button
                          onClick={copyChapter}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f3f3f3] text-[#414751] text-sm font-bold hover:bg-[#edeeef] transition-colors"
                        >
                          {copySuccess ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                          {copySuccess ? 'Copiado!' : 'Copiar Capítulo'}
                        </button>
                        {selectedBook && selectedChapter && !isChapterCached(selectedBook, selectedChapter) && isOnline && (
                          <button
                            onClick={() => saveToLocalCache(selectedBook, selectedChapter, verses)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4e3ff] text-[#005da7] text-sm font-bold hover:bg-[#c1d6ff] transition-colors"
                          >
                            <Download size={16} />
                            Salvar Offline
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* SEARCH RESULTS */}
            {viewMode === 'search' && (
              <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {isSearchingTheme ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="text-[#005da7] animate-spin" />
                    <p className="text-[#717783] animate-pulse">Pesquisando temas nas Escrituras...</p>
                  </div>
                ) : (
                  searchResults.map((result, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-black/15 hover:border-[#005da7] transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#005da7] bg-[#d4e3ff] px-3 py-1 rounded-full">{result.reference}</span>
                      </div>
                      <p className="text-[#414751] italic leading-relaxed">&quot;{result.text}&quot;</p>
                    </div>
                  ))
                )}

                {!isSearchingTheme && searchResults.length === 0 && (
                  <div className="text-center py-20">
                    <BookOpen size={48} className="mx-auto text-[#edeeef] mb-4" />
                    <p className="text-[#717783]">Nenhum resultado encontrado.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
