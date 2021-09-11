import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { BasicAttribute } from "store/types/adventurer";
import { TextManager } from "global/TextManager";
import { TooltipManager } from "global/TooltipManager";
import { ContextType } from "constants/context";
// import "./styles/attributes.scss"

export interface Props {
    adventurerId: string;
}

const UseItem = (props: Props) => {
    const { adventurerId } = props;
    const { basicAttributes } = useAdventurerState(adventurerId);


    const renderRow = (attribute: BasicAttribute) => {
        const handleClick = (event: React.MouseEvent) => {
            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
    
            TooltipManager.showContextTooltip(ContextType.attribute, attribute, originRect);
            event.stopPropagation();
        }
        return (
            <li >
                <div className="attribute-name">
                    <span onClick={handleClick}>
                        {TextManager.getAttributeName(attribute)}
                    </span>
                </div>
                <div className="attribute-value">
                    {basicAttributes[attribute]}
                </div>
            </li>
        );
    }

    return (
        <div className="basic-attributes">
            {/* todo: use css grid */}
            <ul className="attribute-list">
                {renderRow("str")}
                {renderRow("dex")}
                {renderRow("int")}
                {renderRow("hlt")}
            </ul>
        </div>
    )
}
export default UseItem;
