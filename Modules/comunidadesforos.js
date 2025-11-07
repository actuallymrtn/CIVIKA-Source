// Sistema de Comunidades / Foros estilo Reddit/Mastodon/Discord
class Community {
  constructor({
    name,
    description = '',
    avatarUrl = '',
    coverUrl = '',
    tags = [],
    topics = [],
    members = [],
    posts = [],
    roles = {},
    rules = [],
    createdAt = Date.now(),
    isPublic = true,
    moderators = [],
    bannedUsers = [],
    channels = [],
    votes = {},
    events = [],
    invites = [],
    pinnedPosts = [],
    customEmojis = [],
    chatHistory = []
  }) {
    this.name = name;
    this.description = description;
    this.avatarUrl = avatarUrl;
    this.coverUrl = coverUrl;
    this.tags = tags;
    this.topics = topics;
    this.members = members; // [{username, role}]
    this.posts = posts;
    this.roles = roles; // {username: 'admin'|'mod'|'member'|'guest'}
    this.rules = rules;
    this.createdAt = createdAt;
    this.isPublic = isPublic;
    this.moderators = moderators;
    this.bannedUsers = bannedUsers;
    this.channels = channels; // [{name, description, posts}]
    this.votes = votes; // {postId: {up: 0, down: 0}}
    this.events = events; // [{title, date, description}]
    this.invites = invites;
    this.pinnedPosts = pinnedPosts;
    this.customEmojis = customEmojis;
    this.chatHistory = chatHistory; // [{user, message, timestamp}]
  }

  addMember(username, role = 'member') {
    if (!this.members.find(m => m.username === username)) {
      this.members.push({ username, role });
      this.roles[username] = role;
    }
  }

  removeMember(username) {
    this.members = this.members.filter(m => m.username !== username);
    delete this.roles[username];
  }

  addModerator(username) {
    if (!this.moderators.includes(username)) this.moderators.push(username);
    this.roles[username] = 'mod';
  }

  banUser(username) {
    if (!this.bannedUsers.includes(username)) this.bannedUsers.push(username);
    this.removeMember(username);
  }

  addPost(post) {
    this.posts.push(post);
  }

  pinPost(postId) {
    if (!this.pinnedPosts.includes(postId)) this.pinnedPosts.push(postId);
  }

  addChannel(name, description = '') {
    this.channels.push({ name, description, posts: [] });
  }

  addToChannel(channelName, post) {
    const channel = this.channels.find(c => c.name === channelName);
    if (channel) channel.posts.push(post);
  }

  vote(postId, type = 'up') {
    if (!this.votes[postId]) this.votes[postId] = { up: 0, down: 0 };
    if (type === 'up') this.votes[postId].up++;
    else if (type === 'down') this.votes[postId].down++;
  }

  addEvent(title, date, description = '') {
    this.events.push({ title, date, description });
  }

  inviteUser(username) {
    if (!this.invites.includes(username)) this.invites.push(username);
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  addCustomEmoji(emoji) {
    if (!this.customEmojis.includes(emoji)) this.customEmojis.push(emoji);
  }

  addChatMessage(user, message) {
    this.chatHistory.push({ user, message, timestamp: Date.now() });
  }
}

// Ejemplo de uso extendido:
const civikaCommunity = new Community({
  name: 'Civika Comunidad',
  description: 'Foro oficial de la superapp Civika',
  avatarUrl: 'https://img.com/comunidad.jpg',
  tags: ['tecnología', 'comunidad'],
  topics: ['app', 'debate'],
  isPublic: true,
  rules: ['Respeto mutuo', 'No spam'],
  customEmojis: ['🔥', '🚀'],
  channels: [
    { name: 'General', description: 'Discusión general', posts: [] },
    { name: 'Feedback', description: 'Sugerencias y bugs', posts: [] }
  ]
});

civikaCommunity.addMember('martin', 'admin');
civikaCommunity.addMember('ana', 'member');
civikaCommunity.addModerator('ana');
civikaCommunity.addPost({ id: 'p1', author: 'martin', content: '¡Bienvenidos!', timestamp: Date.now() });
civikaCommunity.pinPost('p1');
civikaCommunity.vote('p1', 'up');
civikaCommunity.addToChannel('General', { id: 'p2', author: 'ana', content: 'Me encanta Civika', timestamp: Date.now() });
civikaCommunity.addEvent('Live Civika', '2025-07-20T18:00:00Z', 'Evento en vivo');
civikaCommunity.inviteUser('luis');
civikaCommunity.addRule('No contenido ofensivo');
civikaCommunity.addCustomEmoji('💡');
civikaCommunity.addChatMessage('martin', '¡Hola a todos!');

// Exportar si usas módulos
// module.exports = { Community, civikaCommunity };
