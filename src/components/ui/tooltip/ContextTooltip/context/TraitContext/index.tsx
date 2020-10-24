import * as React from "react";
import { TextManager } from 'global/TextManager';
import { TraitDefinition } from 'definitions/traits/types';
 import './styles/traitContext.scss';

export interface Props {
    traitDefinition: TraitDefinition;
}

const TraitContext = (props: Props) => {

    const {traitDefinition} = props;

    return (
        <div className="trait-context">
            <div className="description">
                {TextManager.getTraitDescription(traitDefinition.trait)}
            </div>
            { traitDefinition.hasEffect && (
            <div className="effect">
                {TextManager.getTraitEffect(traitDefinition.trait)}

            </div>)}
        </div>
    )
}
export default TraitContext;