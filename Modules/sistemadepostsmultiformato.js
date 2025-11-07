// Clase base para todos los posts
class Post {
  constructor(author, type, timestamp = Date.now(), tags = [], reactions = {}) {
    this.author = author;
    this.type = type;
    this.timestamp = timestamp;
    this.tags = tags;
    this.reactions = reactions; // {like: 0, love: 0, ...}
  }
  addReaction(reaction) {
    if (!this.reactions[reaction]) this.reactions[reaction] = 0;
    this.reactions[reaction]++;
  }
}

// Post de texto
class TextPost extends Post {
  constructor(author, content, isLong = false, tags = []) {
    super(author, 'text', Date.now(), tags);
    this.content = content;
    this.isLong = isLong;
  }
}

// Post de imagen/video
class MediaPost extends Post {
  constructor(author, mediaUrl, mediaType = 'image', caption = '', tags = []) {
    super(author, 'media', Date.now(), tags);
    this.mediaUrl = mediaUrl;
    this.mediaType = mediaType; // 'image', 'video', 'gif', 'story'
    this.caption = caption;
  }
}

// Post de audio
class AudioPost extends Post {
  constructor(author, audioUrl, description = '', tags = []) {
    super(author, 'audio', Date.now(), tags);
    this.audioUrl = audioUrl;
    this.description = description;
  }
}

// Post de encuesta/pregunta
class PollPost extends Post {
  constructor(author, question, options = [], tags = []) {
    super(author, 'poll', Date.now(), tags);
    this.question = question;
    this.options = options; // Array de opciones
    this.votes = Array(options.length).fill(0);
  }
  vote(optionIndex) {
    if (optionIndex >= 0 && optionIndex < this.options.length) {
      this.votes[optionIndex]++;
    }
  }
}

// Post de evento/live
class EventPost extends Post {
  constructor(author, eventTitle, eventDate, streamUrl = '', location = '', tags = []) {
    super(author, 'event', Date.now(), tags);
    this.eventTitle = eventTitle;
    this.eventDate = eventDate;
    this.streamUrl = streamUrl;
    this.location = location;
    this.attendees = [];
  }
  addAttendee(user) {
    if (!this.attendees.includes(user)) this.attendees.push(user);
  }
}

// Post de documento (PDF, Word, etc.)
class DocumentPost extends Post {
  constructor(author, docUrl, docType = 'pdf', description = '', tags = []) {
    super(author, 'document', Date.now(), tags);
    this.docUrl = docUrl;
    this.docType = docType;
    this.description = description;
  }
}

// Post de enlace externo (noticias, blogs, etc.)
class LinkPost extends Post {
  constructor(author, url, title = '', description = '', tags = []) {
    super(author, 'link', Date.now(), tags);
    this.url = url;
    this.title = title;
    this.description = description;
  }
}

// Post de código (snippet, gist, etc.)
class CodePost extends Post {
  constructor(author, code, language = 'javascript', description = '', tags = []) {
    super(author, 'code', Date.now(), tags);
    this.code = code;
    this.language = language;
    this.description = description;
  }
}

// Post de anuncio/publicidad
class AdPost extends Post {
  constructor(author, adContent, adUrl = '', tags = []) {
    super(author, 'ad', Date.now(), tags);
    this.adContent = adContent;
    this.adUrl = adUrl;
  }
}

// Post de oferta/marketplace
class OfferPost extends Post {
  constructor(author, offerTitle, price, offerUrl = '', description = '', tags = []) {
    super(author, 'offer', Date.now(), tags);
    this.offerTitle = offerTitle;
    this.price = price;
    this.offerUrl = offerUrl;
    this.description = description;
  }
}

// Post de grupo/comunidad
class GroupPost extends Post {
  constructor(author, groupName, description = '', members = [], tags = []) {
    super(author, 'group', Date.now(), tags);
    this.groupName = groupName;
    this.description = description;
    this.members = members;
  }
  addMember(user) {
    if (!this.members.includes(user)) this.members.push(user);
  }
}

// Ejemplo de uso extendido:
const posts = [
  new TextPost('martin', '¡Hola mundo!', false, ['bienvenida']),
  new MediaPost('ana', 'https://img.com/foto.jpg', 'image', 'Foto de mi viaje', ['viaje']),
  new AudioPost('luis', 'https://audio.com/podcast.mp3', 'Nuevo episodio', ['podcast']),
  new PollPost('carlos', '¿Te gusta Civika?', ['Sí', 'No', 'Tal vez'], ['encuesta']),
  new EventPost('sofia', 'Live de Civika', '2025-07-20T18:00:00Z', 'https://twitch.tv/civika', 'Online', ['evento']),
  new DocumentPost('jose', 'https://docs.com/doc.pdf', 'pdf', 'Documento importante', ['documento']),
  new LinkPost('maria', 'https://blog.com/post', 'Blog sobre Civika', 'Lee más sobre la app', ['blog']),
  new CodePost('dev', 'console.log("Hola Civika!");', 'javascript', 'Snippet JS', ['codigo']),
  new AdPost('empresa', '¡Oferta especial en Civika!', 'https://civika.com/oferta', ['publicidad']),
  new OfferPost('tienda', 'Descuento en membresía', 9.99, 'https://civika.com/tienda', 'Aprovecha el descuento', ['oferta']),
  new GroupPost('admin', 'Comunidad Civika', 'Grupo oficial', ['martin', 'ana'], ['grupo'])
];

// Exportar si usas módulos
// module.exports = { Post, TextPost, MediaPost, AudioPost, PollPost, EventPost, DocumentPost, LinkPost, CodePost, AdPost, OfferPost, GroupPost, posts };
