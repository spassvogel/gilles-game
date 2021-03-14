import * as React from "react";
import { useDispatch } from 'react-redux';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { Potion, getDefinition } from "definitions/items/potions";

interface Props {
    item: Potion;
}

const DeedContent = (props: Props) => {
    const { item } = props;

    // const gold = useGoldState();
    // const structureDefinition = getDefinition(definition.structure);
    // const enoughGold = structureDefinition.cost.gold || 0 <= gold;
    // const structureStoreState = useStructureState(definition.structure);
    // const canBeBuilt = structureStoreState.state === StructureState.NotBuilt;
    // const disabled = !canBeBuilt || !enoughGold;
    const subtext = TextManager.getItemSubtext(item);

    const handleDrink = () => {

    //     dispatch(subtractGold(structureDefinition.cost.gold || 0));
    //     dispatch(startBuildingStructure(structure));

    //     const callbacks = [ finishBuildingStructure(structure) ];
    //     const time = structureDefinition.cost.time;
    //     const start = startTask(TaskType.buildStructure,
    //         `${structure}.build`,
    //         "town",
    //         time ?? 0,
    //         callbacks);
    //     dispatch(start);
    }
    return (
        <div>
            { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
            <Button
                disabled={false}
                size="small"
                onClick={() => handleDrink()}
            >
                Drink potion
            </Button>
        </div>
    );

}

export default DeedContent;