import mirror, { actions } from 'mirrorx';
import Eos from "eosjs";
import concat from 'lodash/concat';

mirror.model({
  name: 'transactions',
  initialState: {
    lists: {},
    params: {}
  },
  reducers: {
    add(state, { name, data }) {
      const list = {};
      list[name] = concat(state.lists[name] || [], data);
      return {
        ...state,
        lists: {
          ...state.lists,
          ...list
        }
      };
    },
    setList(state, { name, data }) {
      const list = {};
      list[name] = data;
      return {
        ...state,
        lists: {
          ...state.lists,
          ...list
        }
      };
    },
    setParams(state, { name, param }) {
      state.params[name] = param;
      return state;
    }
  },
  effects: {
    async getList({ name, skip_seq = 0, num_seq = 10 }) {
      const httpEndpoint = `http://${process.env.REACT_APP_NETWORK_HOST}:${process.env.REACT_APP_NETWORK_PORT}`;
      const eos = Eos.Localnet({ httpEndpoint });
      try {
        const { transactions } = await eos.getTransactions({ account_name: name, skip_seq, num_seq });
        const data = transactions.map(transaction => {
          return {
            id: transaction.transaction_id,
            expiration: transaction.transaction.expiration,
            messages: transaction.transaction.messages
          };
        });
        actions.transactions.setParams({ name, param: { skip_seq, num_seq } });
        if (skip_seq === 0) {
          actions.transactions.setList({ name, data });
        } else {
          actions.transactions.add({ name, data });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});
