import { type ReactNode, useEffect, useState } from 'react'
import { ContextType } from 'constants/context'
import { TooltipEmitter, type Context, EVENT_CONTEXT_UPDATED } from 'emitters/TooltipEmitter'
import * as TextManager from 'global/TextManager'
import ItemContext from './context/ItemContext'
import { type Item } from 'definitions/items/types'
import { type Resource } from 'definitions/resources'
import ResourceContext from './context/ResourceContext'
import Tooltip from '../Tooltip'
import { type TraitDefinition } from 'definitions/traits/types'
import TraitContext from './context/TraitContext'
import { getDefinition } from 'definitions/items'
import AttributeContext from './context/AttributeContext'
import { type ActorObject } from 'store/types/scene'
import ActorContext from './context/ActorContext'
import TempEffectContext from './context/TempEffectContext'
import { type ExtendedAttribute } from 'mechanics/adventurers/attributes'
import { type TempEffect } from 'definitions/tempEffects/types'
import { getItemNameClassName } from './utils'
import { type WeaponType } from 'definitions/weaponTypes/types'

import './styles/contextTooltip.scss'

// A contextual popup showing what you just clicked.
// Can be an Item, Resource, Trait, skill, etc
const ContextTooltip = () => {
  const [selectedContext, setSelectedContext] = useState<Context | undefined>()

  const tooltipUpdated = (context: Context | undefined) => {
    setSelectedContext(context)
  }
  useEffect(() => {
    TooltipEmitter.instance.addListener(EVENT_CONTEXT_UPDATED, tooltipUpdated)
    return () => {
      TooltipEmitter.instance.removeListener(EVENT_CONTEXT_UPDATED, tooltipUpdated)
    }
  }, [])
  if (selectedContext === undefined) { return null }

  const { info, type, className, source } = selectedContext
  const renderContent = () => {
    switch (type) {
      case ContextType.actor: {
        return (
          <ActorContext actorObject={info as ActorObject} />
        )
      }
      case ContextType.attribute: {
        const extendedAttribute = info as ExtendedAttribute
        const name = TextManager.getAttributeName(extendedAttribute.attribute)
        return (
          <>
            <div className="header">
              <div className="name effect">{name}</div>
              <div className="secondary">
                { TextManager.get('ui-tooltip-attribute')}
              </div>
            </div>
            <AttributeContext extendedAttribute={extendedAttribute} />
          </>
        )
      }
      case ContextType.tempEffect: {
        const effect = info as unknown as TempEffect
        const name = TextManager.getTempEffectName(effect)
        return (
          <>
            <div className="header">
              <div className="name effect">{name}</div>
              <div className="secondary">
                { TextManager.get('ui-tooltip-effect')}
              </div>
            </div>
            <TempEffectContext effect={effect} />
          </>
        )
      }
      case ContextType.resource: {
        const name = TextManager.getResourceName(info as Resource)
        return (
          <>
            <div className="header">
              <div className="name resource">{name}</div>
              <div className="secondary">
                { TextManager.get('ui-tooltip-resource-resource')}
              </div>
            </div>
            <ResourceContext info={info as string} />
          </>
        )
      }
      case ContextType.item: {
        const item = info as Item
        const name = TextManager.getItemName(item.type)
        const itemDefinition = getDefinition(item.type)
        return (
          <>
            <div className="header">
              <div className={`name item ${getItemNameClassName(itemDefinition)}`}>{name}</div>
              <div className="secondary">
                {TextManager.getItemCategory(itemDefinition.itemCategory)}
              </div>
            </div>
            <ItemContext item={item} source={source} />
          </>
        )
      }
      case ContextType.trait: {
        const traitDefinition = info as TraitDefinition
        const name = TextManager.getTraitName(traitDefinition.trait)
        return (
          <>
            <div className="name trait">
              {TextManager.get('ui-tooltip-type-trait')}
              {name}
            </div>
            <TraitContext traitDefinition={traitDefinition} />
          </>
        )
      }
      case ContextType.skill: {
        const skill = info as WeaponType
        const name = TextManager.getSkillName(skill)
        return (
          <>
            <div className="name skill">
              {TextManager.get('ui-tooltip-type-skill')}
              {name}
            </div>
            { TextManager.getSkillInfo(skill)}
          </>
        )
      }
      case ContextType.component: {
        const component = info as ReactNode
        return component
      }
      default: {
        throw new Error(`Unknown context type ${selectedContext.type}`)
      }
    }
  }

  return (
    <Tooltip referenceRect={selectedContext.referenceRect} className={className}>
      <div className="context-tooltip">
        {renderContent()}
      </div>
    </Tooltip>
  )
}
export default ContextTooltip
