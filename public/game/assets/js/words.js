// words.js — Diccionario de palabras infantiles con silabación
// Silabación española estándar. Categorías por temática para niños 4-9 años.

export const WORD_BANK = {
  animales: [
    { palabra: 'GATO',   silabas: ['GA', 'TO'] },
    { palabra: 'PERRO',  silabas: ['PE', 'RRO'] },
    { palabra: 'LOBO',   silabas: ['LO', 'BO'] },
    { palabra: 'OSO',     silabas: ['O', 'SO'] },
    { palabra: 'PATO',   silabas: ['PA', 'TO'] },
    { palabra: 'LORO',   silabas: ['LO', 'RO'] },
    { palabra: 'RANA',   silabas: ['RA', 'NA'] },
    { palabra: 'VACA',   silabas: ['VA', 'CA'] },
    { palabra: 'CABRA',  silabas: ['CA', 'BRA'] },
    { palabra: 'TIGRE',  silabas: ['TI', 'GRE'] },
    { palabra: 'CEBRA',  silabas: ['CE', 'BRA'] },
    { palabra: 'MONO',   silabas: ['MO', 'NO'] },
    { palabra: 'JIRAFA', silabas: ['JI', 'RA', 'FA'] },
    { palabra: 'ELEFANTE',silabas: ['E', 'LE', 'FAN', 'TE'] },
    { palabra: 'MARIPOSA',silabas:['MA', 'RI', 'PO', 'SA'] },
    { palabra: 'TORTUGA',silabas: ['TOR', 'TU', 'GA'] },
    { palabra: 'CONEJO', silabas: ['CO', 'NE', 'JO'] },
    { palabra: 'ARDILLA',silabas: ['AR', 'DI', 'LLA'] },
    { palabra: 'CANGURO',silabas: ['CAN', 'GU', 'RO'] },
    { palabra: 'DELFÍN', silabas: ['DEL', 'FÍN'] },
  ],
  frutas: [
    { palabra: 'MANZANA',silabas: ['MAN', 'ZA', 'NA'] },
    { palabra: 'BANANA',  silabas: ['BA', 'NA', 'NA'] },
    { palabra: 'NARANJA',silabas: ['NA', 'RAN', 'JA'] },
    { palabra: 'PERA',    silabas: ['PE', 'RA'] },
    { palabra: 'UVA',     silabas: ['U', 'VA'] },
    { palabra: 'SANDÍA',  silabas: ['SAN', 'DÍ', 'A'] },
    { palabra: 'FRUTILLA',silabas: ['FRU', 'TI', 'LLA'] },
    { palabra: 'DURAZNO', silabas: ['DU', 'RAZ', 'NO'] },
    { palabra: 'CEREZA',  silabas: ['CE', 'RE', 'ZA'] },
    { palabra: 'LIMÓN',   silabas: ['LI', 'MÓN'] },
    { palabra: 'MELÓN',   silabas: ['ME', 'LÓN'] },
  ],
  colores: [
    { palabra: 'ROJO',   silabas: ['RO', 'JO'] },
    { palabra: 'AZUL',   silabas: ['A', 'ZUL'] },
    { palabra: 'VERDE',  silabas: ['VER', 'DE'] },
    { palabra: 'AMARILLO',silabas:['A', 'MA', 'RI', 'LLO'] },
    { palabra: 'NEGRO',  silabas: ['NE', 'GRO'] },
    { palabra: 'BLANCO', silabas: ['BLAN', 'CO'] },
    { palabra: 'ROSA',   silabas: ['RO', 'SA'] },
    { palabra: 'VIOLETA',silabas: ['VI', 'O', 'LE', 'TA'] },
    { palabra: 'MARRÓN', silabas: ['MA', 'RRÓN'] },
  ],
  objetos: [
    { palabra: 'CASA',   silabas: ['CA', 'SA'] },
    { palabra: 'MESA',   silabas: ['ME', 'SA'] },
    { palabra: 'SILLA',  silabas: ['SI', 'LLA'] },
    { palabra: 'CAMA',   silabas: ['CA', 'MA'] },
    { palabra: 'COCHE',  silabas: ['CO', 'CHE'] },
    { palabra: 'TREN',   silabas: ['TREN'] },
    { palabra: 'BARCO',  silabas: ['BAR', 'CO'] },
    { palabra: 'AVIÓN',  silabas: ['A', 'VIÓN'] },
    { palabra: 'PELOTA', silabas: ['PE', 'LO', 'TA'] },
    { palabra: 'LÁPIZ', silabas: ['LÁ', 'PIZ'] },
    { palabra: 'LIBRO',  silabas: ['LI', 'BRO'] },
    { palabra: 'RELOJ',  silabas: ['RE', 'LOJ'] },
    { palabra: 'VASO',   silabas: ['VA', 'SO'] },
    { palabra: 'CUBIERTOS',silabas:['CU', 'BIER', 'TOS'] },
  ],
  cotidianos: [
    { palabra: 'BICICLETA', silabas: ['BI', 'CI', 'CLE', 'TA'] },
    { palabra: 'CAMISETA', silabas: ['CA', 'MI', 'SE', 'TA'] },
    { palabra: 'CARAMELO', silabas: ['CA', 'RA', 'ME', 'LO'] },
    { palabra: 'COCODRILO', silabas: ['CO', 'CO', 'DRI', 'LO'] },
    { palabra: 'MARIONETA', silabas: ['MA', 'RIO', 'NE', 'TA'] },
    { palabra: 'PANTALONES', silabas: ['PAN', 'TA', 'LO', 'NES'] },
    { palabra: 'ZAPATILLA', silabas: ['ZA', 'PA', 'TI', 'LLA'] },
    { palabra: 'TELÉFONO', silabas: ['TE', 'LÉ', 'FO', 'NO'] },
    { palabra: 'VENTANILLA', silabas: ['VEN', 'TA', 'NI', 'LLA'] },
    { palabra: 'ABANICO', silabas: ['A', 'BA', 'NI', 'CO'] },
    { palabra: 'SEMÁFORO', silabas: ['SE', 'MÁ', 'FO', 'RO'] },
    { palabra: 'CARRETERA', silabas: ['CA', 'RRE', 'TE', 'RA'] },
    { palabra: 'CARTULINA', silabas: ['CAR', 'TU', 'LI', 'NA'] },
    { palabra: 'PURPURINA', silabas: ['PUR', 'PU', 'RI', 'NA'] },
    { palabra: 'LAVADORA', silabas: ['LA', 'VA', 'DO', 'RA'] },
    { palabra: 'COMPUTADORA', silabas: ['COM', 'PU', 'TA', 'DO', 'RA'] },
    { palabra: 'CALCULADORA', silabas: ['CAL', 'CU', 'LA', 'DO', 'RA'] },
    { palabra: 'MOTOCICLETA', silabas: ['MO', 'TO', 'CI', 'CLE', 'TA'] },
    { palabra: 'REFRIGERADOR', silabas: ['RE', 'FRI', 'GE', 'RA', 'DOR'] },
    { palabra: 'SUPERMERCADO', silabas: ['SU', 'PER', 'MER', 'CA', 'DO'] },
  ],
  desafios: [
    { palabra: 'HIPOPÓTAMO', silabas: ['HI', 'PO', 'PÓ', 'TA', 'MO'] },
    { palabra: 'RINOCERONTE', silabas: ['RI', 'NO', 'CE', 'RON', 'TE'] },
    { palabra: 'FOTOGRAFÍA', silabas: ['FO', 'TO', 'GRA', 'FÍ', 'A'] },
    { palabra: 'HELADERÍA', silabas: ['HE', 'LA', 'DE', 'RÍ', 'A'] },
    { palabra: 'IMAGINACIÓN', silabas: ['I', 'MA', 'GI', 'NA', 'CIÓN'] },
    { palabra: 'EXPERIMENTO', silabas: ['EX', 'PE', 'RI', 'MEN', 'TO'] },
    { palabra: 'AVENTURERO', silabas: ['A', 'VEN', 'TU', 'RE', 'RO'] },
    { palabra: 'ENCICLOPEDIA', silabas: ['EN', 'CI', 'CLO', 'PE', 'DIA'] },
    { palabra: 'ELECTRICIDAD', silabas: ['E', 'LEC', 'TRI', 'CI', 'DAD'] },
    { palabra: 'MARAVILLOSO', silabas: ['MA', 'RA', 'VI', 'LLO', 'SO'] },
    { palabra: 'UNIVERSIDAD', silabas: ['U', 'NI', 'VER', 'SI', 'DAD'] },
    { palabra: 'COMUNICACIÓN', silabas: ['CO', 'MU', 'NI', 'CA', 'CIÓN'] },
    { palabra: 'LABORATORIO', silabas: ['LA', 'BO', 'RA', 'TO', 'RIO'] },
    { palabra: 'VETERINARIO', silabas: ['VE', 'TE', 'RI', 'NA', 'RIO'] },
    { palabra: 'MATEMÁTICAS', silabas: ['MA', 'TE', 'MÁ', 'TI', 'CAS'] },
    { palabra: 'PARACAIDISTA', silabas: ['PA', 'RA', 'CAI', 'DIS', 'TA'] },
    { palabra: 'BIBLIOTECARIO', silabas: ['BI', 'BLIO', 'TE', 'CA', 'RIO'] },
    { palabra: 'INVERTEBRADO', silabas: ['IN', 'VER', 'TE', 'BRA', 'DO'] },
    { palabra: 'PERSONALIDAD', silabas: ['PER', 'SO', 'NA', 'LI', 'DAD'] },
    { palabra: 'RESPONSABILIDAD', silabas: ['RES', 'PON', 'SA', 'BI', 'LI', 'DAD'] },
    { palabra: 'DESAFORTUNADO', silabas: ['DE', 'SA', 'FOR', 'TU', 'NA', 'DO'] },
    { palabra: 'FERROCARRILERO', silabas: ['FE', 'RRO', 'CA', 'RRI', 'LE', 'RO'] },
    { palabra: 'MICROORGANISMO', silabas: ['MI', 'CRO', 'OR', 'GA', 'NIS', 'MO'] },
    { palabra: 'MEDITERRÁNEO', silabas: ['ME', 'DI', 'TE', 'RRÁ', 'NE', 'O'] },
    { palabra: 'EXTRAORDINARIO', silabas: ['EX', 'TRA', 'OR', 'DI', 'NA', 'RIO'] },
    { palabra: 'ELECTRODOMÉSTICO', silabas: ['E', 'LEC', 'TRO', 'DO', 'MÉS', 'TI', 'CO'] },
    { palabra: 'TELECOMUNICACIÓN', silabas: ['TE', 'LE', 'CO', 'MU', 'NI', 'CA', 'CIÓN'] },
  ],
  naturaleza: [
    { palabra: 'SOL',     silabas: ['SOL'] },
    { palabra: 'LUNA',    silabas: ['LU', 'NA'] },
    { palabra: 'ESTRELLA',silabas: ['ES', 'TRE', 'LLA'] },
    { palabra: 'NUBE',    silabas: ['NU', 'BE'] },
    { palabra: 'LLUVIA',  silabas: ['LLU', 'VIA'] },
    { palabra: 'ÁRBOL',   silabas: ['ÁR', 'BOL'] },
    { palabra: 'FLOR',    silabas: ['FLOR'] },
    { palabra: 'HOJA',    silabas: ['HO', 'JA'] },
    { palabra: 'RÍO',     silabas: ['RÍ', 'O'] },
    { palabra: 'MAR',     silabas: ['MAR'] },
    { palabra: 'MONTAÑA',silabas: ['MON', 'TA', 'ÑA'] },
    { palabra: 'NIEVE',   silabas: ['NIE', 'VE'] },
  ],
};

// Lista plana con categoría para selección aleatoria
export const ALL_WORDS = Object.entries(WORD_BANK).flatMap(([cat, list]) =>
  list.map(w => ({ ...w, cat }))
);

// Bonus emojis (estáticos, no necesitan palabra)
export const BONUS_POOL = [
  { emoji: '🍎', color: '#ff6b6b', kind: 'points',  label: '+25' },
  { emoji: '⭐', color: '#ffe66d', kind: 'star',     label: 'INVENCIBLE' },
  { emoji: '⚡', color: '#7cf7ec', kind: 'speed',    label: 'TURBO' },
  { emoji: '❤️', color: '#ff6b9d', kind: 'life',     label: '+1 VIDA' },
  { emoji: '🎈', color: '#c4b5fd', kind: 'shrink',   label: '-COLA' },
  { emoji: '🍇', color: '#a8d8ea', kind: 'points',   label: '+25' },
  { emoji: '🍓', color: '#ff5f8a', kind: 'points',  label: '+25' },
  { emoji: '🍀', color: '#96e6a1', kind: 'luck',     label: 'SUERTE' },
];

// Personajes
export const CHARACTERS = [
  { id: 'lili', name: 'Lili', color: '#4ecdc4', desc: 'Verde turquesa' },
  { id: 'toto', name: 'Toto', color: '#54a0ff', desc: 'Azul cielo' },
  { id: 'mimi', name: 'Mimi', color: '#ff6b9d', desc: 'Rosa brillante' },
  { id: 'sol',  name: 'Sol',  color: '#feca57', desc: 'Amarillo sol' },
];

export const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Fácil',
    desc: '1–3 sílabas',
    syllablesMin: 1,
    syllablesMax: 3,
    bonusEvery: 4,
  },
  {
    id: 'medium',
    name: 'Medio',
    desc: '3–5 sílabas',
    syllablesMin: 3,
    syllablesMax: 5,
    bonusEvery: 5,
  },
  {
    id: 'hard',
    name: 'Difícil',
    desc: '5–7 sílabas',
    syllablesMin: 5,
    syllablesMax: 7,
    bonusEvery: 6,
  },
];

export function pickWord(diff) {
  // Filtra por longitud de sílabas según dificultad
  const eligible = ALL_WORDS.filter(w => w.silabas.length >= diff.syllablesMin && w.silabas.length <= diff.syllablesMax);
  const pool = eligible.length > 0 ? eligible : ALL_WORDS;
  return pool[(Math.random() * pool.length) | 0];
}

export function pickBonus() {
  return BONUS_POOL[(Math.random() * BONUS_POOL.length) | 0];
}
