import { Effect, EffectType } from "definitions/effects/types";
import { TextManager } from "global/TextManager";

// todo: move somewhere else
const getEffectDescription = ( effect: Effect) => {
  switch (effect.type) {
    case EffectType.attributeIncrease: {
      const attribute = TextManager.getAttributeName(effect.attribute);
      const percentage = (effect.factor * 100 - 100).toFixed( );

      return TextManager.getEffectDescription(effect, { attribute, percentage });
    }
    case EffectType.healthDecreaseOverTime: {
      const interval = (effect.interval / 1000).toFixed( );
      return TextManager.getEffectDescription(effect, { interval });
    }
    case EffectType.healthDecreaseOnMove: {
      return TextManager.getEffectDescription(effect)
    }
  }
}
export default getEffectDescription;
