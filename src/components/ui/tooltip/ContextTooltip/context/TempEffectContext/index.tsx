import * as TextManager from 'global/TextManager'
import getTempEffectDescription from './getTempEffectDescription'
import { type TempEffect } from 'definitions/tempEffects/types'
import './styles/effectContext.scss'

export type Props = {
  effect: TempEffect
}

const EffectContext = (props: Props) => {
  const { effect } = props
  const { charges } = effect
  return (
    <div className="effect-context">
      <hr />

      <div className="description">
         { getTempEffectDescription(effect)}
      </div>
      { /* show time remaining */ }
      { charges !== 0 && charges != null && (
        <div>
          {TextManager.get(charges === 1 ? 'ui-tooltip-effect-one-charge-remains' : 'ui-tooltip-effect-n-charges-remain', { charges }) }
        </div>
      )}
      <hr />
      <div className="flavor secondary">
        {TextManager.getTempEffectFlavor(effect)}
      </div>
    </div>
  )
}
export default EffectContext
