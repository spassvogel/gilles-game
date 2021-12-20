import { Effect, EffectType } from "definitions/effects/types";
import { TextManager } from "global/TextManager";


const getEffectDescription = ( effect: Effect) => {

  switch (effect.type) {
    case EffectType.burning: {
      const interval = (effect.interval / 1000).toFixed( );
      return TextManager.getEffectDescription(effect, { interval })
    }
    case EffectType.brokenLegs: 
      return TextManager.getEffectDescription(effect)
    case EffectType.soma: {
      const percentage = (effect.factor * 100 - 100).toFixed( );
      return TextManager.getEffectDescription(effect, { percentage })
    }
  }
}
export default getEffectDescription;