import * as React from "react";
import { TextManager } from 'global/TextManager';
import { ApparelDefinition } from 'definitions/items/apparel';

interface Props {
    info: ApparelDefinition;
}

const ApparelContent = (props: Props) => {
    const { info } = props;
    const subtext = TextManager.getItemSubtext(info.item);

    return (
        <>
            { subtext && (<p>"{subtext}"</p>)}
            { info.armourRating && <p> armour: { info.armourRating } </p> }
        </>
    );

}

export default ApparelContent;