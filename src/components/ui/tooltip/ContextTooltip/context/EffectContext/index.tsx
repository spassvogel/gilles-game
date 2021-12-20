import { TextManager } from 'global/TextManager';
import { Effect } from "definitions/effects/types";
import getEffectDescription from "./getEffectDescription";
import './styles/effectContext.scss';

export interface Props {
  effect: Effect;
}

const EffectContext = (props: Props) => {
  const { effect } = props;

  return (
    <div className="effect-context">
      <hr />

      <div className="description">
         { getEffectDescription(effect)}
      </div>
      { /* show charges or time remaining */ }
      { effect.charges && (
        <div>
          {effect.charges} charges remain
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
