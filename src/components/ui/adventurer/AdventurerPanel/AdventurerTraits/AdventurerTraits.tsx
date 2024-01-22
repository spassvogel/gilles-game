import React, { Fragment } from 'react'
import { useAdventurer } from 'hooks/store/adventurers'
import { type Trait } from 'definitions/traits/types'
import { getDefinition } from 'definitions/traits'
import * as TextManager from 'global/TextManager'
import { TooltipEmitter } from 'emitters/TooltipEmitter'

import './styles/adventurerTraits.scss'
import { ContextType } from 'constants/context'

type Props = {
  adventurerId: string
}

const AdventurerTraits = (props: Props) => {
  const adventurer = useAdventurer(props.adventurerId)

  const renderTrait = (trait: Trait, last: boolean) => {
    const traitDefinition = getDefinition(trait)
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement)
      const originRect = origin.getBoundingClientRect()

      TooltipEmitter.showContextTooltip(ContextType.trait, traitDefinition, originRect)
      event.stopPropagation()
    }
    return (
      <Fragment key={trait}>
        <li onClick={handleClick}>
          {TextManager.getTraitName(trait)}
        </li>
        {!last && (', ')}
      </Fragment>
    )
  }

  if ((adventurer?.traits) == null) {
    return null
  }
  return (
    <>
      <h3 className='title'>{TextManager.get('ui-adventurer-info-traits-title')}</h3>
      <ul className="adventurer-traits">
        {adventurer.traits?.map((t, i, a) => renderTrait(t, i === a.length - 1))}
      </ul>
    </>
  )
}

export default AdventurerTraits
