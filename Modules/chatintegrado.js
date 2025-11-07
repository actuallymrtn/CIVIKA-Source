// Sistema de Chat Integrado tipo Discord/Telegram
class ChatChannel {
  constructor({
    name,
    type = 'public', // 'public', 'private', 'group'
    members = [],
    messages = [],
    bots = [],
    ephemeral = false,
    createdAt = Date.now(),
    reactionsEnabled = true,
    topic = '',
    admins = [],
    inviteLink = '',
    customEmojis = []
  }) {
    this.name = name;
    this.type = type;
    this.members = members;
    this.messages = messages;
    this.bots = bots;
    this.ephemeral = ephemeral;
    this.createdAt = createdAt;
    this.reactionsEnabled = reactionsEnabled;
    this.topic = topic;
    this.admins = admins;
    this.inviteLink = inviteLink;
    this.customEmojis = customEmojis;
  }

  addMember(user) {
    if (!this.members.includes(user)) this.members.push(user);
  }

  removeMember(user) {
    this.members = this.members.filter(u => u !== user);
  }

  addAdmin(user) {
    if (!this.admins.includes(user)) this.admins.push(user);
  }

  addBot(bot) {
    this.bots.push(bot);
  }

  sendMessage({ user, content, ephemeral = false, reactions = {}, timestamp = Date.now(), replyTo = null }) {
    const message = { user, content, ephemeral, reactions, timestamp, replyTo };
    this.messages.push(message);
    // Si es efímero, eliminar después de cierto tiempo (simulado)
    if (ephemeral) {
      setTimeout(() => {
        this.messages = this.messages.filter(m => m !== message);
      }, 60000); // 1 minuto
    }
    return message;
  }

  reactToMessage(messageIndex, reaction) {
    if (!this.reactionsEnabled) return;
    const msg = this.messages[messageIndex];
    if (!msg) return;
    if (!msg.reactions[reaction]) msg.reactions[reaction] = 0;
    msg.reactions[reaction]++;
  }

  addCustomEmoji(emoji) {
    if (!this.customEmojis.includes(emoji)) this.customEmojis.push(emoji);
  }

  getMessages({ limit = 50, onlyEphemeral = false } = {}) {
    let msgs = [...this.messages];
    if (onlyEphemeral) msgs = msgs.filter(m => m.ephemeral);
    return msgs.slice(-limit);
  }
}

// Bot básico
class ChatBot {
  constructor({ name, commands = {}, description = '' }) {
    this.name = name;
    this.commands = commands; // {command: function}
    this.description = description;
  }
  handleCommand(command, args, channel) {
    if (this.commands[command]) {
      return this.commands[command](args, channel);
    }
    return `${this.name}: Comando no reconocido.`;
  }
}

// Ejemplo de uso extendido:
const generalChannel = new ChatChannel({
  name: 'General',
  type: 'public',
  topic: 'Bienvenida a Civika',
  admins: ['martin'],
  customEmojis: ['🔥', '🚀']
});

const privateChannel = new ChatChannel({
  name: 'Staff',
  type: 'private',
  admins: ['martin', 'ana']
});

const groupChannel = new ChatChannel({
  name: 'Proyecto Civika',
  type: 'group',
  members: ['martin', 'ana', 'luis']
});

const civikaBot = new ChatBot({
  name: 'CivikaBot',
  description: 'Bot de ayuda para Civika',
  commands: {
    help: () => 'CivikaBot: Comandos disponibles: help, info',
    info: () => 'CivikaBot: Civika es la superapp de comunidades.'
  }
});

generalChannel.addBot(civikaBot);
generalChannel.sendMessage({ user: 'martin', content: '¡Hola a todos!' });
generalChannel.sendMessage({ user: 'ana', content: 'Mensaje efímero', ephemeral: true });
generalChannel.reactToMessage(0, '🔥');
generalChannel.sendMessage({ user: 'CivikaBot', content: civikaBot.handleCommand('help', [], generalChannel) });

// Exportar si usas módulos
// module.exports = { ChatChannel, ChatBot, generalChannel, privateChannel, groupChannel };
