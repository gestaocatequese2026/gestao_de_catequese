export type LiturgicalEventType = 'solemnity' | 'feast' | 'memorial' | 'saint' | 'holiday' | 'commemorative';

export interface LiturgicalEvent {
  type: LiturgicalEventType;
  title: string;
  color: string;
  description: string;
}

export const liturgicalEvents: Record<string, LiturgicalEvent[]> = {
  // Janeiro
  '2026-01-01': [
    { type: 'solemnity', title: 'Santa Maria, Mãe de Deus', color: 'white', description: 'Solenidade de Santa Maria, Mãe de Deus. Dia Mundial da Paz.' },
    { type: 'holiday', title: 'Confraternização Universal', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-01-04': [
    { type: 'solemnity', title: 'Epifania do Senhor', color: 'white', description: 'Manifestação de Jesus Cristo como Messias.' }
  ],
  '2026-01-11': [
    { type: 'feast', title: 'Batismo do Senhor', color: 'white', description: 'Festa do Batismo do Senhor.' }
  ],
  '2026-01-25': [
    { type: 'feast', title: 'Conversão de São Paulo', color: 'white', description: 'Festa da Conversão do Apóstolo São Paulo.' }
  ],
  '2026-01-28': [
    { type: 'memorial', title: 'São Tomás de Aquino', color: 'white', description: 'Memória de São Tomás de Aquino, presbítero e doutor da Igreja.' }
  ],

  // Fevereiro
  '2026-02-02': [
    { type: 'feast', title: 'Apresentação do Senhor', color: 'white', description: 'Festa da Apresentação do Senhor no Templo.' }
  ],
  '2026-02-11': [
    { type: 'memorial', title: 'Nossa Senhora de Lourdes', color: 'white', description: 'Memória de Nossa Senhora de Lourdes. Dia Mundial do Doente.' }
  ],
  '2026-02-17': [
    { type: 'holiday', title: 'Carnaval', color: 'gray', description: 'Feriado Nacional (Ponto Facultativo).' }
  ],
  '2026-02-18': [
    { type: 'solemnity', title: 'Quarta-feira de Cinzas', color: 'purple', description: 'Início da Quaresma. Dia de jejum e abstinência.' }
  ],

  // Março
  '2026-03-08': [
    { type: 'commemorative', title: 'Dia Internacional da Mulher', color: 'rose', description: 'Data comemorativa.' }
  ],
  '2026-03-19': [
    { type: 'solemnity', title: 'São José, Esposo da Virgem Maria', color: 'white', description: 'Solenidade de São José, padroeiro da Igreja Universal.' }
  ],
  '2026-03-25': [
    { type: 'solemnity', title: 'Anunciação do Senhor', color: 'white', description: 'Solenidade da Anunciação do Senhor à Virgem Maria.' }
  ],
  '2026-03-29': [
    { type: 'solemnity', title: 'Domingo de Ramos', color: 'red', description: 'Início da Semana Santa.' }
  ],

  // Abril
  '2026-04-02': [
    { type: 'feast', title: 'Quinta-feira Santa', color: 'white', description: 'Missa da Ceia do Senhor. Lava-pés.' }
  ],
  '2026-04-03': [
    { type: 'solemnity', title: 'Sexta-feira Santa', color: 'red', description: 'Paixão do Senhor. Feriado Nacional.' },
    { type: 'holiday', title: 'Paixão de Cristo', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-04-04': [
    { type: 'solemnity', title: 'Sábado Santo', color: 'purple', description: 'Vigília Pascal.' }
  ],
  '2026-04-05': [
    { type: 'solemnity', title: 'Domingo de Páscoa', color: 'white', description: 'Ressurreição do Senhor.' }
  ],
  '2026-04-12': [
    { type: 'feast', title: 'Domingo da Divina Misericórdia', color: 'white', description: 'Segundo Domingo da Páscoa.' }
  ],
  '2026-04-21': [
    { type: 'holiday', title: 'Tiradentes', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-04-25': [
    { type: 'feast', title: 'São Marcos, Evangelista', color: 'red', description: 'Festa de São Marcos.' }
  ],

  // Maio
  '2026-05-01': [
    { type: 'holiday', title: 'Dia do Trabalho', color: 'gray', description: 'Feriado Nacional.' },
    { type: 'memorial', title: 'São José Operário', color: 'white', description: 'Memória de São José Operário.' }
  ],
  '2026-05-03': [
    { type: 'feast', title: 'São Filipe e São Tiago, Apóstolos', color: 'red', description: 'Festa dos Apóstolos.' }
  ],
  '2026-05-10': [
    { type: 'commemorative', title: 'Dia das Mães', color: 'rose', description: 'Segundo domingo de maio.' }
  ],
  '2026-05-13': [
    { type: 'memorial', title: 'Nossa Senhora de Fátima', color: 'white', description: 'Memória de Nossa Senhora de Fátima.' }
  ],
  '2026-05-14': [
    { type: 'feast', title: 'São Matias, Apóstolo', color: 'red', description: 'Festa do Apóstolo São Matias.' }
  ],
  '2026-05-17': [
    { type: 'solemnity', title: 'Ascensão do Senhor', color: 'white', description: 'Solenidade da Ascensão do Senhor.' }
  ],
  '2026-05-24': [
    { type: 'solemnity', title: 'Pentecostes', color: 'red', description: 'Solenidade de Pentecostes. Descida do Espírito Santo.' }
  ],
  '2026-05-31': [
    { type: 'solemnity', title: 'Santíssima Trindade', color: 'white', description: 'Solenidade da Santíssima Trindade.' },
    { type: 'feast', title: 'Visitação de Nossa Senhora', color: 'white', description: 'Festa da Visitação da Virgem Maria.' }
  ],

  // Junho
  '2026-06-04': [
    { type: 'solemnity', title: 'Corpus Christi', color: 'white', description: 'Solenidade do Santíssimo Corpo e Sangue de Cristo.' },
    { type: 'holiday', title: 'Corpus Christi', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-06-12': [
    { type: 'solemnity', title: 'Sagrado Coração de Jesus', color: 'white', description: 'Solenidade do Sagrado Coração de Jesus.' }
  ],
  '2026-06-13': [
    { type: 'memorial', title: 'Santo Antônio de Pádua', color: 'white', description: 'Memória de Santo Antônio, presbítero e doutor da Igreja.' },
    { type: 'memorial', title: 'Imaculado Coração de Maria', color: 'white', description: 'Memória do Imaculado Coração da Virgem Maria.' }
  ],
  '2026-06-24': [
    { type: 'solemnity', title: 'Natividade de São João Batista', color: 'white', description: 'Solenidade do nascimento de São João Batista.' }
  ],
  '2026-06-29': [
    { type: 'solemnity', title: 'São Pedro e São Paulo', color: 'red', description: 'Solenidade dos Apóstolos Pedro e Paulo.' }
  ],

  // Julho
  '2026-07-03': [
    { type: 'feast', title: 'São Tomé, Apóstolo', color: 'red', description: 'Festa do Apóstolo São Tomé.' }
  ],
  '2026-07-22': [
    { type: 'feast', title: 'Santa Maria Madalena', color: 'white', description: 'Festa de Santa Maria Madalena.' }
  ],
  '2026-07-25': [
    { type: 'feast', title: 'São Tiago Maior, Apóstolo', color: 'red', description: 'Festa do Apóstolo São Tiago.' }
  ],
  '2026-07-26': [
    { type: 'memorial', title: 'São Joaquim e Santa Ana', color: 'white', description: 'Memória dos pais da Virgem Maria. Dia dos Avós.' },
    { type: 'commemorative', title: 'Dia dos Avós', color: 'gray', description: 'Data comemorativa.' }
  ],

  // Agosto
  '2026-08-04': [
    { type: 'memorial', title: 'São João Maria Vianney', color: 'white', description: 'Memória do Cura d\'Ars. Dia do Padre.' }
  ],
  '2026-08-06': [
    { type: 'feast', title: 'Transfiguração do Senhor', color: 'white', description: 'Festa da Transfiguração do Senhor.' }
  ],
  '2026-08-09': [
    { type: 'commemorative', title: 'Dia dos Pais', color: 'gray', description: 'Segundo domingo de agosto.' }
  ],
  '2026-08-10': [
    { type: 'feast', title: 'São Lourenço, Diácono e Mártir', color: 'red', description: 'Festa de São Lourenço.' }
  ],
  '2026-08-15': [
    { type: 'solemnity', title: 'Assunção de Nossa Senhora', color: 'white', description: 'Solenidade da Assunção da Bem-Aventurada Virgem Maria.' }
  ],
  '2026-08-24': [
    { type: 'feast', title: 'São Bartolomeu, Apóstolo', color: 'red', description: 'Festa do Apóstolo São Bartolomeu.' }
  ],

  // Setembro
  '2026-09-07': [
    { type: 'holiday', title: 'Independência do Brasil', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-09-08': [
    { type: 'feast', title: 'Natividade de Nossa Senhora', color: 'white', description: 'Festa do Nascimento da Virgem Maria.' }
  ],
  '2026-09-14': [
    { type: 'feast', title: 'Exaltação da Santa Cruz', color: 'red', description: 'Festa da Exaltação da Santa Cruz.' }
  ],
  '2026-09-21': [
    { type: 'feast', title: 'São Mateus, Apóstolo e Evangelista', color: 'red', description: 'Festa do Apóstolo São Mateus.' }
  ],
  '2026-09-29': [
    { type: 'feast', title: 'Santos Arcanjos Miguel, Gabriel e Rafael', color: 'white', description: 'Festa dos Santos Arcanjos.' }
  ],
  '2026-09-30': [
    { type: 'memorial', title: 'São Jerônimo', color: 'white', description: 'Memória de São Jerônimo. Dia da Bíblia.' }
  ],

  // Outubro
  '2026-10-01': [
    { type: 'memorial', title: 'Santa Teresinha do Menino Jesus', color: 'white', description: 'Memória de Santa Teresinha, padroeira das missões.' }
  ],
  '2026-10-02': [
    { type: 'memorial', title: 'Santos Anjos da Guarda', color: 'white', description: 'Memória dos Santos Anjos da Guarda.' }
  ],
  '2026-10-04': [
    { type: 'memorial', title: 'São Francisco de Assis', color: 'white', description: 'Memória de São Francisco de Assis.' }
  ],
  '2026-10-12': [
    { type: 'solemnity', title: 'Nossa Senhora Aparecida', color: 'white', description: 'Padroeira do Brasil.' },
    { type: 'holiday', title: 'Nossa Senhora Aparecida', color: 'gray', description: 'Feriado Nacional.' },
    { type: 'commemorative', title: 'Dia das Crianças', color: 'gray', description: 'Data comemorativa.' }
  ],
  '2026-10-15': [
    { type: 'commemorative', title: 'Dia do Professor', color: 'gray', description: 'Data comemorativa.' }
  ],
  '2026-10-18': [
    { type: 'feast', title: 'São Lucas, Evangelista', color: 'red', description: 'Festa de São Lucas.' }
  ],
  '2026-10-28': [
    { type: 'feast', title: 'São Simão e São Judas Tadeu, Apóstolos', color: 'red', description: 'Festa dos Apóstolos.' }
  ],

  // Novembro
  '2026-11-01': [
    { type: 'solemnity', title: 'Todos os Santos', color: 'white', description: 'Solenidade de Todos os Santos.' }
  ],
  '2026-11-02': [
    { type: 'memorial', title: 'Comemoração de Todos os Fiéis Defuntos', color: 'purple', description: 'Dia de Finados.' },
    { type: 'holiday', title: 'Finados', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-11-09': [
    { type: 'feast', title: 'Dedicação da Basílica de Latrão', color: 'white', description: 'Festa da Dedicação da Basílica de São João de Latrão.' }
  ],
  '2026-11-15': [
    { type: 'holiday', title: 'Proclamação da República', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-11-20': [
    { type: 'holiday', title: 'Dia da Consciência Negra', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-11-22': [
    { type: 'solemnity', title: 'Cristo Rei do Universo', color: 'white', description: 'Solenidade de Nosso Senhor Jesus Cristo, Rei do Universo.' }
  ],
  '2026-11-30': [
    { type: 'feast', title: 'Santo André, Apóstolo', color: 'red', description: 'Festa do Apóstolo Santo André.' }
  ],

  // Dezembro
  '2026-12-08': [
    { type: 'solemnity', title: 'Imaculada Conceição de Nossa Senhora', color: 'white', description: 'Solenidade da Imaculada Conceição da Virgem Maria.' }
  ],
  '2026-12-12': [
    { type: 'feast', title: 'Nossa Senhora de Guadalupe', color: 'white', description: 'Festa de Nossa Senhora de Guadalupe, Padroeira da América Latina.' }
  ],
  '2026-12-25': [
    { type: 'solemnity', title: 'Natal do Senhor', color: 'white', description: 'Solenidade do Nascimento de Nosso Senhor Jesus Cristo.' },
    { type: 'holiday', title: 'Natal', color: 'gray', description: 'Feriado Nacional.' }
  ],
  '2026-12-26': [
    { type: 'feast', title: 'Santo Estêvão, Primeiro Mártir', color: 'red', description: 'Festa de Santo Estêvão.' }
  ],
  '2026-12-27': [
    { type: 'feast', title: 'Sagrada Família', color: 'white', description: 'Festa da Sagrada Família de Jesus, Maria e José.' }
  ],
  '2026-12-28': [
    { type: 'feast', title: 'Santos Inocentes, Mártires', color: 'red', description: 'Festa dos Santos Inocentes.' }
  ]
};

export interface LiturgicalSeason {
  name: string;
  color: string; // color name
  themeColor: string; // tailwind bg class
  textColor: string; // tailwind text class
}

/**
 * Calculates Easter Sunday for a given year using Anonymous Gregorian Algorithm
 */
export function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Returns the four Sundays before Christmas (Advent start)
 */
function getAdventStart(year: number): Date {
  const christmas = new Date(year, 11, 25);
  const dayOfWeek = christmas.getDay(); // 0 (Sun) to 6 (Sat)
  // If Christmas is Sunday, Advent starts 4 weeks before (28 days)
  // If Christmas is Monday, Advent starts 4 weeks before + 1 day... wait.
  // Advent always starts on a Sunday.
  // It is the Sunday closest to Nov 30, or 4th Sunday before Dec 25.
  const diff = dayOfWeek === 0 ? 28 : 21 + dayOfWeek;
  const advent = new Date(year, 11, 25);
  advent.setDate(christmas.getDate() - diff);
  return advent;
}

export function getCurrentLiturgicalSeason(date: Date = new Date()): LiturgicalSeason {
  const year = date.getFullYear();
  const time = date.getTime();

  // Basic reference dates
  const currentChristmas = new Date(year, 11, 25).getTime();
  const lastChristmas = new Date(year - 1, 11, 25).getTime();
  
  const easter = getEaster(year);
  const easterTime = easter.getTime();
  
  // Ash Wednesday (46 days before Easter)
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);
  const ashTime = ashWednesday.getTime();
  
  // Pentecost (50 days after Easter - including Easter)
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);
  const pentecostTime = pentecost.getTime();

  // Baptism of the Lord (usually Sunday after Jan 6)
  // For simplicity, let's say Jan 13 approx or calculate specifically
  // Simple rule: Christmas season ends on the feast of Baptism of the Lord
  const epiphany = new Date(year, 0, 6);
  const baptism = new Date(epiphany);
  baptism.setDate(epiphany.getDate() + (7 - epiphany.getDay()) % 7 || 7);
  const baptismTime = baptism.getTime();

  // Advent start
  const adventStart = getAdventStart(year).getTime();
  const lastYearAdventStart = getAdventStart(year - 1).getTime();

  // 1. NATAL (Dec 25 to Baptism)
  if (time >= currentChristmas || time < baptismTime) {
    return { name: 'Tempo do Natal', color: 'white', themeColor: 'bg-white border-gray-200', textColor: 'text-gray-800' };
  }

  // 2. ADVENTO (Advent Start to Dec 24)
  if (time >= adventStart) {
    return { name: 'Tempo do Advento', color: 'purple', themeColor: 'bg-purple-700', textColor: 'text-purple-700' };
  }

  // 3. QUARESMA (Ash Wednesday to Holy Thursday)
  // Holy Thursday is Easter - 3 days
  const holyThursday = new Date(easter);
  holyThursday.setDate(easter.getDate() - 3);
  
  // Specific day check: Palm Sunday (7 days before Easter)
  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7);
  if (Math.abs(time - palmSunday.getTime()) < 43200000) { // Within 12h of Palm Sunday
    return { name: 'Domingo de Ramos', color: 'red', themeColor: 'bg-red-700', textColor: 'text-red-700' };
  }

  if (time >= ashTime && time < holyThursday.getTime()) {
    return { name: 'Tempo da Quaresma', color: 'purple', themeColor: 'bg-purple-800', textColor: 'text-purple-800' };
  }
  
  // 4. PÁSCOA (Easter Sunday to Pentecost)
  if (time >= easterTime && time <= pentecostTime) {
    // Special check for Pentecost color (Red)
    if (Math.abs(time - pentecostTime) < 86400000) {
       return { name: 'Pentecostes', color: 'red', themeColor: 'bg-red-600', textColor: 'text-red-600' };
    }
    return { name: 'Tempo Pascal', color: 'white', themeColor: 'bg-white border-gray-200', textColor: 'text-gray-800' };
  }

  // 5. TEMPO COMUM
  return { name: 'Tempo Comum', color: 'green', themeColor: 'bg-green-600', textColor: 'text-green-600' };
}

