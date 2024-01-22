import React, { Fragment } from 'react'
import { useAdventurer } from 'hooks/store/adventurers'
import * as TextManager from 'global/TextManager'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import EffectIcon from './EffectIcon'
import { type TempEffect } from 'definitions/tempEffects/types'
import './styles/adventurerEffects.scss'
import { ContextType } from 'constants/context'

type Props = {
  adventurerId: string

}

// Shows temp effects
const AdventurerTempEffects = (props: Props) => {
  const adventurer = useAdventurer(props.adventurerId)

  const renderEffect = (effect: TempEffect) => {
    // const effectDefinition = getDefinition(effect.type)

    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement).querySelector('.name')
      if (origin == null) return
      const originRect = origin.getBoundingClientRect()

      TooltipEmitter.showContextTooltip(ContextType.tempEffect, effect, originRect)
      event.stopPropagation()
    }
    return (
      <Fragment key={effect.type}>
        <li onClick={handleClick}>
          <EffectIcon effectType={effect.type} />
          <div className="name">
            {TextManager.getTempEffectName(effect)}
          </div>
        </li>
      </Fragment>
    )
  }

  if (adventurer?.tempEffects === undefined) {
    return null
  }
  return (
    <>
      <p>{TextManager.get('ui-adventurer-info-effects-title')}</p>
      <ul className="adventurer-effects">
        {adventurer.tempEffects?.map((effect) => renderEffect(effect))}
      </ul>
    </>
  )
}

export default AdventurerTempEffects
