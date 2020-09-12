import * as React from "react";
import { WeaponDefinition, DamageType } from 'definitions/items/weapons';
import { TextManager } from 'global/TextManager';
import ProduceOrStudy from './ProduceOrStudy';

interface Props {
    info: WeaponDefinition;
}

const WeaponContent = (props: Props) => {
    const { info } = props;
    const subtext = TextManager.getItemSubtext(info.item);

    return (
        <>
            { subtext && (<p>"{subtext}"</p>)}
            { info.damage && <p> damage: { info.damage[DamageType.kinetic] } </p>}
            <ProduceOrStudy item={info.item} />
        </>
    );

}

export default WeaponContent;