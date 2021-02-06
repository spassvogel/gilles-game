import * as React from "react";
import { WeaponDefinition, DamageType, WeaponTypeDefinition, WeaponType } from 'definitions/items/weapons';
import { TextManager } from 'global/TextManager';
import ProduceOrStudy from './ProduceOrStudy';

interface Props {
    info: WeaponDefinition;
}

const WeaponContent = (props: Props) => {
    const { info } = props;
    const subtext = TextManager.getItemSubtext(info.item);
    const weaponType = TextManager.getWeaponType(info.weaponType);
    const { classification } = WeaponTypeDefinition[info.weaponType];
    const classificationText = TextManager.getWeaponClassification(classification);

    return (
        <>
            <div>{weaponType}
              {info.weaponType !== WeaponType.shield && (` (${classificationText})`)}
            </div>
            { subtext && (<p className="subtext">"{subtext}"</p>)}
            { info.damage && <p> damage: { info.damage[DamageType.kinetic] } </p>}
            <ProduceOrStudy item={info.item} />
        </>
    );

}

export default WeaponContent;