import * as React from "react";
import { TextManager } from 'global/TextManager';
import { BasicAttribute } from "store/types/adventurer";
import './styles/attributeContext.scss';

export interface Props {
    attribute: BasicAttribute;
}

const TraitContext = (props: Props) => {

    const {attribute} = props;

    return (
        <div className="attribute-context">
            <div className="description">
                {TextManager.getAttributeDescription(attribute)}
            </div>
        </div>
    )
}
export default TraitContext;