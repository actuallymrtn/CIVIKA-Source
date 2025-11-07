// Clase para el perfil personal / página del creador
class CreatorProfile {
  constructor({
    username,
    displayName,
    bio = '',
    avatarUrl = '',
    coverUrl = '',
    links = [],
    pinnedContent = [],
    followers = [],
    following = [],
    contentFeed = [],
    newsletters = [],
    loops = [],
    debates = [],
    badges = [],
    verified = false,
    joinedDate = Date.now(),
    location = '',
    interests = [],
    stats = {}
  }) {
    this.username = username;
    this.displayName = displayName;
    this.bio = bio;
    this.avatarUrl = avatarUrl;
    this.coverUrl = coverUrl;
    this.links = links; // [{title, url, icon}]
    this.pinnedContent = pinnedContent; // Array de posts anclados
    this.followers = followers;
    this.following = following;
    this.contentFeed = contentFeed; // Posts normales
    this.newsletters = newsletters; // Posts tipo newsletter
    this.loops = loops; // Posts tipo loop sonoro
    this.debates = debates; // Posts tipo debate
    this.badges = badges;
    this.verified = verified;
    this.joinedDate = joinedDate;
    this.location = location;
    this.interests = interests;
    this.stats = stats; // {posts: 0, likes: 0, ...}
  }

  addLink(title, url, icon = '') {
    this.links.push({ title, url, icon });
  }

  pinContent(post) {
    if (!this.pinnedContent.includes(post)) this.pinnedContent.push(post);
  }

  addToFeed(post, type = 'feed') {
    switch(type) {
      case 'feed': this.contentFeed.push(post); break;
      case 'newsletter': this.newsletters.push(post); break;
      case 'loop': this.loops.push(post); break;
      case 'debate': this.debates.push(post); break;
      default: this.contentFeed.push(post);
    }
  }

  follow(user) {
    if (!this.following.includes(user)) this.following.push(user);
  }

  addFollower(user) {
    if (!this.followers.includes(user)) this.followers.push(user);
  }

  addBadge(badge) {
    if (!this.badges.includes(badge)) this.badges.push(badge);
  }

  updateStats(stat, value) {
    this.stats[stat] = value;
  }
}

// Ejemplo de uso extendido:
const exampleProfile = new CreatorProfile({
  username: 'martin',
  displayName: 'Martin Civika',
  bio: 'Creador de la superapp Civika. Apasionado por la tecnología y la comunidad.',
  avatarUrl: 'https://img.com/avatar.jpg',
  coverUrl: 'https://img.com/cover.jpg',
  links: [
    { title: 'Web', url: 'https://civika.com', icon: '🌐' },
    { title: 'Twitter', url: 'https://twitter.com/martin', icon: '🐦' }
  ],
  pinnedContent: [],
  followers: ['ana', 'luis'],
  following: ['sofia'],
  contentFeed: [],
  newsletters: [],
  loops: [],
  debates: [],
  badges: ['Fundador'],
  verified: true,
  joinedDate: '2024-01-01',
  location: 'Ciudad Civika',
  interests: ['tecnología', 'comunidad'],
  stats: { posts: 12, likes: 120, debates: 3 }
});

// Métodos de ejemplo
exampleProfile.addLink('GitHub', 'https://github.com/martin', '🐙');
exampleProfile.pinContent('postId123');
exampleProfile.addToFeed('postId456', 'newsletter');
exampleProfile.addBadge('Innovador');
exampleProfile.updateStats('posts', 13);

// Exportar si usas módulos
// module.exports = { CreatorProfile, exampleProfile };
