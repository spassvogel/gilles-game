import * as React from "react";
import { getDefinition, Structure  } from "definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition } from "definitions/structures/types";
import UpDownValue from "components/ui/common/UpDownValue";
import { StructureStoreState } from 'store/types/structure';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store/types';
import { selectFreeWorkers } from 'store/selectors/workers';
import { decreaseWorkers, increaseWorkers } from 'store/actions/structures';
import StructureViewHeader from '../StructureViewHeader';
import { TextManager } from 'global/TextManager';
import UpgradeStructureButton from '../UpgradeStructureButton';
import './styles/resourceStructureView.scss';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import UpgradeHelpModal from './UpgradeHelpModal';

export interface Props  {
    structure: Structure;
}

const ResourceStructureView = (props: Props) => {
    const {structure} = props;
    // Fetch needed values from store
    const level = useSelector<StoreState, number>((store) => {
        const structureStore: StructureStoreState = store.structures[props.structure];
        if (!structureStore) { throw new Error(`No structure '${props.structure}' found in the store!`); }
        return structureStore.level;
    });
    const workers = useSelector<StoreState, number>((store) => {
        const structureStore: StructureStoreState = store.structures[props.structure];
        if (!structureStore) { throw new Error(`No structure '${props.structure}' found in the store!`); }
        return structureStore.workers;
    });
    const workersFree = useSelector<StoreState, number>((store) => selectFreeWorkers(store));

    const structureDefinition = getDefinition<ResourceStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure} with type ResourceStructureDefinition.`);
    }
    // Reducer dispatch
    const dispatch = useDispatch();

    const handleWorkersDown = () => {
        dispatch(decreaseWorkers(props.structure));
    }

    const handleWorkersUp = () => {
        dispatch(increaseWorkers(props.structure));
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

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = <UpgradeHelpModal level={level} structure={structure} />;
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }

    return (
        <>
            <StructureViewHeader structure={props.structure} />
            <details open={true} className="resource-structure-view">
                <section>
                    {createWorkersRow() }
                    <UpgradeStructureButton structure={structure} onHelpClicked={handleHelpClicked}/>
                    {createGeneratesRow() }
                </section>
            </details>
        </>
    );
};

export default ResourceStructureView;
