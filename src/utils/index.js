import scrypt from 'scrypt-async';
import isObject from 'lodash/isObject';
import sjcl from 'sjcl';

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

export const aesEncrypt = (data, key) => {
  if (isObject(data)) data = JSON.stringify(data);
  const encryptedData = JSON.parse(sjcl.encrypt(key, data, { mode: 'gcm' }));
  return JSON.stringify(encryptedData);
};

export const aesDecrypt = (encryptedData, key) => {
  encryptedData = JSON.stringify({...JSON.parse(encryptedData), mode: 'gcm'});
  let clear;
  try {
    clear = sjcl.decrypt(key, encryptedData);
  } catch (e) {
    throw new Error(e);
  }
  try {
    return JSON.parse(clear);
  } catch (e) {
    return clear;
  }
};
