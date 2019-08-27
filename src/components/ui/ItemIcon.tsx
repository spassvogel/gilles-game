import { AppContext } from "components/App";
import "components/ui/css/common/icon.css";
import { ContextType } from "constants/context";
import { getClassName, IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import "./css/itemicon.css";

export interface Props {
    item: Item;
    onClick?: (event: React.MouseEvent) => void;
    size?: IconSize;
    showContext?: boolean;
}

const ItemIcon: React.FC<Props> = (props) => {
    const { item } = props;
    const itemDefinition = getDefinition(item);
    const context = React.useContext(AppContext)!;
    const ref = React.useRef(null);

    if (!itemDefinition) {
        // tslint:disable-next-line: no-console
        console.warn(`could not find definition for ${item}`);
    }     // todo: [10/07/2019] assert

    const handleClick = (event: React.MouseEvent) => {
        if (props.showContext !== false) {
            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
            context.onContextualObjectActivated(
                ContextType.item,
                getDefinition(item),
                ref,
                originRect,
            );
        }

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
