
import * as React from "react";
import { ContextInfo, ContextType } from "src/constants";
import { DeedDefinition } from "src/definitions/items/deeds";
import { ItemDefinition, ItemType } from "src/definitions/items/types";
import "./css/topbar.css";

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
    switch (props.type) {
        case ContextType.item:
        default:
            return showItemInfo(props.info as ItemDefinition);
    }
}

function showItemInfo(info: ItemDefinition) {
    switch (info.itemType) {
        case ItemType.deed:
            const deedInfo = info as DeedDefinition;
            //const structureInfo = structureDefinitions[deedInfo.structure]
            
            return (
                <fieldset>
                    <legend> { info.name } </legend>
                    " { info.subText } "
                    <button> Start construction </button>
                </fieldset>
            );
        default:
            return (
                <fieldset>
                    <legend> { info.name } </legend>
                    " { info.subText } "
                </fieldset>
            );
    }
}
