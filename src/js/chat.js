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
const EDIT_TIME_LIMIT_MS = 8 * 60 * 1000; // 8 minutos para editar
const DELETE_EVERYONE_LIMIT_MS = 10 * 60 * 1000; // 10 minutos para eliminar para todos

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

// Variables para modales y menús
let targetMessageData = null;
let replyingToMessage = null;
let activeContextMenuMessage = null;
let activeReactionsMessage = null;
let activeFilterEmoji = 'all';
let activeReactionTargetMsgId = null;

// Variables de grabación de audio (Notas de voz - límite 20s)
const MAX_VOICE_SECONDS = 20;
let mediaRecorder = null;
let audioChunks = [];
let voiceRecordInterval = null;
let voiceRecordSeconds = 0;
let mediaStream = null;
let isRecordingVoice = false;
let currentlyPlayingAudio = null;

// Cargar e inicializar tamaño de iconos de reacción configurado en Ajustes
function aplicarPreferenciaTamanoReaccion() {
  const savedSize = localStorage.getItem('pref-chat-reaction-size') || '24px';
  document.documentElement.style.setProperty('--chat-reaction-size', savedSize);
}
aplicarPreferenciaTamanoReaccion();
window.addEventListener('lh-chat-reaction-size-changed', (e) => {
  if (e.detail && e.detail.size) {
    document.documentElement.style.setProperty('--chat-reaction-size', e.detail.size);
  }
});

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

    let quoteHTML = '';
    if (msg.replyTo) {
      quoteHTML = `
        <div class="wa-bubble-quote">
          <span class="wa-bubble-quote-sender">${escapeHtml(msg.replyTo.senderName || 'Hermano')}</span>
          <span class="wa-bubble-quote-text">${escapeHtml(msg.replyTo.text || '')}</span>
        </div>
      `;
    }

    let audioHTML = '';
    if (msg.audioUrl && !msg.deletedForEveryone) {
      const durSec = msg.audioDuration || 0;
      const durFormatted = formatearSegundos(durSec);
      const userPhoto = msg.senderPhoto || (isMine ? (currentUser.photoURL || '/src/img/cristo.png') : (activeChatUser?.photoURL || '/src/img/cristo.png'));
      audioHTML = `
        <div class="wa-bubble-audio-player" data-audio-id="${msg.id}">
          <button type="button" class="wa-audio-play-btn" title="Reproducir audio">
            <span class="material-symbols-outlined">play_arrow</span>
          </button>
          <div class="wa-audio-track-wrap">
            <div class="wa-audio-waveform">
              <input type="range" class="wa-audio-slider" min="0" max="100" value="0" step="0.5">
            </div>
            <div class="wa-audio-meta-row">
              <span class="wa-audio-timer">${durFormatted || '0:00'}</span>
              <button type="button" class="wa-audio-speed-btn" title="Velocidad">1x</button>
            </div>
          </div>
          <div class="wa-audio-avatar-wrap">
            <img src="${userPhoto}" class="wa-audio-avatar" alt="Avatar" onerror="this.src='/src/img/cristo.png'">
            <span class="wa-audio-mic-badge material-symbols-outlined">mic</span>
          </div>
          <audio class="wa-native-audio" src="${msg.audioUrl}" preload="metadata"></audio>
        </div>
      `;
    }

    let textHTML = '';
    if (msg.deletedForEveryone) {
      textHTML = `<span class="wa-bubble-text" style="font-style: italic; color: var(--wa-text-secondary);"><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: -2px;">block</span> Este mensaje fue eliminado</span>`;
    } else if (msg.text) {
      textHTML = `<span class="wa-bubble-text">${formatearTextoMensaje(msg.text)}</span>`;
    }

    const timeStr = formatearHora(msg.timestamp || Date.now());
    const editedBadge = msg.edited ? `<span class="wa-edited-badge">(editado)</span>` : '';
    const statusIcon = isMine 
      ? `<span class="material-symbols-outlined wa-check-icon" style="color: var(--wa-check-blue);">done_all</span>` 
      : '';

    // Reacciones: Renderizar badge agrupado limpio en la esquina inferior izquierda (Imágenes 3 y 4)
    let reactionsHTML = '';
    let hasReactions = false;
    let hasMyReaction = false;
    if (msg.reactions && typeof msg.reactions === 'object' && Object.keys(msg.reactions).length > 0) {
      const counts = {};
      let totalReactions = 0;
      Object.entries(msg.reactions).forEach(([uid, r]) => {
        const emoji = typeof r === 'string' ? r : r?.emoji;
        if (emoji) {
          counts[emoji] = (counts[emoji] || 0) + 1;
          totalReactions++;
          if (currentUser && uid === currentUser.uid) {
            hasMyReaction = true;
          }
        }
      });

      if (totalReactions > 0) {
        hasReactions = true;
        const emojisGroup = Object.keys(counts).join(' ');
        const countSpan = totalReactions > 1 ? `<span class="wa-reaction-count">${totalReactions}</span>` : '';
        reactionsHTML = `
          <div class="wa-bubble-reactions btn-open-reactions-modal" title="Ver reacciones">
            <span class="wa-reaction-pill ${hasMyReaction ? 'has-mine' : ''}">
              <span>${emojisGroup}</span> ${countSpan}
            </span>
          </div>
        `;
      }
    }

    const bubble = document.createElement('div');
    bubble.className = `wa-bubble ${isMine ? 'out' : 'in'} ${hasReactions ? 'has-reactions' : ''} ${msg.audioUrl ? 'has-audio' : ''}`;
    bubble.id = 'wa-msg-' + msg.id;

    const pinBadge = msg.pinned ? `<span class="material-symbols-outlined wa-pinned-badge" title="Mensaje fijado">keep</span>` : '';

    bubble.innerHTML = `
      ${senderHTML}
      ${quoteHTML}
      ${imgHTML}
      ${audioHTML}
      ${textHTML}
      <div class="wa-bubble-meta">
        ${pinBadge}
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

      <!-- Menú flotante de Reacciones Rápidas casi arriba del icono de la carita -->
      <div class="wa-reaction-bar" style="display: none;">
        ${REACTION_EMOJIS.map(e => `<button type="button" class="wa-reaction-emoji-btn" data-emoji="${e}">${e}</button>`).join('')}
        <button type="button" class="wa-reaction-add-btn" title="Más emojis">+</button>
      </div>
    `;

    // Eventos de la burbuja
    const btnReaction = bubble.querySelector('.btn-trigger-reaction');
    const reactionBar = bubble.querySelector('.wa-reaction-bar');
    const btnMenu = bubble.querySelector('.btn-trigger-menu');
    const btnReactionsModal = bubble.querySelector('.btn-open-reactions-modal');
    const imgWrap = bubble.querySelector('.wa-bubble-image-wrap');

    // Clic en la carita: abrir barra casi arriba de la carita
    if (btnReaction && reactionBar) {
      btnReaction.addEventListener('click', (e) => {
        e.stopPropagation();
        cerrarTodosLosMenus();
        reactionBar.style.display = (reactionBar.style.display === 'flex') ? 'none' : 'flex';
      });
    }

    // Botones de reacción rápida
    if (reactionBar) {
      reactionBar.querySelectorAll('.wa-reaction-emoji-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          reactionBar.style.display = 'none';
          toggleReaccionMensaje(msg.id, btn.getAttribute('data-emoji'));
        });
      });

      const addBtn = reactionBar.querySelector('.wa-reaction-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          reactionBar.style.display = 'none';
          abrirSelectorParaMensaje(msg.id);
        });
      }
    }

    // Clic en el badge de reacciones: abrir Modal de Detalle (Imágenes 1 y 2)
    if (btnReactionsModal) {
      btnReactionsModal.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModalDetalleReacciones(msg, btnReactionsModal);
      });
    }

    // Clic en el botón chevron (expand_more): abre menú contextual
    if (btnMenu) {
      btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = btnMenu.getBoundingClientRect();
        mostrarMenuContextual(msg, rect.left, rect.bottom + 6);
      });
    }

    // Clic derecho en la burbuja o imagen: abre menú contextual estilo WhatsApp Web (Imagen 5)
    bubble.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      mostrarMenuContextual(msg, e.clientX, e.clientY);
    });

    if (imgWrap) {
      imgWrap.addEventListener('click', (e) => {
        abrirLightbox(imgWrap.getAttribute('data-img-url'));
      });
      imgWrap.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mostrarMenuContextual(msg, e.clientX, e.clientY);
      });
    }

    // Configuración del Reproductor de Audio (Notas de voz WhatsApp)
    const audioWrap = bubble.querySelector('.wa-bubble-audio-player');
    if (audioWrap) {
      const audioEl = audioWrap.querySelector('.wa-native-audio');
      const btnPlay = audioWrap.querySelector('.wa-audio-play-btn');
      const slider = audioWrap.querySelector('.wa-audio-slider');
      const timer = audioWrap.querySelector('.wa-audio-timer');
      const btnSpeed = audioWrap.querySelector('.wa-audio-speed-btn');
      const playIcon = btnPlay ? btnPlay.querySelector('.material-symbols-outlined') : null;

      const speeds = [1, 1.5, 2];
      let speedIdx = 0;

      if (btnSpeed && audioEl) {
        btnSpeed.addEventListener('click', (e) => {
          e.stopPropagation();
          speedIdx = (speedIdx + 1) % speeds.length;
          const newSpeed = speeds[speedIdx];
          audioEl.playbackRate = newSpeed;
          btnSpeed.textContent = `${newSpeed}x`;
        });
      }

      if (btnPlay && audioEl) {
        btnPlay.addEventListener('click', (e) => {
          e.stopPropagation();
          if (audioEl.paused) {
            // Pausar cualquier otro audio en reproducción
            if (currentlyPlayingAudio && currentlyPlayingAudio !== audioEl) {
              currentlyPlayingAudio.pause();
            }
            currentlyPlayingAudio = audioEl;
            audioEl.play().catch(err => console.error("Error reproduciendo audio:", err));
          } else {
            audioEl.pause();
          }
        });

        audioEl.addEventListener('play', () => {
          if (playIcon) playIcon.textContent = 'pause';
          btnPlay.title = 'Pausar';
        });

        audioEl.addEventListener('pause', () => {
          if (playIcon) playIcon.textContent = 'play_arrow';
          btnPlay.title = 'Reproducir';
        });

        audioEl.addEventListener('timeupdate', () => {
          if (audioEl.duration && !isNaN(audioEl.duration)) {
            const pct = (audioEl.currentTime / audioEl.duration) * 100;
            slider.value = pct;
            timer.textContent = formatearSegundos(audioEl.currentTime);
          }
        });

        audioEl.addEventListener('ended', () => {
          if (playIcon) playIcon.textContent = 'play_arrow';
          slider.value = 0;
          timer.textContent = formatearSegundos(audioEl.duration || (msg.audioDuration || 0));
          if (currentlyPlayingAudio === audioEl) currentlyPlayingAudio = null;
        });

        if (slider) {
          slider.addEventListener('input', (e) => {
            e.stopPropagation();
            if (audioEl.duration && !isNaN(audioEl.duration)) {
              audioEl.currentTime = (slider.value / 100) * audioEl.duration;
            }
          });
        }
      }
    }

    row.appendChild(bubble);
    messagesArea.appendChild(row);
  });

  // Actualizar banner superior de mensaje fijado estilo WhatsApp Web
  const pinnedBanner = document.getElementById('wa-pinned-banner');
  const pinnedText = document.getElementById('wa-pinned-banner-text');
  const pinnedMsg = msgs.slice().reverse().find(m => m.pinned && !m.deletedForEveryone);

  if (pinnedBanner) {
    if (pinnedMsg) {
      pinnedBanner.style.display = 'flex';
      pinnedBanner.dataset.pinnedId = pinnedMsg.id;
      const preview = pinnedMsg.text || (pinnedMsg.imageUrl ? '📷 Foto' : (pinnedMsg.audioUrl ? '🎤 Nota de voz' : 'Mensaje fijado'));
      if (pinnedText) pinnedText.textContent = preview;
    } else {
      pinnedBanner.style.display = 'none';
      delete pinnedBanner.dataset.pinnedId;
    }
  }

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

  let replyData = null;
  if (replyingToMessage) {
    const isMineReply = (replyingToMessage.senderEmail === currentUser.email) || (replyingToMessage.senderId === currentUser.uid);
    replyData = {
      id: replyingToMessage.id,
      senderName: isMineReply ? 'Tú' : (replyingToMessage.senderName || 'Hermano'),
      text: replyingToMessage.text ? (replyingToMessage.text.length > 90 ? replyingToMessage.text.substring(0, 90) + '...' : replyingToMessage.text) : (replyingToMessage.imageUrl ? '📷 Foto' : 'Mensaje')
    };
  }

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
    reactions: {},
    replyTo: replyData
  };

  if (inputEl) {
    inputEl.value = '';
    inputEl.style.height = 'auto';
  }
  removerImagenAdjunta();
  cancelarRespuesta();
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

// 10.B Grabación y Envío de Notas de Voz (Límite Máximo de 20 Segundos)
async function iniciarGrabacionAudio() {
  const userEmail = (currentUser?.email || "").toLowerCase().trim();
  const canSend = isAdmin || (typeof window.hasPermission !== 'function') || window.hasPermission('chat_enviar', userEmail);
  if (!canSend) {
    alert("No dispones de permisos para enviar mensajes en el chat.");
    return;
  }
  if (!activeChatId) {
    alert("Selecciona un chat antes de grabar una nota de voz.");
    return;
  }

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Tu navegador no soporta la grabación de audio.");
      return;
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else {
        mimeType = '';
      }
    }

    const recOptions = mimeType ? { mimeType, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 };
    try {
      mediaRecorder = new MediaRecorder(mediaStream, recOptions);
    } catch (e) {
      mediaRecorder = new MediaRecorder(mediaStream);
    }

    audioChunks = [];
    voiceRecordSeconds = 0;
    isRecordingVoice = true;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.start(200);

    mostrarUIGrabacionAudio();
    actualizarTemporizadorVoz(0);

    voiceRecordInterval = setInterval(() => {
      voiceRecordSeconds++;
      actualizarTemporizadorVoz(voiceRecordSeconds);

      // Límite estricto de 20 segundos solicitado por el usuario
      if (voiceRecordSeconds >= MAX_VOICE_SECONDS) {
        detenerYEnviarGrabacionAudio();
      }
    }, 1000);

  } catch (err) {
    console.error("Error al acceder al micrófono:", err);
    alert("No se pudo iniciar la grabación de audio. Por favor permite el acceso al micrófono en el navegador.");
    cancelarGrabacionAudio();
  }
}

function mostrarUIGrabacionAudio() {
  const standardRow = document.getElementById('wa-input-row-standard');
  const voiceBar = document.getElementById('wa-voice-record-bar');
  if (standardRow) standardRow.style.display = 'none';
  if (voiceBar) voiceBar.style.display = 'flex';
}

function restaurarUIGrabacionAudio() {
  const standardRow = document.getElementById('wa-input-row-standard');
  const voiceBar = document.getElementById('wa-voice-record-bar');
  if (standardRow) standardRow.style.display = 'flex';
  if (voiceBar) voiceBar.style.display = 'none';
  actualizarEstadoBotonEnviar();
}

function actualizarTemporizadorVoz(sec) {
  const timerEl = document.getElementById('wa-voice-record-time');
  if (timerEl) {
    timerEl.textContent = formatearSegundos(sec);
  }
}

function cancelarGrabacionAudio() {
  isRecordingVoice = false;
  if (voiceRecordInterval) {
    clearInterval(voiceRecordInterval);
    voiceRecordInterval = null;
  }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    try {
      mediaRecorder.stop();
    } catch (e) {}
  }
  if (mediaStream) {
    try {
      mediaStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    mediaStream = null;
  }
  audioChunks = [];
  voiceRecordSeconds = 0;
  restaurarUIGrabacionAudio();
}

function detenerYEnviarGrabacionAudio() {
  if (!mediaRecorder || !isRecordingVoice) return;

  clearInterval(voiceRecordInterval);
  voiceRecordInterval = null;
  const duration = Math.min(voiceRecordSeconds || 1, MAX_VOICE_SECONDS);
  isRecordingVoice = false;

  mediaRecorder.onstop = async () => {
    if (mediaStream) {
      try {
        mediaStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
      mediaStream = null;
    }

    const recordedBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
    audioChunks = [];
    restaurarUIGrabacionAudio();

    if (recordedBlob.size === 0) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result;
      await enviarMensajeDeAudio(base64Audio, duration);
    };
    reader.readAsDataURL(recordedBlob);
  };

  try {
    mediaRecorder.stop();
  } catch (e) {
    console.error("Error al detener grabación:", e);
    restaurarUIGrabacionAudio();
  }
}

async function enviarMensajeDeAudio(audioBase64, durationSec) {
  if (!audioBase64 || !activeChatId) return;

  const now = Date.now();
  const resolvedDisplayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Hermano';

  let replyData = null;
  if (replyingToMessage) {
    replyData = {
      messageId: replyingToMessage.id,
      text: replyingToMessage.text ? (replyingToMessage.text.length > 90 ? replyingToMessage.text.substring(0, 90) + '...' : replyingToMessage.text) : (replyingToMessage.audioUrl ? '🎤 Nota de voz' : '📷 Foto'),
      senderName: replyingToMessage.senderName || replyingToMessage.senderEmail?.split('@')[0] || 'Hermano'
    };
  }

  const durStr = formatearSegundos(durationSec);

  const newMsg = {
    senderId: currentUser.uid,
    senderEmail: currentUser.email,
    senderName: resolvedDisplayName,
    senderPhoto: currentUser.photoURL || '/src/img/cristo.png',
    isAdmin: isAdmin,
    text: '',
    imageUrl: null,
    audioUrl: audioBase64,
    audioDuration: durationSec,
    timestamp: now,
    edited: false,
    editedAt: null,
    deletedForEveryone: false,
    hiddenFor: [],
    reactions: {},
    replyTo: replyData
  };

  cancelarRespuesta();

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
      lastMessage: `🎤 Nota de voz (${durStr})`,
      lastTimestamp: now,
      lastSenderEmail: currentUser.email,
      unreadAdmin: isAdmin ? 0 : (prevData.unreadAdmin || 0) + 1,
      unreadUser: isAdmin ? (prevData.unreadUser || 0) + 1 : 0
    };

    await setDoc(chatDocRef, updatedChatHeader, { merge: true });
  } catch (err) {
    console.error("Error al enviar nota de voz:", err);
    alert("No se pudo enviar el audio. Verifica tu conexión a internet.");
  }
}

// 11. Modal: Eliminar Mensaje (Límite de 10 minutos para emisor, admin sin límite)
function abrirModalEliminar(msg) {
  if (!msg) return;
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
  const isWithin10Min = ageMs <= DELETE_EVERYONE_LIMIT_MS;

  if (((isMine && isWithin10Min) || isAdmin) && !msg.deletedForEveryone) {
    btnEveryone.style.display = 'block';
    descEl.textContent = isAdmin
      ? 'Como administrador, puedes eliminar este mensaje para todos en cualquier momento, o solo eliminarlo para ti.'
      : 'Este mensaje fue enviado hace menos de 10 minutos. Puedes eliminarlo para todos o solo para ti.';
  } else {
    btnEveryone.style.display = 'none';
    descEl.textContent = 'Ha transcurrido el tiempo límite de 10 minutos para eliminar para todos. Solo puedes eliminarlo de tu vista (Eliminar para mí).';
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

// 12. Modal: Editar Mensaje (Límite de 8 minutos para emisor, admin sin límite)
function abrirModalEditar(msg) {
  if (!msg) return;
  if (msg.audioUrl) {
    alert("Las notas de voz no se pueden editar. Si lo necesitas, puedes eliminarla y grabar un nuevo audio.");
    return;
  }
  const isMine = (msg.senderEmail === currentUser.email) || (msg.senderId === currentUser.uid);
  const ageMs = Date.now() - (msg.timestamp || 0);

  if (!isAdmin && (!isMine || ageMs > EDIT_TIME_LIMIT_MS)) {
    alert("Ha transcurrido el tiempo límite de 8 minutos para editar este mensaje. Solo el Administrador puede editarlo después de ese tiempo.");
    return;
  }

  targetMessageData = msg;
  const overlay = document.getElementById('modal-edit-overlay');
  const inputEl = document.getElementById('modal-edit-text');
  const descEl = document.getElementById('modal-edit-desc');

  if (descEl) {
    descEl.textContent = isAdmin
      ? 'Modo Administrador: Puedes editar este mensaje en cualquier momento.'
      : 'Modifica el texto antes de los 8 minutos de enviado:';
  }

  if (inputEl) inputEl.value = msg.text || '';
  overlay.classList.add('show');
  if (inputEl) inputEl.focus();
}

async function ejecutarGuardarEdicion() {
  if (!targetMessageData || !activeChatId) return;

  const ageMs = Date.now() - (targetMessageData.timestamp || 0);
  if (!isAdmin && ageMs > EDIT_TIME_LIMIT_MS) {
    alert("Ha transcurrido el tiempo límite de 8 minutos para editar este mensaje.");
    cerrarModales();
    return;
  }

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

// 13. Reaccionar a Mensaje (Almacena metadatos para el modal de detalle)
async function toggleReaccionMensaje(messageId, emoji) {
  if (!activeChatId || !currentUser) return;
  try {
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', messageId);
    const snap = await getDoc(msgRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const reactions = data.reactions || {};
    const existing = reactions[currentUser.uid];
    const existingEmoji = typeof existing === 'string' ? existing : existing?.emoji;

    if (existingEmoji === emoji) {
      delete reactions[currentUser.uid];
    } else {
      reactions[currentUser.uid] = {
        emoji: emoji,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Hermano',
        userPhoto: currentUser.photoURL || '/src/img/cristo.png',
        userEmail: currentUser.email || ''
      };
    }

    await updateDoc(msgRef, { reactions });
    guardarEmojiReciente(emoji);
  } catch (e) {
    console.error("Error al reaccionar:", e);
  }
}

// Modal de Detalle de Reacciones (Imágenes 1 y 2)
function abrirModalDetalleReacciones(msg, clickedElement) {
  if (!msg || !msg.reactions) return;
  activeReactionsMessage = msg;
  activeFilterEmoji = 'all';

  const overlay = document.getElementById('modal-reactions-overlay');
  if (!overlay) return;

  renderizarModalDetalleReacciones();
  overlay.classList.add('show');

  const card = overlay.querySelector('.wa-reactions-modal-card');
  if (card) {
    if (clickedElement && typeof clickedElement.getBoundingClientRect === 'function') {
      const rect = clickedElement.getBoundingClientRect();
      const cardWidth = card.offsetWidth || 360;
      const cardHeight = card.offsetHeight || 320;

      // Posicionamiento horizontal:
      // Si la reacción está en la mitad derecha de la pantalla (mensajes salientes)
      let left;
      if (rect.left > window.innerWidth / 2) {
        left = rect.right - cardWidth;
      } else {
        left = rect.left;
      }

      // Evitar que desborde los márgenes de la pantalla
      if (left + cardWidth > window.innerWidth - 14) {
        left = window.innerWidth - cardWidth - 14;
      }
      if (left < 14) left = 14;

      // Posicionamiento vertical:
      // Preferir abrir encima de la reacción (como en WhatsApp Web - Imagen 1)
      let top = rect.top - cardHeight - 8;
      if (top < 14) {
        // Si no cabe arriba, abrir abajo de la reacción
        top = rect.bottom + 8;
        if (top + cardHeight > window.innerHeight - 14) {
          top = Math.max(14, window.innerHeight - cardHeight - 14);
        }
      }

      card.style.position = 'fixed';
      card.style.left = `${Math.round(left)}px`;
      card.style.top = `${Math.round(top)}px`;
      card.style.margin = '0';
      card.style.transform = 'none';
    } else {
      card.style.position = 'fixed';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.transform = 'translate(-50%, -50%)';
      card.style.margin = '0';
    }
  }
}

function renderizarModalDetalleReacciones() {
  if (!activeReactionsMessage) return;
  const msg = activeReactionsMessage;
  const reactionsObj = msg.reactions || {};
  const entries = Object.entries(reactionsObj);

  const titleEl = document.getElementById('reactions-modal-title');
  const totalCount = entries.length;
  if (titleEl) {
    titleEl.textContent = `${totalCount} ${totalCount === 1 ? 'reacción' : 'reacciones'}`;
  }

  // Contar por emoji
  const counts = {};
  entries.forEach(([uid, r]) => {
    const emoji = typeof r === 'string' ? r : r?.emoji;
    if (emoji) counts[emoji] = (counts[emoji] || 0) + 1;
  });

  const uniqueEmojis = Object.keys(counts);

  if (activeFilterEmoji !== 'all' && !counts[activeFilterEmoji]) {
    activeFilterEmoji = 'all';
  }

  // Renderizar pestañas de chips
  const chipsList = document.getElementById('reactions-chips-list');
  if (chipsList) {
    chipsList.innerHTML = '';

    if (uniqueEmojis.length > 1) {
      const allChip = document.createElement('button');
      allChip.type = 'button';
      allChip.className = `wa-reactions-chip ${activeFilterEmoji === 'all' ? 'active' : ''}`;
      allChip.innerHTML = `<span>Todos</span> <span>${totalCount}</span>`;
      allChip.onclick = () => {
        activeFilterEmoji = 'all';
        renderizarModalDetalleReacciones();
      };
      chipsList.appendChild(allChip);
    }

    uniqueEmojis.forEach(em => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `wa-reactions-chip ${activeFilterEmoji === em ? 'active' : ''}`;
      chip.innerHTML = `<span>${em}</span> <span>${counts[em]}</span>`;
      chip.onclick = () => {
        activeFilterEmoji = em;
        renderizarModalDetalleReacciones();
      };
      chipsList.appendChild(chip);
    });
  }

  // Botón + dentro del modal para reaccionar
  const btnAdd = document.getElementById('btn-reactions-modal-add');
  if (btnAdd) {
    btnAdd.onclick = (e) => {
      e.stopPropagation();
      cerrarModales();
      abrirSelectorParaMensaje(msg.id);
    };
  }

  // Listado de usuarios
  const usersList = document.getElementById('reactions-users-list');
  if (usersList) {
    usersList.innerHTML = '';

    const filteredEntries = entries.filter(([uid, r]) => {
      const emoji = typeof r === 'string' ? r : r?.emoji;
      if (activeFilterEmoji === 'all') return true;
      return emoji === activeFilterEmoji;
    });

    if (filteredEntries.length === 0) {
      usersList.innerHTML = `<div style="text-align: center; color: var(--wa-text-secondary); padding: 24px;">No hay reacciones en esta categoría.</div>`;
      return;
    }

    filteredEntries.forEach(([uid, r]) => {
      const emoji = typeof r === 'string' ? r : r?.emoji;
      const isMe = (currentUser && uid === currentUser.uid);
      const name = isMe ? 'Tú' : (typeof r === 'object' && r.userName ? r.userName : (activeChatUser?.displayName || 'Hermano'));
      const photo = isMe ? (currentUser.photoURL || '/src/img/cristo.png') : (typeof r === 'object' && r.userPhoto ? r.userPhoto : (activeChatUser?.photoURL || '/src/img/cristo.png'));

      const row = document.createElement('div');
      row.className = `wa-reactions-user-row ${isMe ? 'clickable' : ''}`;
      row.innerHTML = `
        <div class="wa-reactions-user-left">
          <img src="${photo}" class="wa-avatar" alt="${escapeHtml(name)}" onerror="this.src='/src/img/cristo.png'">
          <div class="wa-reactions-user-info">
            <span class="wa-reactions-user-name">${escapeHtml(name)}</span>
            ${isMe ? `<span class="wa-reactions-user-sub">Haz clic para quitarla</span>` : ''}
          </div>
        </div>
        <span class="wa-reactions-user-emoji">${emoji}</span>
      `;

      if (isMe) {
        row.title = "Haz clic para quitar tu reacción";
        row.onclick = async () => {
          await toggleReaccionMensaje(msg.id, emoji);
          cerrarModales();
        };
      }

      usersList.appendChild(row);
    });
  }
}

// Funciones de Portapapeles y Notificaciones Toast
async function copiarAlPortapapeles(texto) {
  if (!texto) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch (err) {
    console.warn("navigator.clipboard no disponible, usando fallback:", err);
  }

  try {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = texto;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-999999px';
    tempTextArea.style.top = '-999999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    return successful;
  } catch (e) {
    console.error("Error en fallback de copia:", e);
    return false;
  }
}

function mostrarToast(texto) {
  let toast = document.getElementById('wa-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wa-toast-notification';
    toast.className = 'wa-toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function mostrarNubeMensaje() {
  const cloud = document.getElementById('wa-cloud-tooltip');
  if (!cloud) return;
  cloud.style.display = 'flex';
  cloud.classList.add('show');

  clearTimeout(cloud._hideTimer);
  cloud._hideTimer = setTimeout(() => {
    ocultarNubeMensaje();
  }, 5000);
}

function ocultarNubeMensaje() {
  const cloud = document.getElementById('wa-cloud-tooltip');
  if (cloud) {
    cloud.style.display = 'none';
    cloud.classList.remove('show');
  }
}

// Fijar / Desfijar Mensaje en Chat (WhatsApp Web)
async function toggleFijarMensaje(msg) {
  if (!msg || !activeChatId) return;
  try {
    const isPinned = !Boolean(msg.pinned);
    const msgRef = doc(db, 'support_chats', activeChatId, 'messages', msg.id);
    await updateDoc(msgRef, {
      pinned: isPinned,
      pinnedAt: isPinned ? Date.now() : null
    });
    mostrarToast(isPinned ? "📌 Mensaje fijado en el chat" : "Mensaje desfijado del chat");
  } catch (e) {
    console.error("Error al fijar mensaje:", e);
    alert("No se pudo actualizar el estado de fijado del mensaje.");
  }
}

// Menú Contextual Global (Imagen 5)
function mostrarMenuContextual(msg, x, y) {
  if (!msg) return;

  // Guardar mensaje activo ANTES de manipular visibilidad
  activeContextMenuMessage = msg;

  // Cerrar otros menús flotantes sin borrar activeContextMenuMessage
  document.querySelectorAll('.wa-reaction-bar, .wa-dropdown-menu').forEach(el => {
    el.classList.remove('show');
    if (el.style.display === 'flex' || el.style.display === 'block') {
      el.style.display = 'none';
    }
  });

  const menu = document.getElementById('wa-global-context-menu');
  if (!menu) return;

  menu.dataset.msgId = msg.id;

  const isMine = (msg.senderEmail === currentUser.email) || (msg.senderId === currentUser.uid);
  const ageMs = Date.now() - (msg.timestamp || 0);
  const canEdit = !msg.audioUrl && (isAdmin || (isMine && ageMs <= EDIT_TIME_LIMIT_MS && !msg.deletedForEveryone));

  const editBtn = document.getElementById('ctx-btn-edit');
  if (editBtn) editBtn.style.display = canEdit ? 'flex' : 'none';

  const pinBtn = document.getElementById('ctx-btn-pin');
  if (pinBtn) {
    const isPinned = Boolean(msg.pinned);
    const pinText = pinBtn.querySelector('span:not(.material-symbols-outlined)');
    const pinIcon = pinBtn.querySelector('.material-symbols-outlined');
    if (pinText) pinText.textContent = isPinned ? 'Desfijar' : 'Fijar';
    if (pinIcon) pinIcon.textContent = isPinned ? 'keep_off' : 'keep';
    pinBtn.dataset.pinned = isPinned ? 'true' : 'false';
  }

  // Resaltar si el usuario actual ya reaccionó con alguno de los emojis rápidos
  const myReaction = msg.reactions?.[currentUser?.uid];
  const myEmoji = typeof myReaction === 'string' ? myReaction : myReaction?.emoji;
  menu.querySelectorAll('.wa-ctx-emoji-btn:not(.wa-ctx-add-btn)').forEach(btn => {
    const em = btn.getAttribute('data-emoji');
    if (myEmoji && em === myEmoji) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  menu.style.display = 'block';

  // Dimensiones seguras dentro del viewport
  const menuWidth = 230;
  const menuHeight = menu.offsetHeight || 370;
  let posX = x;
  let posY = y;

  if (posX + menuWidth > window.innerWidth - 12) {
    posX = window.innerWidth - menuWidth - 12;
  }
  if (posY + menuHeight > window.innerHeight - 12) {
    posY = window.innerHeight - menuHeight - 12;
  }

  menu.style.left = `${Math.max(10, posX)}px`;
  menu.style.top = `${Math.max(10, posY)}px`;
}

function cerrarMenuContextual() {
  const menu = document.getElementById('wa-global-context-menu');
  if (menu) menu.style.display = 'none';
  // Mantener referencia durante el ciclo actual de eventos
  setTimeout(() => {
    activeContextMenuMessage = null;
  }, 120);
}

function cerrarTodosLosMenus() {
  cerrarMenuContextual();
  document.querySelectorAll('.wa-reaction-bar, .wa-dropdown-menu').forEach(el => {
    el.classList.remove('show');
    if (el.style.display === 'flex' || el.style.display === 'block') {
      el.style.display = 'none';
    }
  });
}

function iniciarRespuesta(msg) {
  if (!msg) return;
  replyingToMessage = msg;
  const bar = document.getElementById('reply-preview-bar');
  const senderEl = document.getElementById('reply-sender-name');
  const textEl = document.getElementById('reply-msg-text');
  const inputEl = document.getElementById('chat-input-text');

  const isMine = (msg.senderEmail === currentUser.email) || (msg.senderId === currentUser.uid);
  if (senderEl) {
    senderEl.textContent = isMine ? 'Tú' : (msg.senderName || 'Hermano');
  }
  if (textEl) {
    textEl.textContent = msg.text || (msg.imageUrl ? '📷 Foto' : (msg.audioUrl ? '🎤 Nota de voz' : 'Mensaje'));
  }
  if (bar) bar.style.display = 'flex';

  // Poner el foco en el campo de texto y mostrar nube indicadora ("Ponga su mensaje aquí")
  if (inputEl) {
    inputEl.focus();
    mostrarNubeMensaje();
  }
}

function cancelarRespuesta() {
  replyingToMessage = null;
  const bar = document.getElementById('reply-preview-bar');
  if (bar) bar.style.display = 'none';
  ocultarNubeMensaje();
}

function abrirModalInfoMensaje(msg) {
  if (!msg) return;
  const overlay = document.getElementById('modal-msg-info-overlay');
  const content = document.getElementById('msg-info-content');
  if (!overlay || !content) return;

  const d = new Date(msg.timestamp || Date.now());
  const fechaStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const horaStr = formatearHora(msg.timestamp || Date.now());
  const senderName = msg.senderName || msg.senderEmail || 'Hermano';

  let editInfo = '';
  if (msg.edited && msg.editedAt) {
    const editD = new Date(msg.editedAt);
    editInfo = `
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-border);">
        <strong style="color: var(--wa-accent);">Editado:</strong><br>
        <span>${editD.toLocaleDateString('es-ES')} a las ${formatearHora(msg.editedAt)}</span>
      </div>
    `;
  }

  content.innerHTML = `
    <div style="margin-bottom: 8px;">
      <strong style="color: var(--wa-accent);">Remitente:</strong><br>
      <span>${escapeHtml(senderName)} ${msg.senderEmail ? `(${escapeHtml(msg.senderEmail)})` : ''}</span>
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="color: var(--wa-accent);">Enviado:</strong><br>
      <span>${fechaStr} a las ${horaStr}</span>
    </div>
    <div style="margin-bottom: 8px;">
      <strong style="color: var(--wa-accent);">Estado:</strong><br>
      <span>Entregado / Leído</span>
    </div>
    ${editInfo}
  `;

  overlay.classList.add('show');
}

function abrirSelectorParaMensaje(msgId) {
  activeReactionTargetMsgId = msgId;
  const emojiPanel = document.getElementById('wa-emoji-panel');
  if (emojiPanel) {
    emojiPanel.classList.add('show');
    renderizarCuerpoEmojis();
    const searchInput = document.getElementById('input-search-emoji');
    if (searchInput) searchInput.focus();
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
      if (activeReactionTargetMsgId) {
        toggleReaccionMensaje(activeReactionTargetMsgId, emoji);
        activeReactionTargetMsgId = null;
        const emojiPanel = document.getElementById('wa-emoji-panel');
        if (emojiPanel) emojiPanel.classList.remove('show');
      } else {
        insertarTextoEnInput(emoji);
        actualizarEstadoBotonEnviar();
      }
      guardarEmojiReciente(emoji);
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
  activeReactionsMessage = null;
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

  // Enviar mensaje o Iniciar grabación de audio al hacer clic
  const btnSend = document.getElementById('btn-send-message');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const inputEl = document.getElementById('chat-input-text');
      const hasContent = (inputEl && inputEl.value.trim().length > 0) || (pendingImageBase64 !== null);
      if (hasContent) {
        enviarMensaje();
      } else {
        iniciarGrabacionAudio();
      }
    });
  }

  // Controles de la barra de grabación de notas de voz
  const btnDiscardVoice = document.getElementById('btn-discard-voice');
  if (btnDiscardVoice) {
    btnDiscardVoice.addEventListener('click', (e) => {
      e.stopPropagation();
      cancelarGrabacionAudio();
    });
  }

  const btnSendVoice = document.getElementById('btn-send-voice');
  if (btnSendVoice) {
    btnSendVoice.addEventListener('click', (e) => {
      e.stopPropagation();
      detenerYEnviarGrabacionAudio();
    });
  }

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
      ocultarNubeMensaje();
      handleInputEmoticones(inputEl);
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
      actualizarEstadoBotonEnviar();
    });
    inputEl.addEventListener('focus', () => {
      // Dejar visible brevemente pero se oculta al escribir
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

  // Cierre de menús flotantes y menú contextual al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (e.target.closest('#wa-emoji-panel')) return;
    if (e.target.closest('#btn-toggle-emoji')) return;

    cerrarTodosLosMenus();
    if (emojiPanel && emojiPanel.classList.contains('show')) {
      emojiPanel.classList.remove('show');
      activeReactionTargetMsgId = null;
    }
  });

  // Interacción con el Banner de Mensaje Fijado (WhatsApp Web)
  const pinnedBanner = document.getElementById('wa-pinned-banner');
  if (pinnedBanner) {
    pinnedBanner.addEventListener('click', (e) => {
      if (e.target.closest('#btn-unpin-banner')) return;
      const targetId = pinnedBanner.dataset.pinnedId;
      if (targetId) {
        const targetEl = document.getElementById('wa-msg-' + targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.remove('wa-highlight-pulse');
          void targetEl.offsetWidth;
          targetEl.classList.add('wa-highlight-pulse');
        }
      }
    });
  }

  const btnUnpinBanner = document.getElementById('btn-unpin-banner');
  if (btnUnpinBanner) {
    btnUnpinBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = pinnedBanner?.dataset?.pinnedId;
      if (targetId) {
        toggleFijarMensaje({ id: targetId, pinned: true });
      }
    });
  }

  // Cancelar respuesta / cita
  const btnCancelReply = document.getElementById('btn-cancel-reply');
  if (btnCancelReply) {
    btnCancelReply.addEventListener('click', cancelarRespuesta);
  }

  // Opciones del Menú Contextual Global (Imagen 5)
  document.querySelectorAll('.wa-ctx-emoji-btn:not(.wa-ctx-add-btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const em = btn.getAttribute('data-emoji');
      const targetId = activeContextMenuMessage?.id || document.getElementById('wa-global-context-menu')?.dataset?.msgId;
      if (targetId) {
        toggleReaccionMensaje(targetId, em);
      }
      cerrarMenuContextual();
    });
  });

  const ctxAddBtn = document.getElementById('btn-ctx-add-reaction');
  if (ctxAddBtn) {
    ctxAddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = activeContextMenuMessage?.id || document.getElementById('wa-global-context-menu')?.dataset?.msgId;
      cerrarMenuContextual();
      if (targetId) abrirSelectorParaMensaje(targetId);
    });
  }

  const ctxBtnInfo = document.getElementById('ctx-btn-info');
  if (ctxBtnInfo) {
    ctxBtnInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      abrirModalInfoMensaje(msg);
    });
  }

  const ctxBtnReply = document.getElementById('ctx-btn-reply');
  if (ctxBtnReply) {
    ctxBtnReply.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      iniciarRespuesta(msg);
    });
  }

  const ctxBtnCopy = document.getElementById('ctx-btn-copy');
  if (ctxBtnCopy) {
    ctxBtnCopy.addEventListener('click', async (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      const textToCopy = msg?.text || msg?.imageUrl || msg?.audioUrl || '';
      if (textToCopy) {
        const ok = await copiarAlPortapapeles(textToCopy);
        if (ok) {
          mostrarToast("Mensaje copiado al portapapeles");
        } else {
          mostrarToast("No se pudo copiar el mensaje");
        }
      } else {
        mostrarToast("No hay contenido para copiar");
      }
    });
  }

  const ctxBtnReact = document.getElementById('ctx-btn-react');
  if (ctxBtnReact) {
    ctxBtnReact.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = activeContextMenuMessage?.id || document.getElementById('wa-global-context-menu')?.dataset?.msgId;
      cerrarMenuContextual();
      if (targetId) abrirSelectorParaMensaje(targetId);
    });
  }

  const ctxBtnForward = document.getElementById('ctx-btn-forward');
  if (ctxBtnForward) {
    ctxBtnForward.addEventListener('click', async (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      const textToForward = msg?.text || msg?.imageUrl || '';
      if (textToForward) {
        await copiarAlPortapapeles(textToForward);
        mostrarToast("Mensaje copiado y listo para reenviar");
      }
    });
  }

  const ctxBtnPin = document.getElementById('ctx-btn-pin');
  if (ctxBtnPin) {
    ctxBtnPin.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      const targetId = msg?.id || document.getElementById('wa-global-context-menu')?.dataset?.msgId;
      const isCurrentlyPinned = ctxBtnPin.dataset.pinned === 'true';
      cerrarMenuContextual();
      if (targetId) {
        toggleFijarMensaje({ id: targetId, pinned: isCurrentlyPinned });
      }
    });
  }

  const ctxBtnStar = document.getElementById('ctx-btn-star');
  if (ctxBtnStar) {
    ctxBtnStar.addEventListener('click', (e) => {
      e.stopPropagation();
      cerrarMenuContextual();
      mostrarToast("Mensaje destacado");
    });
  }

  const ctxBtnEdit = document.getElementById('ctx-btn-edit');
  if (ctxBtnEdit) {
    ctxBtnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      abrirModalEditar(msg);
    });
  }

  const ctxBtnDelete = document.getElementById('ctx-btn-delete');
  if (ctxBtnDelete) {
    ctxBtnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = activeContextMenuMessage;
      cerrarMenuContextual();
      abrirModalEliminar(msg);
    });
  }

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

  const btnCloseReactionsModal = document.getElementById('btn-close-reactions-modal');
  if (btnCloseReactionsModal) btnCloseReactionsModal.addEventListener('click', cerrarModales);

  const btnCloseMsgInfo = document.getElementById('btn-close-msg-info');
  if (btnCloseMsgInfo) btnCloseMsgInfo.addEventListener('click', cerrarModales);

  // Cerrar modales al hacer clic fuera en el fondo (overlay)
  document.querySelectorAll('.wa-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarModales();
      }
    });
  });

  // Cerrar modales, lightbox, menús contextuales y paneles con la tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isRecordingVoice) {
        cancelarGrabacionAudio();
      }
      cerrarModales();
      cerrarLightbox();
      cerrarMenuContextual();
      cerrarTodosLosMenus();
      const emojiPanel = document.getElementById('wa-emoji-panel');
      if (emojiPanel) emojiPanel.classList.remove('show');
    }
  });

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

function formatearSegundos(sec) {
  const total = Math.round(sec || 0);
  const m = Math.floor(total / 60);
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
