import * as React from "react";
import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { useAdventurerState } from "hooks/store/adventurers";
import { BasicAttribute } from "store/types/adventurer";
import { TextManager } from "global/TextManager";

export interface Props {
    adventurerId: string;
}

const Attributes = (props: Props) => {
    const { adventurerId } = props;
    const { basicAttributes } = useAdventurerState(adventurerId);

    const renderRow = (attribute: BasicAttribute) => {
        return <li>{TextManager.getAttributeName(attribute)}: {basicAttributes[attribute]}</li>
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
