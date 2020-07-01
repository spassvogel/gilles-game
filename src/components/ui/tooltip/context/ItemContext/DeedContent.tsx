import * as React from "react";
import { useDispatch } from 'react-redux';
import { Structure, getDefinition } from 'definitions/structures';
import { subtractGold } from 'actions/gold';
import { startBuildingStructure, finishBuildingStructure } from 'actions/structures';
import { startTask } from 'actions/tasks';
import { TaskType } from 'stores/task';
import { DeedDefinition } from 'definitions/items/deeds';
import useGold from 'hooks/store/useGold';
import useStructure from 'hooks/store/useStructure';
import { StructureState } from 'stores/structure';
import { TextManager } from 'global/TextManager';

interface Props {
    info: DeedDefinition;
}

const DeedContent = (props: Props) => {
    const { info } = props;
    const dispatch = useDispatch();

    const gold = useGold();
    const structureDefinition = getDefinition(info.structure);
    const enoughGold = structureDefinition.cost.gold || 0 <= gold;
    const structureStoreState = useStructure(info.structure);
    const canBeBuilt = structureStoreState.state === StructureState.NotBuilt;
    const disabled = !canBeBuilt || !enoughGold;
    const subtext = TextManager.getItemSubtext(info.item);

    const handleStartConstruction = (structure: Structure) => {

        dispatch(subtractGold(structureDefinition.cost.gold || 0));
        dispatch(startBuildingStructure(structure));

        const callbacks = [ finishBuildingStructure(structure) ];
        const time = structureDefinition.cost.time!;
        const start = startTask(TaskType.buildStructure,
            `${structure}.build`,
            "town",
            time,
            callbacks);
        dispatch(start);
    }
    return (
        <div>
            { subtext && (<p>"{subtext}"</p>)}
            <button disabled={ disabled } onClick= { () => handleStartConstruction(info.structure) }>
                Start construction ({ structureDefinition.cost.gold } gold)
            </button>
        </div>
    );

}

export default DeedContent;