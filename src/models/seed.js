import mirror, { actions } from 'mirrorx';
import bip39 from 'bip39';
import { secureHash } from '../utils';
import { wordlist } from '../configs';

mirror.model({
  name: 'seed',
  initialState: null,
  reducers: {
    set(state, seed) {
      return seed;
    }
  },
  effects: {
    async load(password) {
      const { mnemonic, seed } = await actions.seed.generateMnemonic(password);
      actions.seed.set(seed);
      return mnemonic;
    },
    async generateMnemonic(password) {
      const hash = await secureHash(password);
      const mnemonic = bip39.entropyToMnemonic(hash, wordlist);
      const seed = bip39.mnemonicToSeedHex(mnemonic);
      return {
        mnemonic,
        seed
      };
    }
  }
});
