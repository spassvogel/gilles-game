import { TempEffectType } from 'definitions/tempEffects/types';

interface Props {
  effectType: TempEffectType;
}

const EffectIcon = (props: Props) => {
  const { effectType } = props;
  // const effectDefinition = getDefinition(effectType);
  const harmful = true;
  return (
    <div
      className={`effect-icon ${harmful ? 'harmful' : 'not-harmful'}`}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/ui/icons/${getIconImage(effectType)})`,
      }}
    />
  )
}

export default EffectIcon;

const getIconImage = (effectType: TempEffectType) => {
  switch (effectType) {
    case TempEffectType.brokenLegs:
      return "knee-bandage.svg";
    case TempEffectType.burning:
      return "flaming-claw.svg";
    case TempEffectType.soma:
      return "embrassed-energy.svg";
  }

}
