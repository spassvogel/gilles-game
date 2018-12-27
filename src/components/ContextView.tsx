
import * as React from "react";
import { ContextInfo, ContextType } from "src/constants";
import { DeedDefinition } from "src/definitions/items/deeds";
import { ItemDefinition } from "src/definitions/items/types";
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
        case ContextType.item_deed:
            return showDeed(props.info as DeedDefinition);
        case ContextType.item:
        default:
            return showInfo(props.info as ItemDefinition);
    }
}

function showDeed(info: DeedDefinition) {
    return (
        <fieldset>
            <legend> { info.name } DEED </legend>
            " { info.subText } "
        </fieldset>
    );
}

function showInfo(info: ItemDefinition) {
    return (
        <fieldset>
            <legend> { info.name } </legend>
            " { info.subText } "
        </fieldset>
    );
}
