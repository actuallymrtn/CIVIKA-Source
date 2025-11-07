// Sistema de Streaming y Video en Vivo tipo Twitch
class LiveStream {
  constructor({
    streamId,
    title,
    host,
    coHosts = [],
    startTime = Date.now(),
    endTime = null,
    viewers = [],
    chat = [],
    debateRooms = [],
    isActive = true,
    streamUrl = '',
    tags = [],
    topics = [],
    reactions = {},
    pinnedMessages = [],
    description = '',
    maxViewers = 10000
  }) {
    this.streamId = streamId;
    this.title = title;
    this.host = host;
    this.coHosts = coHosts;
    this.startTime = startTime;
    this.endTime = endTime;
    this.viewers = viewers;
    this.chat = chat; // [{user, message, timestamp, reactions}]
    this.debateRooms = debateRooms; // [{roomId, title, members, chat}]
    this.isActive = isActive;
    this.streamUrl = streamUrl;
    this.tags = tags;
    this.topics = topics;
    this.reactions = reactions;
    this.pinnedMessages = pinnedMessages;
    this.description = description;
    this.maxViewers = maxViewers;
  }

  addViewer(user) {
    if (!this.viewers.includes(user) && this.viewers.length < this.maxViewers) {
      this.viewers.push(user);
    }
  }

  removeViewer(user) {
    this.viewers = this.viewers.filter(u => u !== user);
  }

  addCoHost(user) {
    if (!this.coHosts.includes(user)) this.coHosts.push(user);
  }

  sendMessage({ user, message, reactions = {}, timestamp = Date.now(), pin = false }) {
    const msg = { user, message, reactions, timestamp };
    this.chat.push(msg);
    if (pin) this.pinnedMessages.push(msg);
    return msg;
  }

  reactToMessage(messageIndex, reaction) {
    const msg = this.chat[messageIndex];
    if (!msg) return;
    if (!msg.reactions[reaction]) msg.reactions[reaction] = 0;
    msg.reactions[reaction]++;
  }

  endStream() {
    this.isActive = false;
    this.endTime = Date.now();
  }

  addDebateRoom(roomId, title, members = []) {
    this.debateRooms.push({ roomId, title, members, chat: [] });
  }

  sendDebateMessage(roomId, { user, message, timestamp = Date.now() }) {
    const room = this.debateRooms.find(r => r.roomId === roomId);
    if (room) room.chat.push({ user, message, timestamp });
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) this.tags.push(tag);
  }

  addTopic(topic) {
    if (!this.topics.includes(topic)) this.topics.push(topic);
  }

  addReaction(reaction) {
    if (!this.reactions[reaction]) this.reactions[reaction] = 0;
    this.reactions[reaction]++;
  }
}

// Ejemplo de uso extendido:
const civikaStream = new LiveStream({
  streamId: 'civika001',
  title: 'Live de lanzamiento Civika',
  host: 'martin',
  coHosts: ['ana'],
  streamUrl: 'https://civika.com/live',
  tags: ['evento', 'lanzamiento'],
  topics: ['tecnología', 'comunidad'],
  description: 'Presentación oficial de la superapp Civika.'
});

civikaStream.addViewer('luis');
civikaStream.addCoHost('sofia');
civikaStream.sendMessage({ user: 'martin', message: '¡Bienvenidos al live!' });
civikaStream.sendMessage({ user: 'ana', message: '¡Empezamos!', pin: true });
civikaStream.reactToMessage(0, '🔥');
civikaStream.addDebateRoom('debate1', 'Debate sobre la app', ['martin', 'ana']);
civikaStream.sendDebateMessage('debate1', { user: 'martin', message: '¿Qué opinan del futuro de Civika?' });
civikaStream.addTag('streaming');
civikaStream.addTopic('innovación');
civikaStream.addReaction('like');

// Exportar si usas módulos
// module.exports = { LiveStream, civikaStream };
