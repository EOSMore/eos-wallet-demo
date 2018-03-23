import mirror, { actions } from 'mirrorx';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import bip39 from 'bip39';
import { randomBytes } from 'crypto';
import ecc from 'eosjs-ecc';
import Eos from 'eosjs';
import { wordlist } from '../configs';
import { aesEncrypt, aesDecrypt } from '../utils';

mirror.model({
  name: 'wallets',
  initialState: {
    selected: '',
    list: [],
    balances: {}
  },
  reducers: {
    set(state, data) {
      return {
        ...state,
        ...data
      };
    },
    setList(state, list) {
      return {
        ...state,
        list
      };
    },
    add(state, wallet) {
      state.list.push(wallet);
      return {
        ...state,
        selected: wallet.name
      };
    },
    setBalance(state, { name, balance }) {
      const newData = {};
      newData[name] = balance;
      return {
        ...state,
        balances: {
          ...state.balances,
          ...newData
        }
      };
    },
    setSeed(state, { name, seed }) {
      const wallet = find(state.list, { name });
      wallet.seed = seed;
      return state;
    },
    setSelected(state, selected) {
      return {
        ...state,
        selected
      };
    }
  },
  effects: {
    async load() {
      const wallets = await actions.storage.get('wallets');
      if (!isEmpty(wallets) && !isEmpty(wallets.list)) {
        actions.wallets.set(wallets);
        return wallets;
      }
      return wallets;
    },
    async check(redirectToGuide = true, getState) {
      if (isEmpty(getState().wallets.list)) {
        const wallets = await actions.wallets.load();
        if (redirectToGuide && (isEmpty(wallets) || isEmpty(wallets.list))) {
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
      const eos = Eos.Localnet({ httpEndpoint, keyProvider });
      try {
        await eos.newaccount({
          creator,
          name,
          owner: publicKey,
          active: publicKey,
          recovery: creator,
          deposit: `1 EOS`
        });
        setTimeout(() => {
          eos.transfer(creator, name, 100000, '');
        }, 1000);
        const wallet = {
          name,
          seed: aesEncrypt(seed, password)
        };
        actions.wallets.add(wallet);
        actions.wallets.save();
        return {
          wallet,
          mnemonic
        };
      } catch (e) {
        let message = e;
        try {
          const error = JSON.parse(e);
          const code = error.details.substr(0, 7);
          if (isEqual(code, '3050001')) {
            message = '账号名已存在';
          } else {
            message = error.details;
          }
        } catch (error) {

        }
        throw new Error(message);
      }

    },
    async changeSelected(selected) {
      actions.wallets.setSelected(selected);
      await actions.wallets.save();
    },
    async importFromMnemonic(mnemonic) {
      const seed = bip39.mnemonicToSeedHex(mnemonic);
      const privateKey = ecc.seedPrivate(seed);
      const publicKey = ecc.privateToPublic(privateKey);
      const account_names = await actions.wallets.getAccounts(publicKey);
      return { account_names, seed };
    },
    async getAccounts(publicKey) {
      const httpEndpoint = `http://${process.env.REACT_APP_NETWORK_HOST}:${process.env.REACT_APP_NETWORK_PORT}`;
      const eos = Eos.Localnet({ httpEndpoint });
      try {
        const res = await eos.getKeyAccounts(publicKey);
        if (res && res.account_names) {
          return res.account_names;
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }

    },
    async importAccount({ name, password, seed }, getState) {
      if (findIndex(getState().wallets.list, { name }) >= 0) {
        return false;
      }
      const wallet = {
        name,
        seed: aesEncrypt(seed, password)
      };
      actions.wallets.add(wallet);
      actions.wallets.save();
      return true;
    },
    async getBalance(name) {
      const httpEndpoint = `http://${process.env.REACT_APP_NETWORK_HOST}:${process.env.REACT_APP_NETWORK_PORT}`;
      const eos = Eos.Localnet({ httpEndpoint });
      const account = await eos.getAccount(name);
      actions.wallets.setBalance({ name, balance: account.eos_balance });
      return account.eos_balance;
    },
    async auth({ wallet, password }) {
      try {
        const seed = aesDecrypt(wallet.seed, password);
        const privateKey = ecc.seedPrivate(seed);
        return {
          seed,
          privateKey
        };
      } catch (error) {
        return false;
      }
    },
    async setPassword({ name, seed, password }) {
      seed = aesEncrypt(seed, password);
      actions.wallets.setSeed({ name, seed });
      return true;
    },
    async transfer({ wallet, privateKey, name, amount, message = '' }) {
      const httpEndpoint = `http://${process.env.REACT_APP_NETWORK_HOST}:${process.env.REACT_APP_NETWORK_PORT}`;
      const eos = Eos.Localnet({ httpEndpoint, keyProvider: privateKey });
      try {
        await eos.transfer(wallet.name, name, parseInt(amount * 10000, 10), message);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }
});
