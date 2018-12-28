
import * as React from "react";
import { DeedDefinition } from "src/definitions/items/deeds";
import { ItemDefinition, ItemType } from "src/definitions/items/types";

export interface Props {
    info: ItemDefinition;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

export default function(props: Props & DispatchProps) {
    const info = props.info;
    switch (info.itemType) {
        case ItemType.deed:
            const deedInfo = info as DeedDefinition;
            // const structureInfo = structureDefinitions[deedInfo.structure]

            return (
                <p> " { info.subText } "
                    <button> Start construction </button>
                </p>
            );
        default:
            return (
                <p> " { info.subText } "
                </p>
            );
    }
}
