import * as React from "react";
import structureDefinitions, {  Structure, StructureDefinition  } from "src/definitions/structures";
import { StructuresStoreState } from "src/stores/structures";
import "./css/townView.css";

export interface DispatchProps {
    onStructureClick?: (structure: Structure) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {

}

export interface StateProps {
    structures: StructuresStoreState;
}

export default function(props: Props & DispatchProps & StateProps) {

    const handleStructureClick = (structure: Structure) => {
        if (props.onStructureClick) { props.onStructureClick(structure); }
    };

    const structures: Structure[] = [
        Structure.lumberMill,
        Structure.ironMine,
        Structure.farm,
        Structure.tannery,
        Structure.weaponsmith,
        Structure.armoursmith,
    ];

    const list = structures.map((s) => {
        const structureDefinition: StructureDefinition = structureDefinitions[s];
        const levelDefinition = structureDefinition.levels[props.structures[s].level];
        return  <li
            onClick = { () => handleStructureClick(s) }> { levelDefinition.displayName }
        </li>;
    });

    return (
        <div className = "town-view">
            <fieldset>
                <legend>Town</legend>
                <ul>
                    { list }
                </ul>
            </fieldset>
        </div>
    );
}
