import { type TempEffect, TempEffectType } from 'definitions/tempEffects/types'
import { TextManager } from 'global/TextManager'

const getTempEffectDescription = (effect: TempEffect) => {
  switch (effect.type) {
    case TempEffectType.burning: {
      const interval = (effect.interval / 1000).toFixed()
      return TextManager.getTempEffectDescription(effect, { interval })
    }

    case TempEffectType.brokenLegs:
      return TextManager.getTempEffectDescription(effect)

    case TempEffectType.soma: {
      const percentage = (effect.factor * 100 - 100).toFixed()
      return TextManager.getTempEffectDescription(effect, { percentage })
    }
  }
}
export default getTempEffectDescription
