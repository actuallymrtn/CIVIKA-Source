// Sistema de Inteligencia Artificial y Moderación para Civika
class AIModeration {
  constructor({
    shadowbannedUsers = [],
    bannedWords = [],
    flaggedPosts = [],
    flaggedUsers = [],
    recommendations = {},
    spamThreshold = 0.8,
    harassmentThreshold = 0.7,
    userProfiles = {},
    userInteractions = {},
    moderationLogs = []
  } = {}) {
    this.shadowbannedUsers = shadowbannedUsers;
    this.bannedWords = bannedWords;
    this.flaggedPosts = flaggedPosts;
    this.flaggedUsers = flaggedUsers;
    this.recommendations = recommendations; // {user: [postIds]}
    this.spamThreshold = spamThreshold;
    this.harassmentThreshold = harassmentThreshold;
    this.userProfiles = userProfiles; // {user: {interests, history}}
    this.userInteractions = userInteractions; // {user: {likes, follows, comments}}
    this.moderationLogs = moderationLogs;
  }

  // Recomendaciones personalizadas (simplificado)
  generateRecommendations(user, posts) {
    const profile = this.userProfiles[user] || { interests: [], history: [] };
    const recommended = posts.filter(post => {
      // Basado en intereses y temas
      return post.topics && profile.interests.some(i => post.topics.includes(i));
    }).slice(0, 20);
    this.recommendations[user] = recommended.map(p => p.id || p.postId);
    return recommended;
  }

  // Filtros de contenido
  filterContent(post) {
    if (!post.content) return false;
    for (const word of this.bannedWords) {
      if (post.content.toLowerCase().includes(word.toLowerCase())) {
        this.flaggedPosts.push(post);
        this.moderationLogs.push({ type: 'bannedWord', post, word, date: Date.now() });
        return true;
      }
    }
    return false;
  }

  // Shadowban
  shadowbanUser(user) {
    if (!this.shadowbannedUsers.includes(user)) {
      this.shadowbannedUsers.push(user);
      this.moderationLogs.push({ type: 'shadowban', user, date: Date.now() });
    }
  }

  isShadowbanned(user) {
    return this.shadowbannedUsers.includes(user);
  }

  // AI para evitar spam (simplificado)
  detectSpam(post) {
    // Ejemplo: si el contenido tiene muchos links o palabras repetidas
    const links = (post.content.match(/https?:\/\//g) || []).length;
    const words = post.content.split(/\s+/);
    const repeated = words.filter((w, i, arr) => arr.indexOf(w) !== i).length;
    const spamScore = (links * 0.5) + (repeated / words.length);
    if (spamScore > this.spamThreshold) {
      this.flaggedPosts.push(post);
      this.moderationLogs.push({ type: 'spam', post, spamScore, date: Date.now() });
      return true;
    }
    return false;
  }

  // AI para evitar acoso (simplificado)
  detectHarassment(post) {
    // Palabras ofensivas, insultos, etc.
    const harassmentWords = ['idiota', 'tonto', 'estúpido', 'acoso', 'odio'];
    let count = 0;
    for (const word of harassmentWords) {
      if (post.content.toLowerCase().includes(word)) count++;
    }
    const harassmentScore = count / harassmentWords.length;
    if (harassmentScore > this.harassmentThreshold) {
      this.flaggedPosts.push(post);
      this.flaggedUsers.push(post.author);
      this.moderationLogs.push({ type: 'harassment', post, harassmentScore, date: Date.now() });
      return true;
    }
    return false;
  }

  // Moderación manual
  flagPost(post, reason = '') {
    this.flaggedPosts.push(post);
    this.moderationLogs.push({ type: 'manualFlag', post, reason, date: Date.now() });
  }

  // Agregar palabras prohibidas
  addBannedWord(word) {
    if (!this.bannedWords.includes(word)) this.bannedWords.push(word);
  }

  // Obtener historial de moderación
  getModerationLog() {
    return this.moderationLogs;
  }
}

// Ejemplo de uso extendido:
const aiMod = new AIModeration({ bannedWords: ['spam', 'ofensivo'] });

const postEjemplo = {
  id: 'p1',
  author: 'ana',
  content: 'Visita https://spam.com para ganar dinero rápido',
  topics: ['dinero']
};

aiMod.filterContent(postEjemplo);
aiMod.detectSpam(postEjemplo);
aiMod.detectHarassment({ id: 'p2', author: 'luis', content: 'Eres un idiota', topics: ['debate'] });
aiMod.shadowbanUser('luis');
aiMod.generateRecommendations('martin', [postEjemplo]);
aiMod.addBannedWord('scam');

// Exportar si usas módulos
// module.exports = { AIModeration, aiMod };
