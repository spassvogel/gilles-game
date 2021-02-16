import * as React from "react";
import { getDefinition as getWeaponDefinition, DamageType, WeaponTypeDefinition, WeaponType, Weapon } from 'definitions/items/weapons';
import { TextManager } from 'global/TextManager';
import ProduceOrStudy from './ProduceOrStudy';

interface Props {
    item: Weapon;
}

const WeaponContent = (props: Props) => {
    const { item } = props;
    const definition = getWeaponDefinition(item)

    const subtext = TextManager.getItemSubtext(item);
    const weaponType = TextManager.getWeaponType(definition.weaponType);
    const { classification } = WeaponTypeDefinition[definition.weaponType];
    const classificationText = TextManager.getWeaponClassification(classification);

    return (
        <>
            <div>{weaponType}
              {definition.weaponType !== WeaponType.shield && (` (${classificationText})`)}
            </div>
            { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
            { definition.damage && <p> damage: { definition.damage[DamageType.kinetic] } </p>}
            <ProduceOrStudy item={item} />
        </>
    );

}

export default WeaponContent;