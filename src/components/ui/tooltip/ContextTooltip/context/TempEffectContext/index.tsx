import { TextManager } from 'global/TextManager';
import getTempEffectDescription from './getTempEffectDescription';
import { TempEffect } from 'definitions/tempEffects/types';
import './styles/effectContext.scss';

export interface Props {
  effect: TempEffect;
}

const EffectContext = (props: Props) => {
  const { effect } = props;
  const { charges } = effect;
  return (
    <div className="effect-context">
      <hr />

      <div className="description">
         { getTempEffectDescription(effect)}
      </div>
      { /* show time remaining */ }
      { charges && (
        <div>
          {TextManager.get(charges === 1 ? "ui-tooltip-effect-one-charge-remains" : "ui-tooltip-effect-n-charges-remain", { charges }) }
        </div>
      )}
      <hr />
      <div className="flavor secondary">
        {TextManager.getTempEffectFlavor(effect)}
      </div>
    </div>
  )
}
export default EffectContext;
