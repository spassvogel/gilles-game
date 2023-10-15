import { createContext } from 'react'

export type AccordionContextProps = {
  itemsExpanded: string[]
  toggleItem: (item: string) => void
}
export const AccordionContext = createContext<AccordionContextProps | null>(null)
