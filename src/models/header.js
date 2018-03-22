import mirror from 'mirrorx';

mirror.model({
  name: 'header',
  initialState: {
    title: 'More Wallet',
    right: null,
    left: null
  },
  reducers: {
    set(state, data) {
      return data;
    },
    setTitle(state, title) {
      return {
        ...state,
        title
      }
    },
    setRight(state, right) {
      return {
        ...state,
        right
      }
    }
  }
});
