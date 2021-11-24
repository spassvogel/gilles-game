import React, { ReactNode, useEffect, useState } from 'react';
import { ContextType } from 'constants/context';
import { TooltipManager, Context, EVENT_CONTEXT_UPDATED } from 'global/TooltipManager';
import { TextManager } from 'global/TextManager';
import ItemContext from './context/ItemContext';
import { ItemType, ItemDefinition, Item } from 'definitions/items/types';
import { Resource } from 'definitions/resources';
import ResourceContext from './context/ResourceContext';
import Tooltip from '../Tooltip';
import { TraitDefinition } from 'definitions/traits/types';
import TraitContext from './context/TraitContext';
import { WeaponType } from 'definitions/items/weapons';
import { Rarity } from 'constants/items';
import { getDefinition } from 'definitions/items';
import { BasicAttribute } from 'store/types/adventurer';
import AttributeContext from './context/AttributeContext';
import { ActorObject } from 'store/types/scene';
import ActorContext from './context/ActorContext';
import './styles/contextTooltip.scss';

// A contextual popup showing what you just clicked.
// Can be an Item, Resource, Trait, skill, etc
const ContextTooltip = () => {

  const [selectedContext, setSelectedContext] = useState<Context | undefined>();

  const tooltipUpdated = (context: Context | undefined) => {
    setSelectedContext(context);
  }
  useEffect(() => {
    TooltipManager.instance.addListener(EVENT_CONTEXT_UPDATED, tooltipUpdated);
    return () => {
      TooltipManager.instance.removeListener(EVENT_CONTEXT_UPDATED, tooltipUpdated);
    }
  }, []);
  if (!selectedContext) { return null; }

  const { info, type, className, source } = selectedContext;
  const renderContent = () => {
    switch (type) {
      case ContextType.actor: {
        return (
          <ActorContext actorObject={info as ActorObject} />
        );
      }
      case ContextType.attribute: {
        const attribute = info as BasicAttribute;
        const name = TextManager.getAttributeName(attribute);
        return (
          <>
            <div className="name resource">{name}</div>
            <AttributeContext attribute={attribute} />
          </>
        );
      }
      case ContextType.resource: {
        const name = TextManager.getResourceName(info as Resource);
        return (
          <>
            <div className="name resource">{name}</div>
            <ResourceContext info={info as string} />
          </>
        );
      }
      case ContextType.item: {
        const item = info as Item;
        const name = TextManager.getItemName(item.type);
        const itemDefinition = getDefinition(item.type) as ItemDefinition;
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
        );
      }
      case ContextType.trait: {
        const traitDefinition = info as TraitDefinition;
        const name = TextManager.getTraitName(traitDefinition.trait);
        return (
          <>
            <div className="name trait">
              {TextManager.get("ui-tooltip-type-trait")}
              {name}
            </div>
            <TraitContext traitDefinition={traitDefinition} />
          </>
        );
      }
      case ContextType.skill: {
        const skill = info as WeaponType;
        const name = TextManager.getSkillName(skill);
        return (
          <>
            <div className="name skill">
              {TextManager.get("ui-tooltip-type-skill")}
              {name}
            </div>
            { TextManager.getSkillInfo(skill)}
          </>
        );
      }
      case ContextType.component: {
        const component = info as ReactNode;
        return component;
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
export default ContextTooltip;

export const getItemNameClassName = (item: ItemDefinition): string => {
  const {rarity} = item;
  switch (rarity) {
    case Rarity.common:
      return "item-name-common";
    case Rarity.uncommon:
      return "item-name-uncommon";
    case Rarity.rare:
      return "item-name-rare";
    case Rarity.epic:
      return "item-name-epic";
    case Rarity.legendary:
      return "item-name-legendary";
  }
  return "item-name-common";
};
