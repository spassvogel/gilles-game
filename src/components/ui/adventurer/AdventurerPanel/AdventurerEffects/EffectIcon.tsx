import { TempEffectType } from 'definitions/tempEffects/types'

type Props = {
  effectType: TempEffectType
}

const getIconImage = (effectType: TempEffectType) => {
  switch (effectType) {
    case TempEffectType.brokenLegs:
      return 'knee-bandage.svg'
    case TempEffectType.burning:
      return 'flaming-claw.svg'
    case TempEffectType.soma:
      return 'embrassed-energy.svg'
  }
}

const EffectIcon = (props: Props) => {
  const { effectType } = props
  const harmful = true
  return (
    <div
      className={`effect-icon ${harmful ? 'harmful' : 'not-harmful'}`}
      style={{
        backgroundImage: `url(/img/ui/icons/${getIconImage(effectType)})`
      }}
    />
  )
}

export default EffectIcon
