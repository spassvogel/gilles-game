import * as React from "react";
import { TextManager } from 'global/TextManager';
import { ApparelDefinition } from 'definitions/items/apparel';
import ProduceOrStudy from './ProduceOrStudy';

interface Props {
    info: ApparelDefinition;
}

const ApparelContent = (props: Props) => {
    const { info } = props;
    const { damageReduction } = info;
    const subtext = TextManager.getItemSubtext(info.item);
    const equipmentSlot = TextManager.getEquipmentSlot(info.equipmentType);
    return (
        <>
            <div>{`${equipmentSlot}`}</div>
            { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
            { damageReduction && <p> { TextManager.get("ui-tooltip-damage-reduction", { damageReduction}) } </p> }
            <ProduceOrStudy item={info.item} />
        </>
    );
};

export default ApparelContent;