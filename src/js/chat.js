// src/js/chat.js - Lógica y conexión Firebase para el Chat de Asistencia (Estilo WhatsApp Web) para Liturgia de las Horas

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const ADMIN_EMAIL = 'dbaezh78@gmail.com';
const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutos en milisegundos

// Estado global de la sesión y chats
let db = null;
let currentUser = null;
let isAdmin = false;
let canViewAllChats = false;
let activeChatId = null;
let activeChatUser = null;
let rawChatsList = [];
let unsubscribeMessages = null;
let unsubscribeChats = null;
let pendingImageBase64 = null;
let currentFilter = 'all';
let searchQuery = '';

// Variables para modales de edición / eliminación
let targetMessageData = null;

// Emojis de reacción rápida estilo WhatsApp
const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// Mapeo exhaustivo de atajos de texto y emoticonos a emojis (ej: (Y) (y) -> 👍, <3 -> ❤️, etc.)
const EMOTICON_MAP = [
  // Pulgares (Y), (y), (N), (n)
  { regex: /\(y\)/gi, emoji: '👍' },
  { regex: /\(n\)/gi, emoji: '👎' },

  // Corazones: <3 -> ❤️, </3 -> 💔
  { regex: /<\/3/g, emoji: '💔' },
  { regex: /<3/g, emoji: '❤️' },

  // Atajos con paréntesis y combinaciones frecuentes
  { regex: /\(pray\)|\(oracion\)|\(oración\)|\(rezar\)|\(amen\)|\(amén\)/gi, emoji: '🙏' },
  { regex: /\(cross\)|\(cruz\)/gi, emoji: '✝️' },
  { regex: /\(dove\)|\(paloma\)/gi, emoji: '🕊️' },
  { regex: /\(church\)|\(iglesia\)/gi, emoji: '⛪' },
  { regex: /\(bible\)|\(biblia\)/gi, emoji: '📖' },
  { regex: /\(candle\)|\(vela\)/gi, emoji: '🕯️' },
  { regex: /\(angel\)|\(ángel\)/gi, emoji: '👼' },
  { regex: /\(fire\)|\(fuego\)/gi, emoji: '🔥' },
  { regex: /\(clap\)|\(aplauso\)|\(aplausos\)/gi, emoji: '👏' },
  { regex: /\(100\)/g, emoji: '💯' },
  { regex: /\(star\)|\(estrella\)/gi, emoji: '⭐' },
  { regex: /\(sparkles\)|\(brillo\)/gi, emoji: '✨' },
  { regex: /\(music\)|\(musica\)|\(música\)/gi, emoji: '🎶' },
  { regex: /\(heart\)|\(corazon\)|\(corazón\)/gi, emoji: '❤️' },
  { regex: /\(brokenheart\)/gi, emoji: '💔' },
  { regex: /\(party\)|\(fiesta\)/gi, emoji: '🎉' },
  { regex: /\(ok\)/gi, emoji: '👌' },
  { regex: /\(wave\)|\(hola\)/gi, emoji: '👋' },
  { regex: /\(kiss\)|\(beso\)/gi, emoji: '😘' },
  { regex: /\(cool\)/gi, emoji: '😎' },
  { regex: /\(shrug\)/gi, emoji: '🤷' },
  { regex: /\(peace\)|\(paz\)/gi, emoji: '✌️' },
  { regex: /\(rose\)|\(rosa\)/gi, emoji: '🌹' },
  { regex: /\(sun\)|\(sol\)/gi, emoji: '☀️' },
  { regex: /\(moon\)|\(luna\)/gi, emoji: '🌙' },

  // Emoticonos clásicos de texto con delimitación
  { regex: /(^|\s)(:[-]?\))(?=\s|$)/g, emoji: '😊' },
  { regex: /(^|\s)(:[-]?D)(?=\s|$)/g, emoji: '😃' },
  { regex: /(^|\s)(;[-]?\))(?=\s|$)/g, emoji: '😉' },
  { regex: /(^|\s)(:[-]?[pP])(?=\s|$)/g, emoji: '😛' },
  { regex: /(^|\s)(:[-]?[oO])(?=\s|$)/g, emoji: '😮' },
  { regex: /(^|\s)(:[-]?\()(?=\s|$)/g, emoji: '🙁' },
  { regex: /(^|\s)(:'[-]?\()(?=\s|$)/g, emoji: '😢' },
  { regex: /(^|\s)(XD|xd|Xd|xD)(?=\s|$)/g, emoji: '😆' },
  { regex: /(^|\s)(:[-]?\*|:\*)(?=\s|$)/g, emoji: '😘' },
  { regex: /(^|\s)(B[-]?\)|B\))(?=\s|$)/g, emoji: '😎' },
  { regex: /(^|\s)(:[-]?\|)(?=\s|$)/g, emoji: '😐' }
];

// Categorías completas del Selector de Emojis de WhatsApp Web Oficial
const EMOJI_CATEGORIES = {
  recent: {
    title: 'Recientes',
    icon: 'schedule',
    list: []
  },
  people: {
    title: 'Emoticonos y personas',
    icon: 'sentiment_satisfied',
    list: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
      '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢',
      '🫣', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥',
      '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
      '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵',
      '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁',
      '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥',
      '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱',
      '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡',
      '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', '👋', '🤚', '🖐️',
      '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘',
      '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊',
      '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '👃',
      '🧠', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑',
      '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅',
      '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂',
      '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '👼', '🎅',
      '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🚶',
      '🏃', '💃', '🕺', '🕴️', '🧖', '🧗', '🧘'
    ]
  },
  nature: {
    title: 'Animales y naturaleza',
    icon: 'pets',
    list: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
      '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
      '🐌', '🐞', '🐜', '🦟', '🐢', '🐍', '🦎', '🦖', '🐙', '🦑',
      '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊',
      '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫',
      '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙',
      '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜',
      '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁',
      '🐿️', '🦔', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀',
      '🍁', '🍂', '🍃', '🍄', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺',
      '🌻', '🌼', '🌷', '🌱', '🪴', '☀️', '🌤️', '⛅', '🌥️', '☁️',
      '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨',
      '🌪️', '🌫️', '🌈', '☔', '💧', '🌊'
    ]
  },
  food: {
    title: 'Comida y bebida',
    icon: 'local_cafe',
    list: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
      '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
      '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
      '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳',
      '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔',
      '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🫕',
      '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙',
      '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦',
      '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩',
      '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃',
      '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹',
      '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥢'
    ]
  },
  activity: {
    title: 'Actividades',
    icon: 'sports_basketball',
    list: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷',
      '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️',
      '🤺', '🤾', '🧗', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣',
      '🚴', '🚵', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️',
      '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧',
      '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻',
      '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'
    ]
  },
  travel: {
    title: 'Viajes y lugares',
    icon: 'directions_car',
    list: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
      '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🚏',
      '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓',
      '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫',
      '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸',
      '🪐', '🌠', '🌌', '🌃', '🌆', '🌇', '🏙️', '🗾', '🎑', '🏞️',
      '🌅', '🌄', '🎇', '🎆', '🌉', '🌁', '⛺', '🏕️', '🏠', '🏡',
      '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦',
      '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍',
      '⛩️', '🕋', '⛲', '🏰', '🏯', '🗿'
    ]
  },
  objects: {
    title: 'Objetos',
    icon: 'lightbulb',
    list: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️',
      '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
      '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️',
      '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '💡', '🔦', '🕯️',
      '🪔', '🏮', '🧱', '🪜', '🧯', '🪛', '🔧', '🔨', '⚒️', '🛠️',
      '⛏️', '🪚', '🔩', '⚙️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪',
      '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿',
      '🧿', '💈', '⚗️', '🧪', '🧫', '🔬', '🔭', '📡', '💉', '🩹',
      '🩺', '💊', '🚪', '🪞', '🪟', '🛏️', '🛋️', '🪑', '🚽', '🪠',
      '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣',
      '🧼', '🫧', '🪥', '🧽', '🛒', '📦', '🏷️', '✉️', '📩', '📨',
      '📧', '💌', '📮', '📫', '📪', '📬', '📭', '📜', '📄', '📑',
      '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📅', '📆', '📇', '🗃️',
      '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📕',
      '📗', '📘', '📙', '📚', '📖', '🔖', '🔗', '📎', '🖇️', '📐',
      '📏', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝',
      '✏️', '🔍', '🔎', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️'
    ]
  },
  symbols: {
    title: 'Símbolos',
    icon: 'shuffle',
    list: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
      '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳',
      '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
      '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️',
      '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️',
      '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓',
      '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️',
      '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠',
      'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂',
      '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦',
      '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🔢', '#️⃣', '*️⃣',
      '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣',
      '🔟', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏏️', '⏭️', '⏮️', '⏩',
      '⏪', '🔀', '🔁', '🔂', '◀️', '🔼', '🔽', '⏫', '⏬', '➡️',
      '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '🔄',
      '↪️', '↩️', '⤴️', '⤵️', '🔲', '🔳', '⚪', '⚫', '🔴', '🔵',
      '🟤', '🟣', '🟢', '🟡', '🟠', '🟥', '🟦', '🟫', '🟪', '🟩',
      '🟨', '🟧', '🔘', '🏁', '🚩', '🎌', '🏴', '🏳️'
    ]
  },
  flags: {
    title: 'Banderas',
    icon: 'flag',
    list: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇪🇸', '🇲🇽',
      '🇨🇴', '🇦🇷', '🇵🇪', '🇻🇪', '🇨🇱', '🇬🇹', '🇪🇨', '🇧🇴', '🇨🇺', '🇩🇴',
      '🇭🇳', '🇵🇾', '🇸🇻', '🇳🇮', '🇨🇷', '🇵🇦', '🇺🇾', '🇵🇷', '🇺🇸', '🇻🇦',
      '🇮🇹', '🇮🇱', '🇫🇷', '🇩🇪', '🇬🇧', '🇵🇹', '🇧🇷', '🇨🇦'
    ]
  }
};

// Diccionario de palabras clave para el buscador de emojis
const EMOJI_KEYWORDS = {
  '👍': 'pulgar arriba me gusta ok bien bueno like yes si siii (y) (Y)',
  '👎': 'pulgar abajo no me gusta malo dislike no (n) (N)',
  '❤️': 'corazon amor te quiero love heart <3 rojo',
  '💔': 'corazon roto desamor dolor broken </3',
  '🙏': 'rezar oracion por favor amen gracias manos juntas plegaria (pray) (amen)',
  '✝️': 'cruz jesus cristo iglesia crucifijo catolico cristiano fe (cross)',
  '🕊️': 'paloma paz espiritu santo ave blanca (dove)',
  '⛪': 'iglesia templo casa de dios capilla parroquia (church)',
  '📖': 'biblia libro lectura evangelio palabra sagrada (bible)',
  '🕯️': 'vela cirio luz oracion vigilia llama (candle)',
  '😂': 'risa carcajada llorar de risa diversion gracioso lol',
  '🤣': 'carcajada rodar de risa divertido',
  '😊': 'feliz sonrisa contento sonriente cara :) :-)',
  '😃': 'feliz alegria sonrisa abierta :D :-D',
  '😉': 'guino complice picardia ;) ;-)',
  '🔥': 'fuego llama caliente prendido fuego (fire)',
  '✨': 'brillo estrellas destellos magico reluciente (sparkles)',
  '👏': 'aplauso bravo felicitaciones aplaudir (clap)',
  '💯': 'cien perfecto excelente puntuacion (100)',
  '🎶': 'musica canto coro melodia notas (music)',
  '🎵': 'nota musical audio cancion',
  '🌹': 'rosa flor amor regalo virgen (rose)',
  '☀️': 'sol dia luz resplandor calor (sun)',
  '👼': 'angel querubin nino santo (angel)',
  '🎉': 'fiesta celebracion fiesta sorpresa felicidades (party)',
  '👌': 'ok perfecto genial de acuerdo (ok)',
  '👋': 'hola adios mano saludo (wave)',
  '😘': 'beso carino amor despedida (kiss)',
  '😎': 'gafas sol guay genial cool (cool)',
  '😢': 'triste llanto llorar lagrima pena :(',
  '😭': 'llanto desconsuelo lagrimas tristeza',
  '😮': 'sorpresa asombro boca abierta :O',
  '😍': 'enamorado ojos corazon encanto',
  '🥰': 'amor ternura corazones carinosa',
  '🙌': 'alabanza manos arriba aleluya gloria bendicion',
  '🤲': 'manos oracion recibir ofrenda suplica',
  '🤝': 'apreton manos pacto acuerdo paz trato hermandad',
  '💪': 'fuerza animo poder adelante musculo',
  '⭐': 'estrella noche brillante calificacion (star)'
};

// Sustitución de atajos de texto a emojis
function aplicarReemplazoEmoticonos(texto) {
  if (!texto) return '';
  let resultado = texto;
  for (const item of EMOTICON_MAP) {
    resultado = resultado.replace(item.regex, (match, p1, p2) => {
      if (typeof p1 === 'string' && typeof p2 === 'string') {
        return p1 + item.emoji;
      }
      return item.emoji;
    });
  }
  return resultado;
}

// Reemplazo en vivo mientras el usuario escribe en el textarea
function handleInputEmoticones(inputEl) {
  if (!inputEl) return;
  const original = inputEl.value;
  const converted = aplicarReemplazoEmoticonos(original);
  if (converted !== original) {
    const selStart = inputEl.selectionStart;
    const diff = converted.length - original.length;
    inputEl.value = converted;
    const newPos = Math.max(0, selStart + diff);
    inputEl.setSelectionRange(newPos, newPos);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupDomEvents();
  cargarEmojisRecientes();
  renderizarCuerpoEmojis();
  actualizarEstadoBotonEnviar();
  initAuth();
});

// 1. Inicialización de Autenticación y Firebase
function initAuth() {
  const checkFirebaseReady = () => {
    if (window.firebaseAPI && window.firebaseAPI.db) {
      db = window.firebaseAPI.db;
      window.firebaseAPI.onAuthReady(async (user) => {
        if (user) {
          currentUser = user;
          const email = (user.email || "").toLowerCase().trim();
          isAdmin = (email === ADMIN_EMAIL.toLowerCase()) || (window.firebaseAPI?.isAdmin && window.firebaseAPI.isAdmin());
          canViewAllChats = isAdmin || (typeof window.hasPermission === 'function' && window.hasPermission('chat_ver_todos', email));
          
          const myAvatar = document.getElementById('my-avatar');
          const myName = document.getElementById('my-display-name');
          const myRole = document.getElementById('my-user-role');

          if (myAvatar) myAvatar.src = user.photoURL || '/src/img/cristo.png';
          if (myName) myName.textContent = user.displayName || user.email.split('@')[0];
          if (myRole) myRole.textContent = isAdmin ? 'Administrador General' : (canViewAllChats ? 'Soporte / Asistencia' : 'Hermano');

          ocultarModalLogin();

          if (canViewAllChats) {
            initAdminView();
          } else {
            initHermanoView();
          }
        } else {
          mostrarModalLogin();
        }
      });
    } else {
      setTimeout(checkFirebaseReady, 200);
    }
  };

  checkFirebaseReady();
}

// 2. Vista para Administrador / Soporte
function initAdminView() {
  const sidebar = document.getElementById('wa-sidebar');
  if (sidebar) sidebar.style.display = 'flex';
  listenToAllChats();
}

// 3. Vista para Hermano Normal
function initHermanoView() {
  const searchSection = document.getElementById('wa-search-section');
  if (searchSection) searchSection.style.display = 'none';

  const chatListEl = document.getElementById('wa-chat-list');
  if (chatListEl) {
    chatListEl.innerHTML = `
      <div class="wa-chat-item active" id="hermano-admin-chat-item">
        <img src="/src/img/cristo.png" class="wa-avatar" alt="Admin" onerror="this.src='/src/img/icono.png'">
        <div class="wa-chat-item-info">
          <div class="wa-chat-item-row">
            <span class="wa-chat-item-name">Soporte y Administración</span>
            <span class="wa-chat-item-time" id="hermano-chat-time">En vivo</span>
          </div>
          <div class="wa-chat-item-row" style="margin-top: 2px;">
            <div class="wa-chat-item-msg" id="hermano-chat-last-msg">
              <span class="material-symbols-outlined" style="font-size: 14px; color: var(--wa-check-blue);">done_all</span>
              <span>Canal directo con el Administrador</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  activeChatId = currentUser.uid;
  activeChatUser = {
    id: currentUser.uid,
    displayName: 'Soporte y Administración (Liturgia)',
    email: ADMIN_EMAIL,
    photoURL: '/src/img/cristo.png'
  };

  actualizarHeaderChat(activeChatUser);
  escucharMensajesDeChat(activeChatId);

  document.getElementById('wa-app-root').classList.add('chat-open');
}

// 4. Escucha en tiempo real de todos los chats para el Administrador
function listenToAllChats() {
  if (unsubscribeChats) unsubscribeChats();

  const q = query(collection(db, 'support_chats'), orderBy('lastTimestamp', 'desc'), limit(100));

  unsubscribeChats = onSnapshot(q, async (snapshot) => {
    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });

    try {
      const regSnap = await getDocs(collection(db, 'registered_users'));
      regSnap.forEach(rDoc => {
        const uData = rDoc.data();
        if (uData.email && uData.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          const exists = list.some(c => c.userEmail && c.userEmail.toLowerCase() === uData.email.toLowerCase());
          if (!exists) {
            list.push({
              id: rDoc.id,
              userId: rDoc.id,
              userEmail: uData.email,
              userName: uData.displayName || uData.email.split('@')[0],
              userPhoto: uData.photoURL || '/src/img/cristo.png',
              lastMessage: 'Sin mensajes aún',
              lastTimestamp: 0,
              unreadAdmin: 0
            });
          }
        }
      });
    } catch (e) {
      console.warn("Aviso cargando usuarios registrados para chats:", e);
    }

    rawChatsList = list;
    renderAdminChatList();

    if (!activeChatId && rawChatsList.length > 0) {
      seleccionarChat(rawChatsList[0]);
    }
  }, (err) => {
    console.error("Error al escuchar chats:", err);
  });
}

// 5. Renderizar lista de chats en la barra lateral del Administrador
function renderAdminChatList() {
  const container = document.getElementById('wa-chat-list');
  if (!container) return;

  let filtered = [...rawChatsList];

  if (searchQuery.trim()) {
    const term = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(c => 
      (c.userName && c.userName.toLowerCase().includes(term)) ||
      (c.userEmail && c.userEmail.toLowerCase().includes(term)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(term))
    );
  }

  if (currentFilter === 'unread') {
    filtered = filtered.filter(c => (c.unreadAdmin || 0) > 0);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 30px 20px; text-align: center; color: var(--wa-text-secondary); font-size: 13.5px;">
        No se encontraron conversaciones.
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  filtered.forEach(chat => {
    const item = document.createElement('div');
    item.className = `wa-chat-item ${activeChatId === chat.id ? 'active' : ''}`;
    
    const timeFormatted = chat.lastTimestamp ? formatearHora(chat.lastTimestamp) : '';
    const unreadCount = chat.unreadAdmin || 0;
    const avatarSrc = chat.userPhoto || '/src/img/cristo.png';
    const name = chat.userName || chat.userEmail || 'Hermano';

    item.innerHTML = `
      <img src="${avatarSrc}" class="wa-avatar" alt="${escapeHtml(name)}" onerror="this.src='/src/img/cristo.png'">
      <div class="wa-chat-item-info">
        <div class="wa-chat-item-row">
          <span class="wa-chat-item-name">${escapeHtml(name)}</span>
          <span class="wa-chat-item-time">${timeFormatted}</span>
        </div>
        <div class="wa-chat-item-row" style="margin-top: 2px;">
          <div class="wa-chat-item-msg">
            <span>${escapeHtml(chat.lastMessage || 'Mensaje')}</span>
          </div>
          ${unreadCount > 0 ? `<span class="wa-badge-unread">${unreadCount}</span>` : ''}
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      seleccionarChat(chat);
      document.getElementById('wa-app-root').classList.add('chat-open');
    });

    container.appendChild(item);
  });
}

// 6. Seleccionar un chat para abrirlo en el panel principal
function seleccionarChat(chat) {
  activeChatId = chat.id;
  activeChatUser = {
    id: chat.userId || chat.id,
    displayName: chat.userName || chat.userEmail || 'Hermano',
    email: chat.userEmail,
    photoURL: chat.userPhoto || '/src/img/cristo.png'
  };

  actualizarHeaderChat(activeChatUser);
  renderAdminChatList();
  escucharMensajesDeChat(activeChatId);

  if (canViewAllChats && (chat.unreadAdmin || 0) > 0) {
    try {
      updateDoc(doc(db, 'support_chats', activeChatId), { unreadAdmin: 0 });
    } catch (e) {}
  }
}

// 7. Actualizar Cabecera del Chat Activo
function actualizarHeaderChat(chatUser) {
  const avatarEl = document.getElementById('active-chat-avatar');
  const nameEl = document.getElementById('active-chat-name');
  const statusEl = document.getElementById('active-chat-status');

  if (avatarEl) {
    avatarEl.src = chatUser.photoURL || '/src/img/cristo.png';
    avatarEl.onerror = () => { avatarEl.src = '/src/img/cristo.png'; };
  }
  if (nameEl) nameEl.textContent = chatUser.displayName;
  if (statusEl) {
    statusEl.textContent = canViewAllChats ? (chatUser.email || 'en línea') : 'en línea / Asistencia Litúrgica';
  }
}

// 8. Escuchar Mensajes en Vivo del Chat Activo
function escucharMensajesDeChat(chatId) {
  if (unsubscribeMessages) unsubscribeMessages();

  const messagesArea = document.getElementById('wa-messages-area');
  if (messagesArea) {
    messagesArea.innerHTML = `
      <div class="wa-date-divider">Cargando mensajes...</div>
    `;
  }

  const msgsCol = collection(db, 'support_chats', chatId, 'messages');
  const q = query(msgsCol, orderBy('timestamp', 'asc'), limit(200));

  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    const msgs = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const hiddenFor = data.hiddenFor || [];
      if (!hiddenFor.includes(currentUser.uid)) {
        msgs.push({ id: docSnap.id, ...data });
      }
    });

    renderizarMensajes(msgs);
  }, (err) => {
    console.error("Error al escuchar mensajes:", err);
  });
}

// 9. Renderizar Mensajes en el Área de Chat
function renderizarMensajes(msgs) {
  const messagesArea = document.getElementById('wa-messages-area');
  if (!messagesArea) return;

  messagesArea.innerHTML = '';

  if (msgs.length === 0) {
    messagesArea.innerHTML = `
      <div class="wa-date-divider">Hoy</div>
      <div style="text-align: center; margin: 40px auto; max-width: 320px; background: rgba(32, 44, 51, 0.9); padding: 14px 18px; border-radius: 12px; color: var(--wa-text-secondary); font-size: 13px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        <span class="material-symbols-outlined" style="font-size: 28px; color: var(--wa-accent); display: block; margin-bottom: 6px;">lock</span>
        Los mensajes de este chat son privados y directos para darte asistencia técnica y fraternal en Liturgia de las Horas.
      </div>
    `;
    return;
  }

  let lastDateStr = '';

  msgs.forEach((msg) => {
    const msgDate = new Date(msg.timestamp || Date.now());
    const dateStr = formatearFechaCabecera(msgDate);

    if (dateStr !== lastDateStr) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'wa-date-divider';
      dateDiv.textContent = dateStr;
      messagesArea.appendChild(dateDiv);
      lastDateStr = dateStr;
    }

    const isMine = (msg.senderEmail === currentUser.email) || (msg.senderId === currentUser.uid);
    const row = document.createElement('div');
    row.className = `wa-message-row ${isMine ? 'out' : 'in'}`;

    const bubble = document.createElement('div');
    bubble.className = `wa-bubble ${isMine ? 'out' : 'in'}`;

    let imgHTML = '';
    if (msg.imageUrl && !msg.deletedForEveryone) {
      imgHTML = `
        <div class="wa-bubble-image-wrap" data-img-url="${msg.imageUrl}">
          <img src="${msg.imageUrl}" class="wa-bubble-image" alt="Foto adjunta">
        </div>
      `;
    }

    let senderHTML = '';
    if (canViewAllChats && !isMine) {
      const nombreUsuario = msg.senderName || (activeChatUser?.displayName) || msg.senderEmail?.split('@')[0] || 'Hermano';
      const emailUsuario = msg.senderEmail ? `<span class="wa-sender-label-sub">(${escapeHtml(msg.senderEmail)})</span>` : '';
      senderHTML = `<div class="wa-sender-label"><span>👤 ${escapeHtml(nombreUsuario)}</span> ${emailUsuario}</div>`;
    }

    let textHTML = '';
    if (msg.deletedForEveryone) {
      textHTML = `<span class="wa-bubble-text" style="font-style: italic; color: var(--wa-text-secondary);"><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: -2px;">block</span> Este mensaje fue eliminado</span>`;
    } else {
      textHTML = `<span class="wa-bubble-text">${formatearTextoMensaje(msg.text)}</span>`;
    }

    const timeStr = formatearHora(msg.timestamp || Date.now());
    const editedBadge = msg.edited ? `<span class="wa-edited-badge">(editado)</span>` : '';
    const statusIcon = isMine 
      ? `<span class="material-symbols-outlined wa-check-icon" style="color: var(--wa-check-blue);">done_all</span>` 
      : '';

    let reactionsHTML = '';
    if (msg.reactions && typeof msg.reactions === 'object' && Object.keys(msg.reactions).length > 0) {
      const counts = {};
      Object.values(msg.reactions).forEach(emoji => {
        counts[emoji] = (counts[emoji] || 0) + 1;
      });
      const pills = Object.entries(counts).map(([emoji, count]) => {
        return `<span class="wa-reaction-pill">${emoji} ${count > 1 ? count : ''}</span>`;
      }).join('');
      reactionsHTML = `<div class="wa-bubble-reactions">${pills}</div>`;
    }

    const myEmail = (currentUser?.email || "").toLowerCase().trim();
    const canDeleteMsg = isAdmin || (typeof window.hasPermission !== 'function') || window.hasPermission('chat_eliminar', myEmail);

    bubble.innerHTML = `
      ${senderHTML}
      ${imgHTML}
      ${textHTML}
      <div class="wa-bubble-meta">
        ${editedBadge}
        <span>${timeStr}</span>
        ${statusIcon}
      </div>
      ${reactionsHTML}

      <!-- Botón de reacción flotante exterior estilo WhatsApp (visible al pasar el ratón) -->
      <button type="button" class="wa-bubble-reaction-trigger btn-trigger-reaction" title="Reaccionar">
        <span class="material-symbols-outlined">sentiment_satisfied</span>
      </button>

      <!-- Botón menú chevron contextual dentro de la burbuja (visible al pasar el ratón) -->
      <button type="button" class="wa-bubble-menu-trigger btn-trigger-menu" title="Opciones de mensaje">
        <span class="material-symbols-outlined">expand_more</span>
      </button>

      <!-- Menú de Reacciones Rápidas -->
      <div class="wa-reaction-bar" style="display: none;">
        ${REACTION_EMOJIS.map(e => `<button type="button" class="wa-reaction-emoji-btn" data-emoji="${e}">${e}</button>`).join('')}
      </div>

      <!-- Dropdown Opciones -->
      <div class="wa-msg-menu-dropdown" style="display: none;">
        <button type="button" class="wa-msg-menu-item btn-msg-copy">
          <span class="material-symbols-outlined" style="font-size: 17px;">content_copy</span>
          <span>Copiar</span>
        </button>
        ${(isMine && !msg.deletedForEveryone) ? `
          <button type="button" class="wa-msg-menu-item btn-msg-edit">
            <span class="material-symbols-outlined" style="font-size: 17px;">edit</span>
            <span>Editar</span>
          </button>
        ` : ''}
        ${canDeleteMsg ? `
          <button type="button" class="wa-msg-menu-item danger btn-msg-delete">
            <span class="material-symbols-outlined" style="font-size: 17px;">delete</span>
            <span>Eliminar</span>
          </button>
        ` : ''}
      </div>
    `;

    // Eventos de la burbuja
    const btnReaction = bubble.querySelector('.btn-trigger-reaction');
    const reactionBar = bubble.querySelector('.wa-reaction-bar');
    const btnMenu = bubble.querySelector('.btn-trigger-menu');
    const menuDropdown = bubble.querySelector('.wa-msg-menu-dropdown');
    const copyBtn = bubble.querySelector('.btn-msg-copy');
    const editBtn = bubble.querySelector('.btn-msg-edit');
    const deleteBtn = bubble.querySelector('.btn-msg-delete');

    if (btnReaction && reactionBar) {
      btnReaction.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.wa-reaction-bar, .wa-msg-menu-dropdown').forEach(el => {
          if (el !== reactionBar) el.style.display = 'none';
        });
        reactionBar.style.display = (reactionBar.style.display === 'flex') ? 'none' : 'flex';
      });
    }

    if (reactionBar) {
      reactionBar.querySelectorAll('.wa-reaction-emoji-btn, .wa-quick-emoji').forEach(btn => {
        btn.addEventListener('click', () => {
          reactionBar.style.display = 'none';
          toggleReaccionMensaje(msg.id, btn.getAttribute('data-emoji'));
        });
      });
    }

    if (btnMenu && menuDropdown) {
      btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.wa-reaction-bar, .wa-msg-menu-dropdown').forEach(el => {
          if (el !== menuDropdown) el.style.display = 'none';
        });
        menuDropdown.style.display = (menuDropdown.style.display === 'flex' || menuDropdown.style.display === 'block') ? 'none' : 'flex';
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (menuDropdown) menuDropdown.style.display = 'none';
        if (msg.text) {
          navigator.clipboard.writeText(msg.text);
        }
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (menuDropdown) menuDropdown.style.display = 'none';
        abrirModalEditar(msg);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (menuDropdown) menuDropdown.style.display = 'none';
        abrirModalEliminar(msg);
      });
    }

    const imgWrap = bubble.querySelector('.wa-bubble-image-wrap');
    if (imgWrap) {
      imgWrap.addEventListener('click', () => {
        abrirLightbox(imgWrap.getAttribute('data-img-url'));
      });
    }

    row.appendChild(bubble);
    messagesArea.appendChild(row);
  });

  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// 10. Enviar un Mensaje
async function enviarMensaje() {
  const userEmail = (currentUser?.email || "").toLowerCase().trim();
  const canSend = isAdmin || (typeof window.hasPermission !== 'function') || window.hasPermission('chat_enviar', userEmail);
  if (!canSend) {
    alert("No dispones de permisos para enviar mensajes en el chat.");
    return;
  }

  const inputEl = document.getElementById('chat-input-text');
  let text = inputEl ? inputEl.value.trim() : '';
  text = aplicarReemplazoEmoticonos(text).trim();

  if (!text && !pendingImageBase64) return;
  if (!activeChatId) return;

  const now = Date.now();
  const resolvedDisplayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Hermano';

  const newMsg = {
    senderId: currentUser.uid,
    senderEmail: currentUser.email,
    senderName: resolvedDisplayName,
    senderPhoto: currentUser.photoURL || '/src/img/cristo.png',
    isAdmin: isAdmin,
    text: text,
    imageUrl: pendingImageBase64 || null,
    timestamp: now,
    edited: false,
    editedAt: null,
    deletedForEveryone: false,
    hiddenFor: [],
    reactions: {}
  };

  if (inputEl) {
    inputEl.value = '';
    inputEl.style.height = 'auto';
  }
  removerImagenAdjunta();
  actualizarEstadoBotonEnviar();

  try {
    await addDoc(collection(db, 'support_chats', activeChatId, 'messages'), newMsg);

    const chatDocRef = doc(db, 'support_chats', activeChatId);
    const chatDocSnap = await getDoc(chatDocRef);
    const prevData = chatDocSnap.exists() ? chatDocSnap.data() : {};

    const updatedChatHeader = {
      chatId: activeChatId,
      userId: isAdmin ? (activeChatUser.id || activeChatId) : currentUser.uid,
      userEmail: isAdmin ? (activeChatUser.email || prevData.userEmail || '') : currentUser.email,
      userName: isAdmin ? (activeChatUser.displayName || prevData.userName || 'Hermano') : resolvedDisplayName,
      userPhoto: isAdmin ? (activeChatUser.photoURL || prevData.userPhoto || '/src/img/cristo.png') : (currentUser.photoURL || '/src/img/cristo.png'),
      lastMessage: text || (pendingImageBase64 ? '📷 Foto' : 'Mensaje'),
      lastTimestamp: now,
      lastSenderEmail: currentUser.email,
      unreadAdmin: isAdmin ? 0 : (prevData.unreadAdmin || 0) + 1,
      unreadUser: isAdmin ? (prevData.unreadUser || 0) + 1 : 0
    };

    await setDoc(chatDocRef, updatedChatHeader, { merge: true });
  } catch (err) {
    console.error("Error enviando mensaje:", err);
    alert("No se pudo enviar el mensaje. Verifica tu conexión a internet.");
  }
}

// 11. Modal: Eliminar Mensaje
function abrirModalEliminar(msg) {
  const userEmail = (currentUser?.email || "").toLowerCase().trim();
  const canDelete = isAdmin || (typeof window.hasPermission !== 'function') || window.hasPermission('chat_eliminar', userEmail);
  if (!canDelete) {
    alert("No dispones de permisos para eliminar mensajes.");
    return;
  }

  targetMessageData = msg;
  const overlay = document.getElementById('modal-delete-overlay');
  const btnEveryone = document.getElementById('btn-delete-for-everyone');
  const descEl = document.getElementById('modal-delete-desc');

  const isMine = (msg.senderEmail === currentUser.email) || (msg.senderId === currentUser.uid);
  const ageMs = Date.now() - (msg.timestamp || 0);
  const isWithin5Min = ageMs <= FIVE_MINUTES_MS;

  if (isMine && isWithin5Min && !msg.deletedForEveryone) {
    btnEveryone.style.display = 'block';
    descEl.textContent = 'Este mensaje fue enviado hace menos de 5 minutos. Puedes eliminarlo para ambos o solo para ti.';
  } else {
    btnEveryone.style.display = 'none';
    descEl.textContent = 'Ha transcurrido el tiempo límite de 5 minutos para eliminar para todos. Solo puedes eliminarlo de tu vista (Eliminar para mí).';
  }

  overlay.classList.add('show');
}

async function ejecutarEliminarParaTodos() {
  if (!targetMessageData || !activeChatId) return;
  try {
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', targetMessageData.id);
    await updateDoc(msgRef, {
      deletedForEveryone: true,
      text: '',
      imageUrl: null,
      deletedAt: Date.now()
    });
    cerrarModales();
  } catch (err) {
    console.error("Error al eliminar para todos:", err);
  }
}

async function ejecutarEliminarParaMi() {
  if (!targetMessageData || !activeChatId) return;
  try {
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', targetMessageData.id);
    const hiddenFor = targetMessageData.hiddenFor || [];
    if (!hiddenFor.includes(currentUser.uid)) {
      hiddenFor.push(currentUser.uid);
    }
    await updateDoc(msgRef, { hiddenFor: hiddenFor });
    cerrarModales();
  } catch (err) {
    console.error("Error al eliminar para mí:", err);
  }
}

// 12. Modal: Editar Mensaje
function abrirModalEditar(msg) {
  targetMessageData = msg;
  const overlay = document.getElementById('modal-edit-overlay');
  const inputEl = document.getElementById('modal-edit-text');

  if (inputEl) inputEl.value = msg.text || '';
  overlay.classList.add('show');
  if (inputEl) inputEl.focus();
}

async function ejecutarGuardarEdicion() {
  if (!targetMessageData || !activeChatId) return;
  const inputEl = document.getElementById('modal-edit-text');
  const newText = inputEl ? inputEl.value.trim() : '';

  if (!newText) {
    alert("El mensaje no puede estar vacío.");
    return;
  }

  try {
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', targetMessageData.id);
    await updateDoc(msgRef, {
      text: newText,
      edited: true,
      editedAt: Date.now()
    });
    cerrarModales();
  } catch (err) {
    console.error("Error al editar mensaje:", err);
  }
}

// 13. Reaccionar a Mensaje
async function toggleReaccionMensaje(messageId, emoji) {
  if (!activeChatId || !currentUser) return;
  try {
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', messageId);
    const snap = await getDoc(msgRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const reactions = data.reactions || {};

    if (reactions[currentUser.uid] === emoji) {
      delete reactions[currentUser.uid];
    } else {
      reactions[currentUser.uid] = emoji;
    }

    await updateDoc(msgRef, { reactions });
  } catch (e) {
    console.error("Error al reaccionar:", e);
  }
}

// 14. Emojis Panel (Motor Completo WhatsApp Web)
function cargarEmojisRecientes() {
  try {
    const stored = JSON.parse(localStorage.getItem('wa_lh_recent_emojis') || '[]');
    if (Array.isArray(stored) && stored.length > 0) {
      EMOJI_CATEGORIES.recent.list = stored;
    } else {
      EMOJI_CATEGORIES.recent.list = ['👍', '❤️', '😂', '🙏', '😊', '✝️', '🕊️', '📖', '🙌', '👏', '🔥', '✨', '🎶', '⛪', '🕯️', '🥰', '😍', '🎉'];
    }
  } catch (e) {
    EMOJI_CATEGORIES.recent.list = ['👍', '❤️', '😂', '🙏', '😊', '✝️', '🕊️', '📖', '🙌', '👏', '🔥', '✨', '🎶', '⛪', '🕯️', '🥰', '😍', '🎉'];
  }
}

function guardarEmojiReciente(emoji) {
  if (!emoji) return;
  let recents = [];
  try {
    recents = JSON.parse(localStorage.getItem('wa_lh_recent_emojis') || '[]');
  } catch (e) {}
  recents = [emoji, ...recents.filter(e => e !== emoji)].slice(0, 40);
  try {
    localStorage.setItem('wa_lh_recent_emojis', JSON.stringify(recents));
  } catch (e) {}
  EMOJI_CATEGORIES.recent.list = recents;
}

function filtrarEmojisPorBusqueda(query) {
  const term = query.toLowerCase().trim();
  if (!term) return [];

  const found = new Set();
  
  // Buscar en diccionario de palabras clave asociadas
  for (const [emoji, kw] of Object.entries(EMOJI_KEYWORDS)) {
    if (kw.toLowerCase().includes(term) || emoji.includes(term)) {
      found.add(emoji);
    }
  }

  // Buscar en nombres de categorías y listas de emojis
  for (const [catKey, catData] of Object.entries(EMOJI_CATEGORIES)) {
    if (catKey === 'recent') continue;
    if (catData.title.toLowerCase().includes(term)) {
      catData.list.forEach(e => found.add(e));
    } else {
      catData.list.forEach(e => {
        if (e.includes(term)) found.add(e);
      });
    }
  }

  return Array.from(found);
}

function renderizarCuerpoEmojis(searchQuery = '') {
  const container = document.getElementById('wa-emoji-scroll-body');
  if (!container) return;

  container.innerHTML = '';

  if (searchQuery.trim()) {
    const results = filtrarEmojisPorBusqueda(searchQuery);
    const titleDiv = document.createElement('div');
    titleDiv.className = 'wa-emoji-section-title';
    titleDiv.textContent = results.length > 0 ? `Resultados de "${searchQuery.trim()}"` : 'No se encontraron resultados';
    container.appendChild(titleDiv);

    if (results.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'wa-emoji-section-grid';
      grid.innerHTML = results.map(e => `<button type="button" class="wa-emoji-btn" data-emoji="${e}">${e}</button>`).join('');
      container.appendChild(grid);
    } else {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'text-align: center; color: var(--wa-text-secondary); padding: 30px 10px; font-size: 13px;';
      emptyMsg.textContent = 'No se encontró ningún emoji coincidente.';
      container.appendChild(emptyMsg);
    }
  } else {
    // Renderizar todas las categorías oficiales de WhatsApp Web
    for (const [key, cat] of Object.entries(EMOJI_CATEGORIES)) {
      if (!cat.list || cat.list.length === 0) continue;

      const titleDiv = document.createElement('div');
      titleDiv.className = 'wa-emoji-section-title';
      titleDiv.id = `emoji-section-${key}`;
      titleDiv.textContent = cat.title;
      container.appendChild(titleDiv);

      const grid = document.createElement('div');
      grid.className = 'wa-emoji-section-grid';
      grid.innerHTML = cat.list.map(e => `<button type="button" class="wa-emoji-btn" data-emoji="${e}">${e}</button>`).join('');
      container.appendChild(grid);
    }
  }

  // Asignar eventos de clic a los emojis
  container.querySelectorAll('.wa-emoji-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const emoji = btn.getAttribute('data-emoji');
      insertarTextoEnInput(emoji);
      guardarEmojiReciente(emoji);
      actualizarEstadoBotonEnviar();
    });
  });
}

function insertarTextoEnInput(str) {
  const inputEl = document.getElementById('chat-input-text');
  if (!inputEl) return;

  const start = inputEl.selectionStart || inputEl.value.length;
  const end = inputEl.selectionEnd || inputEl.value.length;
  const val = inputEl.value;

  inputEl.value = val.substring(0, start) + str + val.substring(end);
  inputEl.selectionStart = inputEl.selectionEnd = start + str.length;
  inputEl.focus();
}

function actualizarEstadoBotonEnviar() {
  const inputEl = document.getElementById('chat-input-text');
  const btnSend = document.getElementById('btn-send-message');
  if (!btnSend) return;

  const hasContent = (inputEl && inputEl.value.trim().length > 0) || (pendingImageBase64 !== null);
  const iconSpan = btnSend.querySelector('.material-symbols-outlined');
  
  if (hasContent) {
    if (iconSpan) iconSpan.textContent = 'send';
    btnSend.title = 'Enviar mensaje';
  } else {
    if (iconSpan) iconSpan.textContent = 'mic';
    btnSend.title = 'Mensaje de voz';
  }
}

// 15. Adjuntar y Comprimir Imagen
function procesarImagenSeleccionada(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert("Solo se permite adjuntar archivos de imagen.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 800;
      let w = img.width;
      let h = img.height;

      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const base64 = canvas.toDataURL('image/jpeg', 0.75);
      pendingImageBase64 = base64;

      const previewBar = document.getElementById('img-preview-bar');
      const thumb = document.getElementById('img-preview-thumb');
      const nameEl = document.getElementById('img-preview-name');

      if (thumb) thumb.src = base64;
      if (nameEl) nameEl.textContent = file.name || 'Captura_pantalla.png';
      if (previewBar) previewBar.style.display = 'flex';
      actualizarEstadoBotonEnviar();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removerImagenAdjunta() {
  pendingImageBase64 = null;
  const previewBar = document.getElementById('img-preview-bar');
  const fileInput = document.getElementById('file-input-image');
  if (previewBar) previewBar.style.display = 'none';
  if (fileInput) fileInput.value = '';
  actualizarEstadoBotonEnviar();
}

// 16. Lightbox
function abrirLightbox(url) {
  const lightbox = document.getElementById('wa-lightbox');
  const img = document.getElementById('lightbox-img');
  if (img) img.src = url;
  if (lightbox) lightbox.classList.add('show');
}

function cerrarLightbox() {
  const lightbox = document.getElementById('wa-lightbox');
  if (lightbox) lightbox.classList.remove('show');
}

// 17. Cerrar Modales
function cerrarModales() {
  document.querySelectorAll('.wa-modal-overlay, .wa-lightbox-overlay').forEach(el => {
    el.classList.remove('show');
  });
  targetMessageData = null;
}

function mostrarModalLogin() {
  const modal = document.getElementById('modal-login-overlay');
  if (modal) modal.classList.add('show');
}

function ocultarModalLogin() {
  const modal = document.getElementById('modal-login-overlay');
  if (modal) modal.classList.remove('show');
}

// 18. Configurar Eventos del DOM
function setupDomEvents() {
  // Pegar capturas de pantalla desde el portapapeles (PrintScreen / Recorte / Ctrl+V)
  window.addEventListener('paste', (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    if (!items || items.length === 0) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          procesarImagenSeleccionada(file);
          return;
        }
      }
    }
  });

  // Enviar mensaje al hacer clic
  const btnSend = document.getElementById('btn-send-message');
  if (btnSend) btnSend.addEventListener('click', enviarMensaje);

  // Enter para enviar en textarea (Shift+Enter para salto de línea)
  const inputEl = document.getElementById('chat-input-text');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
      }
    });
    // Auto-ajuste de altura y conversión en vivo de atajos de texto a emojis
    inputEl.addEventListener('input', () => {
      handleInputEmoticones(inputEl);
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
      actualizarEstadoBotonEnviar();
    });
  }

  // Alternador de panel de Emojis
  const btnEmoji = document.getElementById('btn-toggle-emoji');
  const emojiPanel = document.getElementById('wa-emoji-panel');
  if (btnEmoji && emojiPanel) {
    btnEmoji.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPanel.classList.toggle('show');
      if (emojiPanel.classList.contains('show')) {
        renderizarCuerpoEmojis();
        const searchInput = document.getElementById('input-search-emoji');
        if (searchInput) searchInput.focus();
      }
    });
  }
  if (emojiPanel) {
    emojiPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Buscador de emojis
  const emojiSearchInput = document.getElementById('input-search-emoji');
  const clearEmojiSearchBtn = document.getElementById('btn-clear-emoji-search');
  if (emojiSearchInput) {
    emojiSearchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      if (clearEmojiSearchBtn) {
        clearEmojiSearchBtn.style.display = q ? 'flex' : 'none';
      }
      renderizarCuerpoEmojis(q);
    });
  }
  if (clearEmojiSearchBtn && emojiSearchInput) {
    clearEmojiSearchBtn.addEventListener('click', () => {
      emojiSearchInput.value = '';
      clearEmojiSearchBtn.style.display = 'none';
      renderizarCuerpoEmojis('');
      emojiSearchInput.focus();
    });
  }

  // Navegación de categorías del panel de Emojis
  document.querySelectorAll('.wa-emoji-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      document.querySelectorAll('.wa-emoji-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (emojiSearchInput && emojiSearchInput.value) {
        emojiSearchInput.value = '';
        if (clearEmojiSearchBtn) clearEmojiSearchBtn.style.display = 'none';
        renderizarCuerpoEmojis('');
      }

      const targetSection = document.getElementById(`emoji-section-${cat}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Detección de scroll para actualizar la categoría activa en el encabezado
  const emojiScrollBody = document.getElementById('wa-emoji-scroll-body');
  if (emojiScrollBody) {
    emojiScrollBody.addEventListener('scroll', () => {
      if (emojiSearchInput && emojiSearchInput.value.trim()) return;
      const sections = emojiScrollBody.querySelectorAll('.wa-emoji-section-title');
      let currentCat = 'recent';
      const scrollPos = emojiScrollBody.scrollTop + 45;

      sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) {
          const id = sec.id.replace('emoji-section-', '');
          if (id) currentCat = id;
        }
      });

      document.querySelectorAll('.wa-emoji-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === currentCat);
      });
    });
  }

  // Pestañas inferiores (Emojis, GIF, Stickers)
  document.querySelectorAll('.wa-emoji-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.wa-emoji-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Adjuntar imagen
  const btnAttach = document.getElementById('btn-attach-clip');
  const fileInput = document.getElementById('file-input-image');
  if (btnAttach && fileInput) {
    btnAttach.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        procesarImagenSeleccionada(e.target.files[0]);
      }
    });
  }

  const btnRemoveImg = document.getElementById('btn-remove-img');
  if (btnRemoveImg) {
    btnRemoveImg.addEventListener('click', removerImagenAdjunta);
  }

  // Botón atrás en móvil
  const btnBack = document.getElementById('btn-back-sidebar');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      document.getElementById('wa-app-root').classList.remove('chat-open');
    });
  }

  // Buscador de chats
  const searchInput = document.getElementById('input-search-users');
  const clearBtn = document.getElementById('btn-clear-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
      renderAdminChatList();
    });
  }
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderAdminChatList();
      searchInput.focus();
    });
  }

  // Chips de filtro
  document.querySelectorAll('.wa-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.wa-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter') || 'all';
      renderAdminChatList();
    });
  });

  // Menús desplegables de cabeceras
  const btnSidebarMenu = document.getElementById('btn-sidebar-menu');
  const dropdownSidebarMenu = document.getElementById('dropdown-sidebar-menu');
  if (btnSidebarMenu && dropdownSidebarMenu) {
    btnSidebarMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownSidebarMenu.classList.toggle('show');
    });
  }

  const btnInfoChat = document.getElementById('btn-info-chat');
  const dropdownChatMenu = document.getElementById('dropdown-chat-menu');
  if (btnInfoChat && dropdownChatMenu) {
    btnInfoChat.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownChatMenu.classList.toggle('show');
    });
  }

  // Alternador de tema modo oscuro
  const syncThemeInputs = () => {
    const isDark = !document.body.classList.contains('theme-light') && !document.body.classList.contains('theme-sepia');
    document.querySelectorAll('.switch-theme-input').forEach(sw => {
      sw.checked = isDark;
    });
  };
  syncThemeInputs();

  document.querySelectorAll('.switch-theme-input').forEach(sw => {
    sw.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      document.body.className = 'theme-' + newTheme;
      document.documentElement.className = 'theme-' + newTheme;
      localStorage.setItem('theme', newTheme);
      syncThemeInputs();
    });
  });

  // Cierre de menús flotantes al hacer clic fuera
  document.addEventListener('click', () => {
    document.querySelectorAll('.wa-dropdown-menu, .wa-reaction-bar, .wa-msg-menu-dropdown').forEach(el => {
      el.classList.remove('show');
      if (el.style.display === 'flex' || el.style.display === 'block') {
        el.style.display = 'none';
      }
    });
    if (emojiPanel && emojiPanel.classList.contains('show')) {
      emojiPanel.classList.remove('show');
    }
  });

  // Modales
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnDeleteForMe = document.getElementById('btn-delete-for-me');
  const btnDeleteEveryone = document.getElementById('btn-delete-for-everyone');
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', cerrarModales);
  if (btnDeleteForMe) btnDeleteForMe.addEventListener('click', ejecutarEliminarParaMi);
  if (btnDeleteEveryone) btnDeleteEveryone.addEventListener('click', ejecutarEliminarParaTodos);

  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnSaveEdit = document.getElementById('btn-save-edit');
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', cerrarModales);
  if (btnSaveEdit) btnSaveEdit.addEventListener('click', ejecutarGuardarEdicion);

  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  const lightbox = document.getElementById('wa-lightbox');
  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', cerrarLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) cerrarLightbox();
    });
  }

  // Modal Login
  const btnLoginModal = document.getElementById('btn-login-modal');
  if (btnLoginModal) {
    btnLoginModal.addEventListener('click', () => {
      if (window.firebaseAPI?.login) {
        window.firebaseAPI.login();
      }
    });
  }
}

// Funciones Auxiliares de Formato
function formatearHora(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function formatearFechaCabecera(d) {
  const hoy = new Date();
  const esHoy = (d.toDateString() === hoy.toDateString());
  if (esHoy) return 'Hoy';

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const esAyer = (d.toDateString() === ayer.toDateString());
  if (esAyer) return 'Ayer';

  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatearTextoMensaje(text) {
  if (!text) return '';
  let escaped = escapeHtml(text);
  // Reemplazar saltos de línea
  escaped = escaped.replace(/\n/g, '<br>');
  return escaped;
}
