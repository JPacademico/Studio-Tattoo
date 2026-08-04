import type { Artist, FaqItem, GalleryPiece, ProcessStep } from '@/types'

/* -------------------------------------------------------------------------- *
 * MOCK DATA — everything the prototype shows lives in this file.
 * Replace the values here with the studio's real details and the whole site
 * updates. Nothing else needs to be touched.
 * -------------------------------------------------------------------------- */

export const studio = {
  name: 'Studio Junior Tattoo',
  shortName: 'Studio Junior',
  founded: 2014,
  tagline: 'A tatuagem que você não vai se arrepender.',
  intro:
    'Tatuagem autoral em Aracaju, só com hora marcada. Onde traço limpo encontra arte permanente.',

  address: {
    street: 'Rua Niceu Dantas, 412 — Sala 3',
    district: 'Grageru',
    city: 'Aracaju',
    state: 'SE',
    zip: '49027-060',
  },

  /** Grageru, Aracaju. Update both numbers to move the map pin. */
  coords: { lat: -10.9436, lng: -37.064 },
  mapZoom: 16,

  phoneDisplay: '(79) 99999-0000',
  whatsapp: '5579999990000',
  email: 'contato@studiojuniortattoo.com.br',
  instagram: 'studiojuniortattoo',

  hours: [
    { days: 'Terça a sexta', time: '10h — 19h' },
    { days: 'Sábado', time: '10h — 16h' },
    { days: 'Domingo e segunda', time: 'Fechado' },
  ],

  /** How far ahead the booking calendar lets you go. */
  bookingWindowDays: 60,
} as const

export const fullAddress = `${studio.address.street}, ${studio.address.district}, ${studio.address.city} — ${studio.address.state}, ${studio.address.zip}`

export const artists: Artist[] = [
  {
    id: 'junior',
    name: 'Junior Alves',
    role: 'Fundador · Blackwork & Realismo',
    instagram: 'junior.alves.ink',
    whatsapp: '5579999990001',
    specialties: ['Blackwork', 'Realismo', 'Cobertura'],
    bio: 'Preto e cinza pesado, sombreado profundo e coberturas que ninguém achava que dava pra salvar.',
    photoId: 'photo-1552627019-947c3789ffb5',
    since: 2014,
    workdays: [2, 3, 4, 5, 6],
    slots: ['10:00', '13:00', '15:30'],
    sessionMinutes: 150,
  },
  {
    id: 'bia',
    name: 'Bia Nunes',
    role: 'Fineline & Botânico',
    instagram: 'bia.nunes.tattoo',
    whatsapp: '5579999990002',
    specialties: ['Fineline', 'Botânico', 'Micro tattoo'],
    bio: 'Traço fino levado ao limite: folhagens, insetos e composições delicadas que envelhecem bem.',
    photoId: 'photo-1485463598028-44d6c47bf23f',
    since: 2019,
    workdays: [2, 3, 4, 5, 6],
    slots: ['09:30', '11:30', '14:00', '16:30'],
    sessionMinutes: 90,
  },
  {
    id: 'rafa',
    name: 'Rafa Melo',
    role: 'Old School & Neo-tradicional',
    instagram: 'rafamelo.flash',
    whatsapp: '5579999990003',
    specialties: ['Old school', 'Neo-tradicional', 'Flash'],
    bio: 'Contorno grosso, paleta fechada e aquele humor de flash antigo.',
    photoId: 'photo-1650783756107-739513b38177',
    since: 2017,
    workdays: [3, 4, 5, 6],
    slots: ['11:00', '14:00', '16:00', '18:00'],
    sessionMinutes: 120,
  },
  {
    id: 'lu',
    name: 'Lu Andrade',
    role: 'Pontilhismo & Ornamental',
    instagram: 'lu.andrade.dots',
    whatsapp: '5579999990004',
    specialties: ['Pontilhismo', 'Ornamental', 'Geométrico'],
    bio: 'Geometria sagrada, mandalas e ponto a ponto com paciência de relojoeiro.',
    photoId: 'photo-1564426622559-5af68da63b96',
    since: 2021,
    workdays: [2, 4, 5, 6],
    slots: ['10:00', '12:30', '15:00', '17:30'],
    sessionMinutes: 120,
  },
]

export function artistById(id: string | null | undefined): Artist | undefined {
  return artists.find((a) => a.id === id)
}

/** Fanned-out cards behind the hero headline. */
export const heroPieces = [
  'photo-1540174053853-1cc5d1fa8814',
  'photo-1562962230-16e4623d36e6',
  'photo-1561377455-190afb395ed7',
  'photo-1662753361921-e6784e43f88b',
  'photo-1586243287039-23f4c8e2e7ab',
  'photo-1635527948959-1b47e7903cb9',
  'photo-1598371839696-5c5bb00bdc28',
]

export const studioShots = {
  interiorWide: 'photo-1608666599953-b951163495f4',
  interiorWarm: 'photo-1595747644932-abb68f85f419',
  neonSign: 'photo-1516008684536-605574d804ce',
  signDark: 'photo-1663946179345-41483ed01b41',
  roomDark: 'photo-1624918959325-4ab1f51306d1',
  storefront: 'photo-1687704487660-8f4bdf39f75a',
}

export const gallery: GalleryPiece[] = [
  {
    id: 'g1',
    photoId: 'photo-1662753361921-e6784e43f88b',
    alt: 'Blackwork nórdico no antebraço, com runas e árvore da vida',
    date: '04.02.2025',
    artistId: 'junior',
    style: 'Blackwork',
    note: 'muito detalhe nessa!',
    tilt: -6,
  },
  {
    id: 'g2',
    photoId: 'photo-1598371839696-5c5bb00bdc28',
    alt: 'Peça floral sombreada no ombro',
    date: '16.12.2024',
    artistId: 'bia',
    style: 'Botânico',
    tilt: 4,
  },
  {
    id: 'g3',
    photoId: 'photo-1562962230-16e4623d36e6',
    alt: 'Braço fechado com folhagens em traço fino',
    date: '28.10.2024',
    artistId: 'bia',
    style: 'Fineline',
    note: 'cicatrizou lindo',
    tilt: -3,
  },
  {
    id: 'g4',
    photoId: 'photo-1561377455-190afb395ed7',
    alt: 'Bodysuit ornamental em blackwork',
    date: '03.11.2024',
    artistId: 'lu',
    style: 'Ornamental',
    tilt: 5,
  },
  {
    id: 'g5',
    photoId: 'photo-1586243287039-23f4c8e2e7ab',
    alt: 'Mandala nas costas em pontilhismo',
    date: '01.02.2025',
    artistId: 'lu',
    style: 'Pontilhismo',
    note: 'sessão de 6 horas',
    tilt: -5,
  },
  {
    id: 'g6',
    photoId: 'photo-1614174487989-10fc7b5382a9',
    alt: 'Tatuagem geométrica pequena no antebraço',
    date: '23.04.2024',
    artistId: 'lu',
    style: 'Geométrico',
    tilt: 3,
  },
  {
    id: 'g7',
    photoId: 'photo-1704345911717-b9c422bf6ef0',
    alt: 'Peça floral fresca no braço',
    date: '09.06.2024',
    artistId: 'bia',
    style: 'Botânico',
    tilt: -4,
  },
  {
    id: 'g8',
    photoId: 'photo-1635527948959-1b47e7903cb9',
    alt: 'Braço fechado em preto e cinza',
    date: '23.01.2025',
    artistId: 'junior',
    style: 'Realismo',
    tilt: 6,
  },
  {
    id: 'g9',
    photoId: 'photo-1521308452854-e037c0062a1e',
    alt: 'Folha de flash old school colorida',
    date: '28.10.2024',
    artistId: 'rafa',
    style: 'Old school',
    note: 'flash disponível',
    tilt: -2,
  },
  {
    id: 'g10',
    photoId: 'photo-1479767574301-a01c78234a0c',
    alt: 'Lettering e sombreado em braço fechado',
    date: '14.09.2024',
    artistId: 'rafa',
    style: 'Neo-tradicional',
    tilt: 4,
  },
  {
    id: 'g11',
    photoId: 'photo-1565058379802-bbe93b2f703a',
    alt: 'Antebraço sendo tatuado em preto e cinza',
    date: '30.07.2024',
    artistId: 'junior',
    style: 'Blackwork',
    tilt: -5,
  },
  {
    id: 'g12',
    photoId: 'photo-1482375702222-03a768d5ea3c',
    alt: 'Braço tatuado no estúdio, quadros ao fundo',
    date: '18.03.2024',
    artistId: 'rafa',
    style: 'Old school',
    tilt: 2,
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Conte a sua ideia',
    body: 'Tudo começa numa conversa. Você manda referências, mostra o local do corpo e a gente fala sobre tamanho, estilo e orçamento — presencialmente ou pelo WhatsApp. Se ainda estiver só uma vontade solta, tudo bem: a gente ajuda a fechar o conceito.',
    photoId: 'photo-1583213261205-63258746ed4c',
  },
  {
    number: '02',
    title: 'Do papel para a pele',
    body: 'Com a ideia definida, o artista desenha uma peça exclusiva pra você. Você recebe a arte antes da sessão e tem espaço pra pedir ajustes. Nada vai pra pele sem o seu "é isso".',
    photoId: 'photo-1564426622559-5af68da63b96',
  },
  {
    number: '03',
    title: 'O dia da sessão',
    body: 'Material descartável, ambiente climatizado e o tempo que a peça precisar. A gente trabalha em ritmo confortável, com pausas sempre que você pedir. Você sai daqui com uma tatuagem feita pra durar, com as instruções de cuidado e o contato direto do artista.',
    photoId: 'photo-1542744383-8c330d91f4b1',
  },
]

export const differentials = [
  {
    title: 'Desenho exclusivo',
    body: 'Não repetimos peça. Cada tatuagem é desenhada do zero para o corpo de quem vai usar.',
  },
  {
    title: 'Biossegurança levada a sério',
    body: 'Agulhas lacradas abertas na sua frente, autoclave com laudo e descarte regulamentado.',
  },
  {
    title: 'Preço fechado antes de começar',
    body: 'Você sabe quanto vai pagar antes da máquina ligar. Sem surpresa no fim da sessão.',
  },
]

export const faq: FaqItem[] = [
  {
    question: 'Como faço para agendar?',
    answer:
      'Pelo próprio site, em "Agendar": escolhe o artista, o dia e o horário e manda seus dados. Em até 24h a gente confirma no WhatsApp. Se preferir conversar antes de marcar, use a aba "Planejar".',
  },
  {
    question: 'Vocês atendem sem hora marcada?',
    answer:
      'Só para peças pequenas de flash, quando tem janela na agenda. Vale mandar mensagem no dia perguntando — mas não garantimos.',
  },
  {
    question: 'Como me preparo para a sessão?',
    answer:
      'Durma bem, coma antes de vir, evite álcool nas 24h anteriores e use roupa que dê acesso fácil ao local. Não venha com a pele queimada de sol.',
  },
  {
    question: 'Fazem cobertura de tatuagem antiga?',
    answer:
      'Fazemos, é uma das especialidades do Junior. Manda uma foto da peça atual em boa luz que a gente avalia o que dá para fazer.',
  },
  {
    question: 'Qual a idade mínima?',
    answer:
      'A partir de 18 anos, com documento com foto. Não tatuamos menores de idade, mesmo com autorização dos responsáveis.',
  },
]

export const manifesto =
  '"Preto não sai de moda. É sobre peso, permanência e criar uma arte que ainda vai fazer sentido daqui a trinta anos."'

/** Horários que aparecem ocupados no protótipo — dá vida ao calendário. */
export const mockBusySlots: Record<string, string[]> = {}
