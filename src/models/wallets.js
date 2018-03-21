import mirror, { actions } from 'mirrorx';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import bip39 from 'bip39';
import { randomBytes } from 'crypto';
import ecc from 'eosjs-ecc';
import Eos from 'eosjs';
import AES from 'aes-oop';
import { wordlist } from '../configs';

mirror.model({
  name: 'wallets',
  initialState: [],
  reducers: {
    set(state, data) {
      return {
        ...state,
        ...data
      };
    },
    add(state, wallet) {
      state.push(wallet);
      return state;
    }
  },
  effects: {
    async load() {
      const wallets = await actions.storage.get('wallets');
      if (!isEmpty(wallets)) {
        actions.wallets.set(wallets);
        return wallets;
      }
      return wallets;
    },
    async check(params, getState) {
      if (isEmpty(getState().wallets)) {
        const wallets = await actions.wallets.load();
        if (isEmpty(wallets)) {
          actions.routing.push('/guide');
        }
      }
    },
    async save(params, getState) {
      actions.storage.set({ name: 'wallets', value: getState().wallets });
    },
    async create({ password, name }) {
      const mnemonic = bip39.generateMnemonic(128, randomBytes, wordlist);
      const seed = bip39.mnemonicToSeedHex(mnemonic);
      const privateKey = ecc.seedPrivate(seed);
      const publicKey = ecc.privateToPublic(privateKey);
      const creator = process.env.REACT_APP_ACCOUNT_NAME;
      const keyProvider = process.env.REACT_APP_PRIVATE_KEY;
      const httpEndpoint = `http://${process.env.REACT_APP_NETWORK_HOST}:${process.env.REACT_APP_NETWORK_PORT}`;
      const eos = Eos.Localnet({httpEndpoint, keyProvider});
      try {
        await eos.newaccount({
          creator,
          name,
          owner: publicKey,
          active: publicKey,
          recovery: creator,
          seed,
          deposit: `1 EOS`
        });
        setTimeout(() => {
          eos.transfer(creator, name, 100000, '');
        }, 1000);
        const wallet = {
          publicKey,
          privateKey: AES.encrypt(privateKey, seed),
          name,
          password: AES.encrypt(password, seed)
        };
        actions.wallets.add(wallet);
        actions.wallets.save();
        return {
          wallet,
          mnemonic
        };
      } catch (e) {
        const error = JSON.parse(e);
        const code = error.details.substr(0, 7);
        if (isEqual(code, '3050001')) {
          throw new Error('账号名已存在');
        } else {
          throw new Error(error.details);
        }
      }

    }
  }
});
