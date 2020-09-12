import { ContextType } from "constants/context";
import { getClassName, IconSize } from "constants/icons";
import { getIconClassName } from "constants/items";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { TooltipManager } from 'global/TooltipManager';
import "./styles/itemicon.scss";
import "components/ui/css/common/icon.css";
import "components/ui/styles/item.scss";
import { TextManager } from 'global/TextManager';

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

    const className = `item-icon ${getClassName(props.size)} ${getIconClassName(itemDefinition.rarity)}`;

    return (
        <div
            className={className}
            onClick={handleClick}
        >
            <img src={`${process.env.PUBLIC_URL}${itemDefinition.iconImg}`} alt={TextManager.getItemName(props.item)} />
        </div>
    );
};

export default ItemIcon;
