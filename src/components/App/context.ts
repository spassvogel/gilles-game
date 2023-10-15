import { createContext } from 'react'

export type AppContextProps = {
  windowCount: number
  onOpenWindow: (window: React.ReactElement) => void
  onCloseWindow: () => void
  onBackWindow: () => void
}

export const appContext = createContext<AppContextProps | null>(null)
export const AppContextProvider = appContext.Provider
