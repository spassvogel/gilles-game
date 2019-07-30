import "components/ui/css/common/icon.css";
import { getClassName, IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import "./css/itemicon.css";

export interface Props  {
    item: Item;
    onClick?: (event: React.MouseEvent) => void;
    size?: IconSize;
}

const ItemIcon = (props: Props) => {
    const { item  } =  props;
    const itemDefinition = getDefinition(item);

    if (!itemDefinition) {
        // tslint:disable-next-line: no-console
        console.warn(`could not find definition for ${item}`);
    }     // todo: [10/07/2019] assert

    const handleClick = (event: React.MouseEvent) => {
        if (props.onClick) {
            props.onClick(event);
        }
    };

    const className = "item-icon " + getClassName(props.size);

    return (
        <div className = { className }
            onClick = { handleClick }
            style = {{
                backgroundImage: `url(${itemDefinition.iconImg})`,
            }}>
        </div>
    );
};

export default ItemIcon;
