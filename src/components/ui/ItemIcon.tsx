import { ContextType } from "constants/context";
import { getClassName, IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { TooltipManager } from 'global/TooltipManager';
import "./css/itemicon.css";
import "components/ui/css/common/icon.css";

export interface Props {
    item: Item;
    onClick?: (event: React.MouseEvent) => void;
    size?: IconSize;
    showContext?: boolean;
}

const ItemIcon = (props: Props) => {
    const {item} = props;
    const itemDefinition = getDefinition(item);

    if (!itemDefinition) {
        // tslint:disable-next-line: no-console
        console.warn(`could not find definition for ${item}`);
    }     // todo: [10/07/2019] assert

    const handleClick = (event: React.MouseEvent) => {
        if (props.showContext !== false) {
            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
            TooltipManager.showContextTooltip(ContextType.item, getDefinition(item), originRect);
            event.stopPropagation();
        }

        if (props.onClick) {
            props.onClick(event);
        }
    };

    const className = `item-icon ${getClassName(props.size)}`;

    return (
        <div
            className={className}
            onClick={handleClick}
            style={{backgroundImage: `url(${process.env.PUBLIC_URL}${itemDefinition.iconImg})`}}
        />
    );
};

export default ItemIcon;
