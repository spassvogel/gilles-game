import * as React from "react";
import { getDefinition, Structure  } from "definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition } from "definitions/structures/types";
import UpDownValue from "../ui/UpDownValue";
import { StructureStoreState } from 'stores/structure';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'stores';
import { selectFreeWorkers } from 'selectors/workers';
import { decreaseWorkers, increaseWorkers } from 'actions/structures';
import StructureViewHeader from './StructureViewHeader';
import useStructureActions from 'hooks/actions/useStructureActions';
import { TextManager } from 'global/TextManager';


export interface Props  {
    type: Structure;
}

const ResourceStructureView = (props: Props) => {

    // Fetch needed values from store
    const gold = useSelector<StoreState, number>((store) => store.gold);
    const level = useSelector<StoreState, number>((store) => {
        const structureStore: StructureStoreState = store.structures[props.type];
        if (!structureStore) { throw new Error(`No structure '${props.type}' found in the store!`); }
        return structureStore.level;
    });
    const workers = useSelector<StoreState, number>((store) => {
        const structureStore: StructureStoreState = store.structures[props.type];
        if (!structureStore) { throw new Error(`No structure '${props.type}' found in the store!`); }
        return structureStore.workers;
    });
    const workersFree = useSelector<StoreState, number>((store) => selectFreeWorkers(store));

    const structureDefinition = getDefinition<ResourceStructureDefinition>(props.type);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type ResourceStructureDefinition.`);
    }
    const {startUpgradeStructure} = useStructureActions();

    // Reducer dispatch
    const dispatch = useDispatch();

    const handleWorkersDown = () => {
        dispatch(decreaseWorkers(props.type));
    }

    const handleWorkersUp = () => {
        dispatch(increaseWorkers(props.type));
    };

    const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[level];

    const createWorkersRow = () => {
        const upDisabled = workers === levelDefinition.workerCapacity || (workersFree || 0) < 1;
        const downDisabled = workers === 0;
        return (
            <UpDownValue
                label={TextManager.get("ui-structure-production-workers")}
                value={workers}
                max={levelDefinition.workerCapacity}
                upDisabled={upDisabled}
                downDisabled={downDisabled}
                onDown={handleWorkersDown}
                onUp={handleWorkersUp}
            />
        );
    };

    const createUpgradeRow = () => {
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = () => {
            startUpgradeStructure(nextLevelCost, level + 1, props.type);
        };

        return <div>
            <label>
                {TextManager.get("ui-structure-level")}
            </label>
            {(level + 1) + " / " + structureDefinition.levels.length }
            <button
                style={{float: "right"}}
                onClick={handleClick }
                disabled= {!canUpgrade } >
                    {upgradeText }
            </button>
        </div>;
    };

    const createGeneratesRow = () => {
        const generates = levelDefinition.generates;
        const generatesText = Object.keys(generates).reduce((accumulator: string[], value: string) => {
            // For values that are not 0
            if (generates[value]) {
                // tslint:disable-next-line:max-line-length
                accumulator.push(`${generates[value]} x ${workers} = ${generates[value] * (workers || 0)} ${value}`);
            }
            return accumulator;
        }, []).join(",");
        return <div>
            {"Generates (every minute): " }
            <br/>
            {generatesText }
        </div>;
    };

    return (
        <>
            <StructureViewHeader structure={props.type} />
            <details open={true} className="structureview">
                <section>
                    {createWorkersRow() }
                    {createUpgradeRow() }
                    {createGeneratesRow() }
                </section>
            </details>
        </>
    );
};

export default ResourceStructureView;
