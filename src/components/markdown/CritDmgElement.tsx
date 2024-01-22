import { TextManager } from 'global/TextManager'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode[]
}

// To be used inside Markdown component
const CritDmgElement = (props: Props) => {
  const { children } = props

  return (
    <>
      <span className={'crit-dmg'} title={TextManager.get('scene-combat-crit')}>
        {children}
      </span>
    </>
  )
}

export default CritDmgElement
