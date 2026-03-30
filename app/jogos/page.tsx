'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { 
  Gamepad2, Trophy, Users, HelpCircle, UserCheck, 
  Dices, Sparkles, ChevronRight, Play, RotateCcw,
  Plus, Trash2, X, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type GameType = 'sorteio' | 'quiz' | 'perguntas' | 'quem-sou-eu' | 'outros' | null;

interface GameCard {
  id: GameType;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgLight: string;
}

const games: GameCard[] = [
  { 
    id: 'sorteio', 
    title: 'Sorteio de Nomes', 
    description: 'Sorteie nomes de catequizandos, pais ou catequistas de forma aleatória.',
    icon: Dices,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50'
  },
  { 
    id: 'quiz', 
    title: 'Quiz Bíblico', 
    description: 'Desafie o conhecimento bíblico com perguntas de múltipla escolha.',
    icon: Trophy,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50'
  },
  { 
    id: 'perguntas', 
    title: 'Perguntas e Respostas', 
    description: 'Dinâmica clássica para revisar os temas da catequese.',
    icon: HelpCircle,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50'
  },
  { 
    id: 'quem-sou-eu', 
    title: 'Quem sou eu Bíblico', 
    description: 'Adivinhe o personagem bíblico através de dicas e pistas.',
    icon: UserCheck,
    color: 'text-purple-600',
    bgLight: 'bg-purple-50'
  },
  { 
    id: 'outros', 
    title: 'Outros Jogos', 
    description: 'Mais dinâmicas e recreações para seus encontros.',
    icon: Sparkles,
    color: 'text-rose-600',
    bgLight: 'bg-rose-50'
  }
];

export default function JogosPage() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-24 font-plus-jakarta">
      <TopBar title="Jogos e Recreação" />
      
      <main className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Gamepad2 size={120} />
                </div>
                <div className="relative z-10">
                  <h2 className="font-manrope font-black text-3xl text-[#001e40] mb-2 tracking-tight">
                    Diversão e Aprendizado
                  </h2>
                  <p className="text-[#414751] font-medium max-w-md">
                    Explore dinâmicas e jogos criados especialmente para tornar seus encontros de catequese mais envolventes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveGame(game.id)}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/15 flex items-start gap-6 text-left group transition-all hover:shadow-md"
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors", game.bgLight, game.color)}>
                      <game.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-manrope font-extrabold text-xl text-[#001e40]">{game.title}</h3>
                        <ChevronRight size={20} className="text-[#c1c7d3] group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-[#717783] leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setActiveGame(null)}
                className="flex items-center gap-2 text-[#005da7] font-bold text-sm hover:underline mb-4"
              >
                <ChevronRight size={16} className="rotate-180" />
                Voltar para Jogos
              </button>

              {activeGame === 'sorteio' && <SorteioGame />}
              {activeGame === 'quiz' && <QuizBiblico />}
              {activeGame === 'perguntas' && <PerguntasERespostas />}
              {activeGame === 'quem-sou-eu' && <QuemSouEu />}
              {activeGame === 'outros' && <OutrosJogos />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}

import { useAppStore } from '@/lib/store';

function SorteioGame() {
  const { classes } = useAppStore();
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    if (!classId) return;

    const savedStudents = localStorage.getItem(`studentsList_${classId}`);
    if (savedStudents) {
      try {
        const students = JSON.parse(savedStudents);
        const studentNames = students.map((s: any) => s.name);
        setNames(studentNames);
      } catch (e) {
        console.error('Error loading students', e);
      }
    } else {
      setNames([]);
    }
  };

  const addName = () => {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const drawWinner = () => {
    if (names.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setWinner(names[randomIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  const reset = () => {
    setWinner(null);
    setIsSpinning(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Dices size={24} />
          </div>
          <div>
            <h2 className="font-manrope font-black text-2xl text-[#001e40]">Sorteio de Nomes</h2>
            <p className="text-sm text-[#717783]">Adicione os nomes ou carregue de uma turma para realizar o sorteio.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {classes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#414751] mb-2">Carregar nomes da turma:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => handleClassSelect(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-black/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005da7]/20"
                >
                  <option value="">Selecione uma turma...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addName()}
                placeholder="Nome do catequizando..."
                className="flex-1 bg-[#f9f9f9] border border-black/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005da7]/20"
              />
              <button 
                onClick={addName}
                className="bg-[#005da7] text-white p-3 rounded-xl hover:bg-[#004a86] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="bg-[#f9f9f9] rounded-2xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto space-y-2 border border-black/15">
              {names.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <Users size={40} className="mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">Lista Vazia</p>
                </div>
              ) : (
                names.map((name, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-black/15 flex items-center justify-between group">
                    <span className="text-sm font-bold text-[#414751]">{name}</span>
                    <button 
                      onClick={() => removeName(i)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-[#717783] px-2">
              <span>Total: {names.length} nomes</span>
              {names.length > 0 && (
                <button onClick={() => setNames([])} className="text-red-500 hover:underline">Limpar Tudo</button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#f9f9f9] rounded-[2rem] border border-black/15 p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.div 
                  key="spinning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-4 border-t-[#005da7] border-r-transparent border-b-transparent border-l-transparent mb-6"
                  />
                  <p className="font-manrope font-black text-xl text-[#005da7] animate-pulse">Sorteando...</p>
                </motion.div>
              ) : winner ? (
                <motion.div 
                  key="winner"
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-6 shadow-lg shadow-amber-200/50">
                    <Trophy size={40} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#717783] mb-2">O sorteado é:</p>
                  <h3 className="font-manrope font-black text-4xl text-[#001e40] mb-8">{winner}</h3>
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 bg-[#005da7] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#005da7]/20 hover:bg-[#004a86] transition-all active:scale-95"
                  >
                    <RotateCcw size={20} />
                    Novo Sorteio
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-black/15">
                    <Dices size={48} className="text-[#c1c7d3]" />
                  </div>
                  <p className="text-[#717783] text-sm max-w-[200px] mb-8">
                    {names.length < 2 ? 'Adicione pelo menos 2 nomes para começar.' : 'Tudo pronto! Clique no botão para sortear.'}
                  </p>
                  <button 
                    disabled={names.length < 2}
                    onClick={drawWinner}
                    className={cn(
                      "flex items-center gap-2 px-10 py-5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
                      names.length < 2 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#005da7] text-white shadow-[#005da7]/20 hover:bg-[#004a86]"
                    )}
                  >
                    <Play size={20} />
                    Sortear Nome
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerguntasERespostas() {
  const flashcards = [
    { q: "Quais são os 4 evangelistas?", a: "Mateus, Marcos, Lucas e João" },
    { q: "Qual o primeiro livro da Bíblia?", a: "Gênesis" },
    { q: "Qual o último livro da Bíblia?", a: "Apocalipse" },
    { q: "Quem batizou Jesus?", a: "João Batista" },
    { q: "Onde Jesus nasceu?", a: "Belém" },
    { q: "Quantos apóstolos Jesus escolheu?", a: "12" },
    { q: "Qual o mandamento mais importante?", a: "Amar a Deus sobre todas as coisas e ao próximo como a si mesmo" },
    { q: "Quem traiu Jesus?", a: "Judas Iscariotes" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2 className="font-manrope font-black text-2xl text-[#001e40]">Perguntas e Respostas</h2>
          <p className="text-sm text-[#717783]">Use os flashcards para revisar o conteúdo.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex justify-between w-full mb-4 text-sm font-bold text-[#717783] uppercase tracking-widest">
          <span>Card {currentIndex + 1} de {flashcards.length}</span>
        </div>

        <div 
          className="w-full h-64 perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="w-full h-full relative preserve-3d transition-all duration-500"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-[#f9f9f9] border-2 border-black/15 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <HelpCircle size={32} className="text-emerald-500 mb-4 opacity-50" />
              <h3 className="font-manrope font-black text-2xl text-[#001e40]">
                {flashcards[currentIndex].q}
              </h3>
              <p className="text-sm text-[#717783] mt-8 font-bold uppercase tracking-widest">Toque para ver a resposta</p>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-sm"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <CheckCircle size={32} className="text-emerald-500 mb-4 opacity-50" />
              <h3 className="font-manrope font-black text-2xl text-emerald-800">
                {flashcards[currentIndex].a}
              </h3>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button 
            onClick={prevCard}
            className="p-4 rounded-2xl bg-[#f9f9f9] text-[#414751] hover:bg-[#edeeef] transition-colors"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <button 
            onClick={nextCard}
            className="p-4 rounded-2xl bg-[#f9f9f9] text-[#414751] hover:bg-[#edeeef] transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizBiblico() {
  const questions = [
    {
      question: "Quem foi engolido por um grande peixe?",
      options: ["Moisés", "Jonas", "Davi", "Pedro"],
      answer: 1
    },
    {
      question: "Quantos dias e noites choveu durante o dilúvio?",
      options: ["10", "30", "40", "50"],
      answer: 2
    },
    {
      question: "Quem derrotou o gigante Golias?",
      options: ["Salomão", "Saul", "Sansão", "Davi"],
      answer: 3
    },
    {
      question: "Qual o nome do mar que Moisés abriu?",
      options: ["Mar Morto", "Mar da Galileia", "Mar Vermelho", "Mar Mediterrâneo"],
      answer: 2
    },
    {
      question: "Quem foi o primeiro homem criado por Deus?",
      options: ["Abraão", "Noé", "Adão", "Caim"],
      answer: 2
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswerOptionClick = (index: number) => {
    setSelectedOption(index);
    
    setTimeout(() => {
      if (index === questions[currentQuestion].answer) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Trophy size={24} />
        </div>
        <div>
          <h2 className="font-manrope font-black text-2xl text-[#001e40]">Quiz Bíblico</h2>
          <p className="text-sm text-[#717783]">Teste seus conhecimentos sobre a Bíblia.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {showScore ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-6 shadow-lg shadow-amber-200/50">
              <Trophy size={48} />
            </div>
            <h3 className="font-manrope font-black text-3xl text-[#001e40] mb-4">
              Você acertou {score} de {questions.length}!
            </h3>
            <p className="text-[#717783] mb-8">
              {score === questions.length ? 'Perfeito! Você conhece muito bem a Bíblia.' : 
               score >= questions.length / 2 ? 'Muito bom! Continue estudando a Palavra.' : 
               'Não desanime! A Bíblia é um livro maravilhoso para se aprender a cada dia.'}
            </p>
            <button 
              onClick={resetQuiz}
              className="flex items-center gap-2 bg-[#005da7] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#004a86] transition-all active:scale-95 shadow-lg shadow-[#005da7]/20"
            >
              <RotateCcw size={20} />
              Jogar Novamente
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#717783] uppercase tracking-widest">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm font-bold text-[#005da7] bg-[#005da7]/10 px-3 py-1 rounded-full">
                Pontos: {score}
              </span>
            </div>
            
            <h3 className="font-manrope font-black text-2xl text-[#1a1c1c] leading-tight">
              {questions[currentQuestion].question}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === questions[currentQuestion].answer;
                const showResult = selectedOption !== null;
                
                let buttonClass = "bg-[#f9f9f9] border-black/15 text-[#414751] hover:bg-[#f3f3f3] hover:border-[#c1c7d3]";
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass = "bg-emerald-50 border-emerald-200 text-emerald-700";
                  } else if (isSelected) {
                    buttonClass = "bg-red-50 border-red-200 text-red-700";
                  } else {
                    buttonClass = "bg-[#f9f9f9] border-black/15 text-[#c1c7d3] opacity-50";
                  }
                } else if (isSelected) {
                  buttonClass = "bg-blue-50 border-blue-200 text-blue-700";
                }

                return (
                  <button
                    key={index}
                    disabled={showResult}
                    onClick={() => handleAnswerOptionClick(index)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border-2 font-bold transition-all duration-300",
                      buttonClass
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <UserCheck size={20} className="text-emerald-600" />}
                      {showResult && isSelected && !isCorrect && <X size={20} className="text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuemSouEu() {
  const characters = [
    { name: "Moisés", clues: ["Fui salvo das águas", "Falei com Deus na sarça ardente", "Abri o Mar Vermelho"] },
    { name: "Davi", clues: ["Fui pastor de ovelhas", "Derrotei um gigante", "Fui rei de Israel"] },
    { name: "Pedro", clues: ["Fui pescador", "Andei sobre as águas", "Neguei Jesus 3 vezes"] },
    { name: "Maria", clues: ["Recebi a visita de um anjo", "Fui a mãe de Jesus", "Estive aos pés da cruz"] },
    { name: "Noé", clues: ["Construí uma grande arca", "Sobrevivi ao dilúvio", "Vi o primeiro arco-íris"] }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextClue = () => {
    if (clueIndex < characters[currentIndex].clues.length - 1) {
      setClueIndex(clueIndex + 1);
    } else {
      setShowAnswer(true);
    }
  };

  const nextCharacter = () => {
    setCurrentIndex((prev) => (prev + 1) % characters.length);
    setClueIndex(0);
    setShowAnswer(false);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <UserCheck size={24} />
        </div>
        <div>
          <h2 className="font-manrope font-black text-2xl text-[#001e40]">Quem sou eu Bíblico</h2>
          <p className="text-sm text-[#717783]">Adivinhe o personagem com o menor número de dicas.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex justify-between w-full mb-4 text-sm font-bold text-[#717783] uppercase tracking-widest">
          <span>Personagem {currentIndex + 1} de {characters.length}</span>
        </div>

        <div className="w-full bg-[#f9f9f9] border border-black/15 rounded-3xl p-8 text-center min-h-[300px] flex flex-col justify-center relative shadow-sm">
          {!showAnswer ? (
            <>
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 mb-6">Dica {clueIndex + 1}</h3>
              <p className="font-manrope font-black text-3xl text-[#001e40] leading-tight mb-8">
                &quot;{characters[currentIndex].clues[clueIndex]}&quot;
              </p>
              
              <div className="flex justify-center gap-2 mt-auto">
                {characters[currentIndex].clues.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      idx <= clueIndex ? "w-8 bg-purple-500" : "w-2 bg-purple-200"
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-[#717783] mb-2">A resposta é:</h3>
              <p className="font-manrope font-black text-5xl text-purple-600 mb-8">
                {characters[currentIndex].name}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-8 w-full">
          {!showAnswer ? (
            <button 
              onClick={nextClue}
              className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
            >
              {clueIndex < characters[currentIndex].clues.length - 1 ? 'Próxima Dica' : 'Ver Resposta'}
            </button>
          ) : (
            <button 
              onClick={nextCharacter}
              className="flex-1 bg-[#005da7] text-white py-4 rounded-2xl font-bold hover:bg-[#004a86] transition-colors shadow-lg shadow-[#005da7]/20"
            >
              Próximo Personagem
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OutrosJogos() {
  const ideas = [
    { title: "Mímica Bíblica", desc: "Divida a turma em grupos. Um participante faz mímica de uma passagem bíblica para o seu grupo adivinhar." },
    { title: "Telefone sem Fio", desc: "Use um versículo bíblico. O primeiro lê em silêncio e sussurra para o próximo. O último diz em voz alta." },
    { title: "Batata Quente", desc: "Passe um objeto enquanto toca uma música. Quando parar, quem estiver com o objeto responde uma pergunta." },
    { title: "Caça ao Tesouro", desc: "Esconda pistas pela sala que levem a uma mensagem bíblica ou a uma pequena lembrança." }
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/15">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-manrope font-black text-2xl text-[#001e40]">Outros Jogos e Dinâmicas</h2>
          <p className="text-sm text-[#717783]">Ideias criativas para animar seus encontros.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea, index) => (
          <div key={index} className="bg-[#f9f9f9] p-6 rounded-2xl border border-black/15 hover:border-rose-200 transition-colors group">
            <h3 className="font-manrope font-black text-xl text-[#001e40] mb-2 group-hover:text-rose-600 transition-colors">
              {idea.title}
            </h3>
            <p className="text-[#717783] text-sm leading-relaxed">
              {idea.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
