import SimpleCrypto from 'simple-crypto-js'
import { type StoreState } from 'store/types'
const secretKey = 'P5mw}jD>5c6Y]yqy'
const encryptor = new SimpleCrypto(secretKey)

export const saveGame = (storeState: StoreState) => {
  const a = document.createElement('a')
  const encrypted = encryptor.encrypt(storeState)
  const filename = 'Gidletown save.json'
  a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(encrypted))
  a.setAttribute('download', filename)
  a.click()
}

export const decryptSavedGame = (encrypted: string): StoreState => {
  return encryptor.decrypt(encrypted) as StoreState
}
