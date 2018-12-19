
import * as React from "react";
import { ContextInfo, ContextType } from "src/constants";
import { EquipmentDefinition } from "src/definitions/equipment/types";
import "./css/topbar.css";

export interface Props {
    type: ContextType;
    info: ContextInfo;
}

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
            const info = props.info as EquipmentDefinition;
            return (
                <fieldset>
                    <legend> { info.name } </legend>
                    " { info.subText } "
                </fieldset>
            );
    }
}
