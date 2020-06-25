import * as React from "react";
import { WeaponDefinition, DamageType } from 'definitions/items/weapons';
import { TextManager } from 'global/TextManager';

interface Props {
    info: WeaponDefinition;
}

const WeaponContent = (props: Props) => {
    const { info } = props;
    const subtext = TextManager.getItemSubtext(info.item);

    return (
        <>
            { subtext && (<p>"{subtext}"</p>)}
            <p> damage: { info.damage[DamageType.kinetic] } </p>
        </>
    );

}

export default WeaponContent;