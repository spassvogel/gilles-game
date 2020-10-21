import React from "react";
import { StructuresStoreState } from 'store/types/structures';
import { Structure } from 'definitions/structures';
import { StructureStoreState, StructureState } from 'store/types/structure';
import { Link } from 'react-router-dom';
import { getStructureLink, getTownLink } from 'utils/routing';
import { TextManager } from 'global/TextManager';
import { useRouteMatch } from 'react-router';
import "./styles/legenda.scss";

interface Props {
    structures: StructuresStoreState;
}

// Legenda with clickable names of structures
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
    const match = useRouteMatch<{structure: string}>(`${getTownLink()}/:structure`);

    const renderText = (structure: Structure) => {
        if (match?.params.structure === structure.toString()) {
            return (
                <span className="highlighted">{`${TextManager.getStructureName(structure)}`}</span>
            )
        }
        return (
            <Link to={getStructureLink(structure)} >
                {`${TextManager.getStructureName(structure)}`}
            </Link>
        )
    }

    return (
        <div className="legenda">
            <ul>
            {orderedStructures.map((structure) => {
                const structureStore: StructureStoreState = structures[structure];
                if (structureStore.state === StructureState.NotBuilt) {
                    return null;
                }
                return (
                    <li key={structure}>
                        {renderText(structure)}
                    </li>
                );
            })}
            </ul>
        </div>
    );
}

export default Legenda;