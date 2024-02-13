import { type TempEffect, TempEffectType } from 'definitions/tempEffects/types'
import * as TextManager from 'global/TextManager'

const getTempEffectDescription = (effect: TempEffect) => {
  switch (effect.type) {
    case TempEffectType.burning: {
      const interval = (effect.interval / 1000).toFixed()
      return TextManager.getTempEffectDescription(effect, { interval })
    }

    case TempEffectType.rage:
    case TempEffectType.soma: {
      const percentage = (effect.factor * 100 - 100).toFixed()
      return TextManager.getTempEffectDescription(effect, { percentage })
    }

    default:
      return TextManager.getTempEffectDescription(effect)
  }
}
export default getTempEffectDescription
