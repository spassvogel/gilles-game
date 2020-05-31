import React from "react";
import "./css/legenda.css";
import { StructuresStoreState } from 'stores/structures';
import { Structure } from 'definitions/structures';
import { StructureStoreState, StructureState } from 'stores/structure';
import { Link } from 'react-router-dom';
import { getStructureLink } from 'utils/routing';
import { TextManager } from 'global/TextManager';

interface Props {
    structures: StructuresStoreState;
}

const Legenda = (props: Props) => {
    const {structures} = props;
    const orderedStructures = [
        Structure.workshop,
        Structure.quarry,
        Structure.tavern,
        Structure.tannery,
        Structure.alchemist,
        Structure.garden,
        Structure.weaponsmith,
        Structure.armoursmith,
        Structure.warehouse,
        Structure.mine,
        Structure.lumberMill,
        Structure.weaver,
    ];   
    return (
        <div className="legenda">
            <ul>
            {orderedStructures.map((structure) => {
                const structureStore: StructureStoreState = structures[structure];
                if (structureStore.state === StructureState.NotBuilt) {
                    return null;
                }
                return (
                    <li>
                        <Link to={getStructureLink(structure)} >
                        {`${TextManager.getStructureName(structure)}`}
                        </Link>
                    </li>
                );
            })}
            </ul>
        </div>
    );
}

export default Legenda;