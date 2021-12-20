import { TextManager } from 'global/TextManager';
import { Effect } from "definitions/effects/types";
import getEffectDescription from "./getEffectDescription";
import './styles/effectContext.scss';

export interface Props {
  effect: Effect;
}

const EffectContext = (props: Props) => {
  const { effect } = props;
  const { charges } = effect;
  return (
    <div className="effect-context">
      <hr />

      <div className="description">
         { getEffectDescription(effect)}
      </div>
      { /* show time remaining */ }
      { charges && (
        <div>
          {TextManager.get(charges === 1 ? "ui-tooltip-effect-one-charge-remains" : "ui-tooltip-effect-n-charges-remain", { charges }) }
        </div>
      )}
      <hr />
      <div className="flavor secondary">
        {TextManager.getEffectFlavor(effect)}
      </div>
    </div>
  )
}
export default EffectContext;
