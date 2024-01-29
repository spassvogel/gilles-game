import { type StoreState } from 'store/types'
import { decryptData, encryptData } from './crypto'
const secretKey = 'P5mw}jD>5c6Y]yqy'

export const saveGame = async (storeState: StoreState) => {
  const a = document.createElement('a')
  const encrypted = await encryptData(JSON.stringify(storeState), secretKey)
  const filename = 'Gidletown save.json'
  a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(encrypted))
  a.setAttribute('download', filename)
  a.click()
}

export const decryptSavedGame = async (encrypted: string): Promise<StoreState> => {
  const data = await decryptData(encrypted, secretKey)
  return JSON.parse(data) as StoreState
}
