// Timeline Unificado para Civika
class UnifiedTimeline {
  constructor(posts = []) {
    this.posts = posts; // Array de posts multiformato
    this.trendingTags = [];
    this.trendingHashtags = [];
    this.trendingTopics = [];
  }

  // Algoritmo híbrido: mezcla cronológico y relevancia
  getFeed({ filterType = null, tags = [], hashtags = [], topics = [], sort = 'hybrid', limit = 50 } = {}) {
    let filtered = [...this.posts];

    // Filtrar por tipo de contenido
    if (filterType) {
      filtered = filtered.filter(post => {
        if (filterType === 'live') return post.type === 'event' && post.streamUrl;
        if (filterType === 'text') return post.type === 'text';
        if (filterType === 'image') return post.type === 'media' && post.mediaType === 'image';
        if (filterType === 'video') return post.type === 'media' && post.mediaType === 'video';
        if (filterType === 'audio') return post.type === 'audio';
        return true;
      });
    }

    // Filtrar por etiquetas
    if (tags.length) {
      filtered = filtered.filter(post => post.tags && tags.some(tag => post.tags.includes(tag)));
    }

    // Filtrar por hashtags
    if (hashtags.length) {
      filtered = filtered.filter(post => post.hashtags && hashtags.some(ht => post.hashtags.includes(ht)));
    }

    // Filtrar por temas
    if (topics.length) {
      filtered = filtered.filter(post => post.topics && topics.some(tp => post.topics.includes(tp)));
    }

    // Algoritmo de relevancia (simplificado)
    if (sort === 'hybrid') {
      filtered.sort((a, b) => {
        // Relevancia: likes, comentarios, si es trending, y fecha
        const scoreA = (a.reactions?.like || 0) + (a.reactions?.love || 0) + (a.comments?.length || 0) + (a.isTrending ? 10 : 0) + (a.timestamp / 1e12);
        const scoreB = (b.reactions?.like || 0) + (b.reactions?.love || 0) + (b.comments?.length || 0) + (b.isTrending ? 10 : 0) + (b.timestamp / 1e12);
        return scoreB - scoreA;
      });
    } else if (sort === 'chronological') {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered.slice(0, limit);
  }

  // Actualizar trending tags, hashtags y topics
  updateTrending() {
    const tagCount = {};
    const hashtagCount = {};
    const topicCount = {};
    this.posts.forEach(post => {
      (post.tags || []).forEach(tag => { tagCount[tag] = (tagCount[tag] || 0) + 1; });
      (post.hashtags || []).forEach(ht => { hashtagCount[ht] = (hashtagCount[ht] || 0) + 1; });
      (post.topics || []).forEach(tp => { topicCount[tp] = (topicCount[tp] || 0) + 1; });
    });
    this.trendingTags = Object.entries(tagCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(e=>e[0]);
    this.trendingHashtags = Object.entries(hashtagCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(e=>e[0]);
    this.trendingTopics = Object.entries(topicCount).sort((a,b) => b[1]-a[1]).slice(0,10).map(e=>e[0]);
  }

  // Agregar post al timeline
  addPost(post) {
    this.posts.push(post);
    this.updateTrending();
  }

  // Obtener posts trending
  getTrendingPosts(limit = 10) {
    return this.posts.filter(post => post.isTrending).slice(0, limit);
  }

  // Filtrar por búsqueda de texto
  search(query) {
    const q = query.toLowerCase();
    return this.posts.filter(post => {
      if (post.content && post.content.toLowerCase().includes(q)) return true;
      if (post.caption && post.caption.toLowerCase().includes(q)) return true;
      if (post.description && post.description.toLowerCase().includes(q)) return true;
      if (post.question && post.question.toLowerCase().includes(q)) return true;
      if (post.eventTitle && post.eventTitle.toLowerCase().includes(q)) return true;
      return false;
    });
  }
}

// Ejemplo de uso extendido:
const timeline = new UnifiedTimeline([
  // Aquí puedes importar o agregar posts multiformato
  // Ejemplo:
  {
    author: 'martin',
    type: 'text',
    content: '¡Bienvenido a Civika!',
    timestamp: Date.now(),
    tags: ['bienvenida'],
    hashtags: ['#Civika'],
    topics: ['comunidad'],
    reactions: { like: 10, love: 5 },
    comments: ['Genial!', 'Me gusta'],
    isTrending: true
  },
  {
    author: 'ana',
    type: 'media',
    mediaType: 'image',
    mediaUrl: 'https://img.com/foto.jpg',
    caption: 'Foto de mi viaje',
    timestamp: Date.now(),
    tags: ['viaje'],
    hashtags: ['#Travel'],
    topics: ['aventura'],
    reactions: { like: 7 },
    comments: [],
    isTrending: false
  }
]);

timeline.addPost({
  author: 'sofia',
  type: 'event',
  eventTitle: 'Live Civika',
  streamUrl: 'https://twitch.tv/civika',
  timestamp: Date.now(),
  tags: ['evento'],
  hashtags: ['#Live'],
  topics: ['streaming'],
  reactions: { like: 3 },
  comments: ['Nos vemos!'],
  isTrending: true
});

timeline.updateTrending();

// Ejemplo de feed híbrido filtrado
const feed = timeline.getFeed({ filterType: 'image', sort: 'hybrid', limit: 20 });

// Exportar si usas módulos
// module.exports = { UnifiedTimeline, timeline };
