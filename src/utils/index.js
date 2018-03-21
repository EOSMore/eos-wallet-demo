import scrypt from 'scrypt-async';

/**
 * 安全Hash
 * @param text
 * @returns {Promise<any>}
 */
export const secureHash = text => {
  return new Promise(resolve => {
    scrypt(text, 'salt', {
      N: 16384,
      r: 8,
      p: 1,
      dkLen: 16,
      encoding: 'hex'
    }, derivedKey => resolve(derivedKey));
  });
};
