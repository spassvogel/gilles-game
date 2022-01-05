import React, { Fragment } from 'react';
import { useAdventurerState } from 'hooks/store/adventurers';
import { TextManager } from 'global/TextManager';
import { ContextType } from 'constants/context';
import { TooltipManager } from 'global/TooltipManager';
import EffectIcon from './EffectIcon';
import { TempEffect } from 'definitions/tempEffects/types';
import './styles/adventurerEffects.scss';

interface Props {
  adventurerId: string;

}

// Shows temp effects
const AdventurerTempEffects = (props: Props) => {
  const adventurer = useAdventurerState(props.adventurerId);

  const renderEffect = (effect: TempEffect) => {
    // const effectDefinition = getDefinition(effect.type);

    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement).querySelector('.name');
      if (!origin) return;
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.tempEffect, effect, originRect);
      event.stopPropagation();
    };
    return (
      <Fragment key={effect.type}>
        <li onClick={handleClick}>
          <EffectIcon effectType={effect.type} />
          <div className="name">
            {TextManager.getTempEffectName(effect)}
          </div>
        </li>
      </Fragment>
    );
  };

  if (!adventurer?.tempEffects) {
    return null;
  }
  return (
    <>
      <p>{TextManager.get('ui-adventurer-info-effects-title')}</p>
      <ul className="adventurer-effects">
        {adventurer.tempEffects && adventurer.tempEffects.map((effect)=> renderEffect(effect))}
      </ul>
    </>
  );
};

export default AdventurerTempEffects;
