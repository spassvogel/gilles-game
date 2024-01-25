import * as TextManager from 'global/TextManager'
import { type TraitDefinition } from 'definitions/traits/types'
import './styles/traitContext.scss'

export type Props = {
  traitDefinition: TraitDefinition
}

const TraitContext = (props: Props) => {
  const { traitDefinition } = props

  return (
    <div className="trait-context">
      <div className="description">
        {TextManager.getTraitDescription(traitDefinition.trait)}
      </div>
      { traitDefinition.hasEffect === true && (
      <div className="effect">
        {TextManager.getTraitEffect(traitDefinition.trait)}

      </div>)}
    </div>
  )
}
export default TraitContext
