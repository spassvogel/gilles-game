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
import { useEngine } from 'hooks/store/engine';
import { formatDuration } from 'utils/format/time';
import { RESOURCE_INTERVAL } from 'constants/resources';
import Progressbar, { Direction } from 'components/ui/common/Progressbar';
import { Resource } from 'definitions/resources';

export interface Props  {
    structure: Structure;
}

// todo: 02/12/2019 [ ] Can show progress bar in resource screen
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
    const engine = useEngine();
    const handleWorkersDown = () => {
        dispatch(decreaseWorkers(props.structure));
    }

    const handleWorkersUp = () => {
        dispatch(increaseWorkers(props.structure));
    };

    const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[level];

    const upDisabled = workers === levelDefinition.workerCapacity || (workersFree || 0) < 1;
    const downDisabled = workers === 0;

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
        return (
            <div>
                { "Generates (every minute): " }
                <br/>
                {generatesText }
            </div>
        );
    };

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = <UpgradeHelpModal level={level} structure={structure} />;
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }
    const delta = RESOURCE_INTERVAL - (Date.now() - engine.lastProducedUpdate);

    return (
        <>
            <StructureViewHeader structure={props.structure} />
            <details open={true} className="resource-structure-view">
                <section>
                    <UpDownValue
                        label={TextManager.get("ui-structure-production-workers")}
                        value={workers}
                        max={levelDefinition.workerCapacity}
                        upDisabled={upDisabled}
                        downDisabled={downDisabled}
                        onDown={handleWorkersDown}
                        onUp={handleWorkersUp}
                    />
                    <UpgradeStructureButton structure={structure} onHelpClicked={handleHelpClicked}/>
                    {createGeneratesRow() }
                </section>
            </details>
            <Progressbar
                className="generating"
                direction={Direction.decreasing}
                label={`${TextManager.get("ui-structure-resource-next-generates", {
                    amount: 2, // todo
                    resource: Resource.wood,
                    time: formatDuration(delta)
                })}`}
                progress={delta / RESOURCE_INTERVAL}
            />
        </>
    );
};

export default ResourceStructureView;
