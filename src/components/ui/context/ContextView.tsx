
import { ContextInfo, ContextType } from "constants/context";
import ItemContext from "containers/ui/context/ItemContext";
import * as React from "react";
import { TextManager } from "utils/textManager";

export interface Props {
    type: ContextType;
    info: ContextInfo;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

/**
 * The ContextView shows the player contextual information about the item she clicked
 * @param props
 */
export default function(props: Props & DispatchProps) {
    const info = props.info;
    let content;

    switch (props.type) {
        case ContextType.item:
        default:
            content = <ItemContext info= { props.info } />;
    }

    const name = TextManager.getItemName(info.item);
    return (
        <fieldset>
            <legend> { name } </legend>
            { content }
        </fieldset>
    );
}
