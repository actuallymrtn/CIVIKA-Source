// Sistema de Monetización para Civika
class MonetizationSystem {
  constructor({
    creators = [],
    subscriptions = [],
    donations = [],
    stores = [],
    rewards = [],
    transactions = []
  } = {}) {
    this.creators = creators; // [{username, tiers, store, wallet}]
    this.subscriptions = subscriptions; // [{subscriber, creator, tier, startDate, endDate}]
    this.donations = donations; // [{from, to, amount, currency, type, date}]
    this.stores = stores; // [{creator, items}]
    this.rewards = rewards; // [{user, type, value, reason, date}]
    this.transactions = transactions; // [{from, to, amount, currency, type, date, item}]
  }

  // Suscripciones estilo Patreon/Ko-fi
  addCreator({ username, tiers = [], store = [], wallet = {} }) {
    this.creators.push({ username, tiers, store, wallet });
  }

  subscribe(subscriber, creator, tier, startDate = Date.now(), endDate = null) {
    this.subscriptions.push({ subscriber, creator, tier, startDate, endDate });
  }

  // Donaciones (cripto y fiat)
  donate(from, to, amount, currency = 'USD', type = 'fiat', date = Date.now()) {
    this.donations.push({ from, to, amount, currency, type, date });
    this.transactions.push({ from, to, amount, currency, type, date });
  }

  // Tienda para creadores (merch, NFTs, archivos)
  addStore(creator, items = []) {
    this.stores.push({ creator, items });
  }

  addStoreItem(creator, item) {
    const store = this.stores.find(s => s.creator === creator);
    if (store) store.items.push(item);
  }

  buyItem(buyer, creator, itemId, amount, currency = 'USD', type = 'fiat', date = Date.now()) {
    const store = this.stores.find(s => s.creator === creator);
    const item = store ? store.items.find(i => i.id === itemId) : null;
    if (item) {
      this.transactions.push({ from: buyer, to: creator, amount, currency, type, date, item });
      return item;
    }
    return null;
  }

  // Recompensas por interacción
  rewardUser(user, type, value, reason = '', date = Date.now()) {
    this.rewards.push({ user, type, value, reason, date });
  }

  // NFTs y archivos digitales
  addNFT(creator, nft) {
    this.addStoreItem(creator, { ...nft, type: 'NFT' });
  }

  // Obtener resumen de ingresos de un creador
  getCreatorEarnings(creator) {
    return this.transactions.filter(t => t.to === creator).reduce((sum, t) => sum + t.amount, 0);
  }

  // Obtener recompensas de un usuario
  getUserRewards(user) {
    return this.rewards.filter(r => r.user === user);
  }
}

// Ejemplo de uso extendido:
const monetization = new MonetizationSystem();

monetization.addCreator({
  username: 'martin',
  tiers: [
    { name: 'Bronce', price: 2 },
    { name: 'Plata', price: 5 },
    { name: 'Oro', price: 10 }
  ],
  store: [],
  wallet: { fiat: 'USD', crypto: 'ETH' }
});

monetization.subscribe('ana', 'martin', 'Oro');
monetization.donate('luis', 'martin', 20, 'ETH', 'crypto');
monetization.addStore('martin', [
  { id: 'm1', name: 'Civika T-shirt', price: 15, type: 'merch' },
  { id: 'nft1', name: 'Civika NFT', price: 0.05, type: 'NFT' }
]);
monetization.buyItem('sofia', 'martin', 'm1', 15, 'USD', 'fiat');
monetization.addNFT('martin', { id: 'nft2', name: 'Civika Art', price: 0.1 });
monetization.rewardUser('ana', 'like', 10, 'Por participación activa');

// Exportar si usas módulos
// module.exports = { MonetizationSystem, monetization };
