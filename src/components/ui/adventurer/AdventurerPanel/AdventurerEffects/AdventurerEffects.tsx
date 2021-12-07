import React, { Fragment } from "react";
import { useAdventurerState } from 'hooks/store/adventurers';
import { Effect } from 'definitions/effects/types';
// import { getDefinition } from 'definitions/effects';
import { TextManager } from 'global/TextManager';
// import { ContextType } from 'constants/context';
// import { TooltipManager } from 'global/TooltipManager';
import './styles/adventurerEffects.scss';
import EffectIcon from "./EffectIcon";

interface Props {
  adventurerId: string;
}

const AdventurerEffects = (props: Props) => {
  const adventurer = useAdventurerState(props.adventurerId);

  const renderEffect = (effect: Effect) => {
    // const effectDefinition = getDefinition(effect.type);

    const handleClick = (_event: React.MouseEvent) => {
      // const origin = (event.currentTarget as HTMLElement);
      // const originRect = origin.getBoundingClientRect();

      // TooltipManager.showContextTooltip(ContextType.trait, effectDefinition, originRect);
      // event.stopPropagation();
    };
    return (
      <Fragment key={effect.type}>
        <li onClick={handleClick}>
          <EffectIcon effectType={effect.type} />
          <div className="name">
            {TextManager.getEffectName(effect)}
          </div>
        </li>
      </Fragment>
    )
  };

  if (!adventurer?.effects) {
    return null;
  }
  return (
    <>
      <p>{TextManager.get("ui-adventurer-info-effects-title")}</p>
      <ul className="adventurer-effects">
        {adventurer.effects && adventurer.effects.map((effect)=> renderEffect(effect))}
      </ul>
    </>
  )
}

export default AdventurerEffects;
