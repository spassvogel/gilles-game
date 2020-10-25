import * as React from "react";
import { ContextType } from "constants/context";
import { Rarity } from "constants/items";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import { TooltipManager } from 'global/TooltipManager';
import Icon, { IconSize } from 'components/ui/common/Icon';
import "./styles/itemIcon.scss";

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

    const className = `item-icon ${getIconClassName(itemDefinition.rarity)} `;

    return (
        <div className={className}>
            <Icon
                image={itemDefinition.iconImg}
                size={props.size}
                onClick={handleClick}
            />
        </div>
    );
};

export default ItemIcon;


const getIconClassName = (rarity?: Rarity): string => {
    switch (rarity) {
        case Rarity.common:
            return "item-icon-common";
        case Rarity.uncommon:
            return "item-icon-uncommon";
        case Rarity.rare:
            return "item-icon-rare";
        case Rarity.epic:
            return "item-icon-epic";
        case Rarity.legendary:
            return "item-icon-legendary";
    }
    return getIconClassName(Rarity.common);
};