import * as React from "react";
import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { useAdventurerState } from "hooks/store/adventurers";
import { BasicAttribute } from "store/types/adventurer";
import { TextManager } from "global/TextManager";
import { TooltipManager } from "global/TooltipManager";
import { ContextType } from "constants/context";

export interface Props {
    adventurerId: string;
}

const Attributes = (props: Props) => {
    const { adventurerId } = props;
    const { basicAttributes } = useAdventurerState(adventurerId);


    const renderRow = (attribute: BasicAttribute) => {
        const handleClick = (event: React.MouseEvent) => {
            console.log('click')
            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
    
            TooltipManager.showContextTooltip(ContextType.attribute, attribute, originRect);
        }
        return <li onClick={handleClick}>{TextManager.getAttributeName(attribute)}: {basicAttributes[attribute]}</li>
    }

    return (
        <div className="basic-attributes">
            {/* todo: use css grid */}
            <ul>
                {renderRow("str")}
                {renderRow("dex")}
                {renderRow("int")}
                {renderRow("hlt")}
            </ul>
        </div>
    )
}
export default Attributes;
