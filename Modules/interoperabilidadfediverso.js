// Sistema de Interoperabilidad Fediverso compatible con ActivityPub
class FediverseInterop {
  constructor({
    localAccounts = [],
    remoteAccounts = [],
    followers = {},
    following = {},
    inbox = [],
    outbox = [],
    federationLog = []
  } = {}) {
    this.localAccounts = localAccounts; // [{username, actorUrl, type}]
    this.remoteAccounts = remoteAccounts; // [{username, actorUrl, type, instance}]
    this.followers = followers; // {username: [remoteActorUrl]}
    this.following = following; // {username: [remoteActorUrl]}
    this.inbox = inbox; // Mensajes entrantes ActivityPub
    this.outbox = outbox; // Mensajes salientes ActivityPub
    this.federationLog = federationLog;
  }

  // Seguir cuenta remota (Mastodon, PeerTube, etc.)
  followRemote(localUser, remoteActorUrl) {
    if (!this.following[localUser]) this.following[localUser] = [];
    if (!this.following[localUser].includes(remoteActorUrl)) {
      this.following[localUser].push(remoteActorUrl);
      this.federationLog.push({ type: 'follow', localUser, remoteActorUrl, date: Date.now() });
      // Simular envío de ActivityPub Follow
      this.outbox.push({ type: 'Follow', actor: localUser, object: remoteActorUrl, date: Date.now() });
    }
  }

  // Ser seguido por cuenta remota
  addFollower(localUser, remoteActorUrl) {
    if (!this.followers[localUser]) this.followers[localUser] = [];
    if (!this.followers[localUser].includes(remoteActorUrl)) {
      this.followers[localUser].push(remoteActorUrl);
      this.federationLog.push({ type: 'followed', localUser, remoteActorUrl, date: Date.now() });
      // Simular recepción de ActivityPub Follow
      this.inbox.push({ type: 'Follow', actor: remoteActorUrl, object: localUser, date: Date.now() });
    }
  }

  // Publicar actividad en el Fediverso
  publishActivity(localUser, activity) {
    this.outbox.push({ ...activity, actor: localUser, date: Date.now() });
    this.federationLog.push({ type: 'publish', localUser, activity, date: Date.now() });
  }

  // Recibir actividad del Fediverso
  receiveActivity(remoteActorUrl, activity) {
    this.inbox.push({ ...activity, actor: remoteActorUrl, date: Date.now() });
    this.federationLog.push({ type: 'receive', remoteActorUrl, activity, date: Date.now() });
  }

  // Sincronizar cuentas remotas
  addRemoteAccount({ username, actorUrl, type, instance }) {
    if (!this.remoteAccounts.find(a => a.actorUrl === actorUrl)) {
      this.remoteAccounts.push({ username, actorUrl, type, instance });
    }
  }

  // Sincronizar cuentas locales
  addLocalAccount({ username, actorUrl, type }) {
    if (!this.localAccounts.find(a => a.actorUrl === actorUrl)) {
      this.localAccounts.push({ username, actorUrl, type });
    }
  }

  // Obtener seguidores remotos
  getRemoteFollowers(localUser) {
    return this.followers[localUser] || [];
  }

  // Obtener cuentas seguidas remotas
  getRemoteFollowing(localUser) {
    return this.following[localUser] || [];
  }

  // Obtener historial de federación
  getFederationLog() {
    return this.federationLog;
  }
}

// Ejemplo de uso extendido:
const fediverse = new FediverseInterop();

fediverse.addLocalAccount({ username: 'martin', actorUrl: 'https://civika.com/users/martin', type: 'Person' });
fediverse.addRemoteAccount({ username: 'ana', actorUrl: 'https://mastodon.social/users/ana', type: 'Person', instance: 'mastodon.social' });
fediverse.followRemote('martin', 'https://mastodon.social/users/ana');
fediverse.addFollower('martin', 'https://peertube.video/users/sofia');
fediverse.publishActivity('martin', { type: 'Create', object: { content: '¡Hola Fediverso!' } });
fediverse.receiveActivity('https://mastodon.social/users/ana', { type: 'Like', object: { content: '¡Hola Civika!' } });

// Exportar si usas módulos
// module.exports = { FediverseInterop, fediverse };
