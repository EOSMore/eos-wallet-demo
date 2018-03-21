import mirror from 'mirrorx';
import store from 'store';

mirror.model({
  name: 'storage',
  initialState: null,
  effects: {
    async set({ name, value }) {
      store.set(name, value);
    },
    async get(name) {
      return store.get(name);
    }
  }
});
