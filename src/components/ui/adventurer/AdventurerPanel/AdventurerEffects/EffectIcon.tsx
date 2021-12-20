import React from "react";
import { EffectType } from 'definitions/effects/types';
import { getDefinition } from 'definitions/effects';


interface Props {
  effectType: EffectType;
}

const EffectIcon = (props: Props) => {
  const { effectType } = props;
  const effectDefinition = getDefinition(effectType);

  return (
    <div
      className={`effect-icon ${effectDefinition.harmful ? 'harmful' : 'not-harmful'}`}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/ui/icons/${getIconImage(effectType)})`,
      }}
    />
  )
}

export default EffectIcon;

const getIconImage = (effectType: EffectType) => {
  switch (effectType) {
    case EffectType.brokenLegs:
      return "knee-bandage.svg";
    case EffectType.burning:
      return "flaming-claw.svg";
    case EffectType.soma:
      return "embrassed-energy.svg";
  }

}
