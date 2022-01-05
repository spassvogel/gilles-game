import { createEncryptor } from 'simple-encryptor';
import { StoreState } from 'store/types';
const key = 'P5mw}jD>5c6Y]yqy';
const encryptor = createEncryptor(key);

export const saveGame = (storeState: StoreState) => {
  const a = document.createElement('a');
  const text = JSON.stringify(storeState);
  const encrypted = encryptor.encrypt(text);
  const filename = 'Gidletown save.json';
  a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(encrypted));
  a.setAttribute('download', filename);
  a.click();
};

export const decryptSavedGame = (encrypted: string) : StoreState => {
  const text = encryptor.decrypt(encrypted);
  return JSON.parse(text);
};
