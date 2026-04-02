'use client';

import React, { useState, useMemo } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Search, Filter, Clock, X, BookOpen, Users, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CatequeseTemplate, initialTemplates } from '@/lib/templates';
import { ReportButton } from '@/components/report-button';

const CATEGORIES = ['Todos', 'Querigma', 'Jesus Cristo', 'Sacramentos', 'Mandamentos', 'Liturgia', 'Nossa Senhora', 'Bíblia', 'Orações', 'Doutrina Social', 'Catequese de Adultos', 'Catequese de Jovens', 'Espírito Santo', 'Santidade'];
const PUBLICO = ['Todos', 'Crianças', 'Jovens', 'Adultos'];

const AUDIENCE_COLOR: Record<string, string> = {
  Crianças: 'bg-yellow-100 text-yellow-800',
  Jovens: 'bg-blue-100 text-blue-800',
  Adultos: 'bg-purple-100 text-purple-800',
  Todos: 'bg-green-100 text-green-700',
};

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-[#001e40] mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('— ')) {
        const content = line.slice(2).replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${t}</strong>`);
        return <li key={i} className="ml-4 text-[#414751]" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (line.match(/^\d+\./)) {
        const content = line.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${t}</strong>`);
        return <li key={i} className="ml-4 text-[#414751] list-decimal" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (line.trim() === '') return <br key={i} />;
      const html = line.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${t}</strong>`);
      return <p key={i} className="text-[#414751] leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
    });
}

export default function Biblioteca() {
  const [selectedTemplate, setSelectedTemplate] = useState<CatequeseTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activePublico, setActivePublico] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return initialTemplates.filter(t => {
      const matchCat = activeCategory === 'Todos' || t.category === activeCategory;
      const matchPub = activePublico === 'Todos' || t.publicoAlvo === activePublico || t.publicoAlvo === 'Todos';
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tema.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchPub && matchSearch;
    });
  }, [activeCategory, activePublico, search]);

  const grouped = useMemo(() => {
    const map: Record<string, CatequeseTemplate[]> = {};
    filtered.forEach(t => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen pb-32 bg-[#f8f9fa]">
      <TopBar 
        title="Biblioteca" 
        actions={
          <ReportButton 
            moduleName="Biblioteca"
            reportTitle="Catálogo de Encontros"
            reportSubtitle="Fichas de apoio e fundamentações"
            type="biblioteca"
            data={filtered}
            columns={[
              { key: 'title', label: 'Título do Encontro' },
              { key: 'category', label: 'Categoria' },
              { key: 'publicoAlvo', label: 'Público' },
              { key: 'tema', label: 'Tema Central' }
            ]}
          />
        }
      />
      <main className="max-w-7xl mx-auto px-6 pt-24 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#001e40] tracking-tight">Fichas de Encontro</h2>
          <p className="text-[#717783] mt-1">Textos de apoio e fundamentações para os encontros de catequese.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-[24px] border border-black/5 shadow-sm">
          <div className="relative w-full max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717783]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por tema ou título..."
              className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#005da7] transition-all"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                isFilterOpen || activeCategory !== 'Todos' || activePublico !== 'Todos'
                  ? "bg-[#005da7] text-white shadow-md"
                  : "bg-[#f8f9fa] text-[#414751] hover:bg-[#edeeef]"
              )}
            >
              <Filter size={18} />
              Filtros
              {(activeCategory !== 'Todos' || activePublico !== 'Todos') && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 z-[40]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[320px] md:w-[450px] bg-white rounded-3xl shadow-2xl border border-black/10 p-6 z-[50] space-y-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-[#001e40] uppercase tracking-widest text-xs">Filtrar Biblioteca</h4>
                      <button 
                        onClick={() => {
                          setActiveCategory('Todos');
                          setActivePublico('Todos');
                        }}
                        className="text-[10px] font-black text-[#005da7] uppercase tracking-widest hover:underline"
                      >
                        Limpar Tudo
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#717783] uppercase tracking-widest">Categoria</label>
                      <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                              activeCategory === cat 
                                ? "bg-[#001e40] text-white border-[#001e40]" 
                                : "bg-white border-black/10 text-[#43474f] hover:bg-[#f3f4f5]"
                            )}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5">
                      <label className="text-[10px] font-black text-[#717783] uppercase tracking-widest">Público Alvo</label>
                      <div className="flex gap-2 flex-wrap">
                        {PUBLICO.map(p => (
                          <button key={p} onClick={() => setActivePublico(p)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                              activePublico === p 
                                ? "bg-yellow-400 text-[#221b00] border-yellow-400 shadow-sm" 
                                : "bg-white border-black/10 text-[#43474f] hover:bg-[#f3f4f5]"
                            )}>
                            <Users size={12} className="inline mr-1" />{p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-[#717783] font-medium">{filtered.length} fichas encontradas</p>

        {/* Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-[#cdced4] mb-3" />
            <p className="text-[#717783]">Nenhuma ficha encontrada.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <section key={category}>
                <h3 className="font-extrabold text-xl text-[#001e40] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#ffe16d] rounded-full inline-block" />
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedTemplate(item)}
                      className="bg-white rounded-2xl overflow-hidden border border-black/10 cursor-pointer group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-4">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${AUDIENCE_COLOR[item.publicoAlvo] || 'bg-gray-100 text-gray-600'}`}>
                          {item.publicoAlvo}
                        </span>
                        <h4 className="font-bold text-[#001e40] mt-2 text-sm leading-tight line-clamp-2">{item.title}</h4>
                        <div className="flex items-center gap-1 mt-2 text-xs text-[#717783]">
                          <Clock size={11} /><span>{item.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header image */}
              <div className="relative h-48 shrink-0">
                <Image src={selectedTemplate.image} alt={selectedTemplate.title} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001e40] via-[#001e40]/40 to-transparent" />
                <button onClick={() => setSelectedTemplate(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${AUDIENCE_COLOR[selectedTemplate.publicoAlvo]}`}>
                    {selectedTemplate.publicoAlvo}
                  </span>
                  <h2 className="text-white font-manrope font-bold text-2xl mt-1 leading-tight">{selectedTemplate.title}</h2>
                  <p className="text-white/70 text-xs">{selectedTemplate.category} · {selectedTemplate.time}</p>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Meta info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Tema', value: selectedTemplate.tema },
                    { label: 'Leitura Bíblica', value: selectedTemplate.leituraBiblica },
                    { 
                      label: 'Material de Apoio', 
                      value: typeof selectedTemplate.materialApoio === 'string' 
                        ? selectedTemplate.materialApoio 
                        : selectedTemplate.materialApoio.map(m => m.label).join(', ') 
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#f3f4f5] rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#717783] mb-1">{label}</p>
                      <p className="text-sm font-semibold text-[#1a1c1c]">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Texto Explicativo */}
                <div>
                  <h3 className="font-manrope font-bold text-lg text-[#001e40] mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#005da7]" />
                    Texto Explicativo e Fundamentações
                  </h3>
                  <div className="bg-[#f8faff] border border-[#d4e3ff] rounded-2xl p-5 space-y-1 text-sm">
                    {renderMarkdown(selectedTemplate.textoExplicativo)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
