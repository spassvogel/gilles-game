import * as React from "react";
import { getDefinition, Structure  } from "definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition } from "definitions/structures/types";
import UpDownValue from "components/ui/common/UpDownValue";
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store/types';
import { selectFreeWorkers } from 'store/selectors/workers';
import { decreaseWorkers, increaseWorkers } from 'store/actions/structures';
import StructureViewHeader from '../StructureViewHeader';
import { TextManager } from 'global/TextManager';
import StructureLevel from '../StructureLevel';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import UpgradeHelpModal from './UpgradeHelpModal';
import useStructureState from 'hooks/store/useStructureState';
import ResourceGenerationRow from './ResourceGenerationRow';
import { Resource } from 'definitions/resources';
import Button from "components/ui/buttons/Button";
import './styles/resourceStructureView.scss';
// import { pick } from "mechanics/lootTable";
// todo: 2021-02-19 Generate items at resource structures

export interface Props  {
    structure: Structure;
}

// todo: 02/12/2019 [ ] Can show progress bar in resource screen
const ResourceStructureView = (props: Props) => {
    const {structure} = props;

    // Fetch needed values from store
    const {level, workers} = useStructureState(structure);
    const structureDefinition = getDefinition<ResourceStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure} with type ResourceStructureDefinition.`);
    }
    const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[level];
    const workersFree = useSelector<StoreState, number>((store) => selectFreeWorkers(store));

    // Reducer dispatch
    const dispatch = useDispatch();
    const handleWorkersDown = () => {
        dispatch(decreaseWorkers(props.structure));
    }

    const handleWorkersUp = () => {
        dispatch(increaseWorkers(props.structure));
    };


    const upDisabled = workers === levelDefinition.workerCapacity || (workersFree || 0) < 1;
    const downDisabled = workers === 0;

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
            <div className="resource-structure-view">
                <section>
                    <StructureLevel structure={structure} onHelpClicked={handleHelpClicked}/>
                    <UpDownValue
                        label={TextManager.get("ui-structure-production-workers")}
                        value={workers}
                        max={levelDefinition.workerCapacity}
                        upDisabled={upDisabled}
                        downDisabled={downDisabled}
                        onDown={handleWorkersDown}
                        onUp={handleWorkersUp}
                    />
                    { /** Generates this resource */}
                    { Object.keys(levelDefinition.generates).map(r => <ResourceGenerationRow structure={structure} resource={r as Resource} key={r} />)}
                    { /** Generates these items */}
                    { levelDefinition.harvest && <Button onClick={() => { /*console.log(pick(levelDefinition.harvest!.lootTable))*/}}>harvest!</Button> }
                </section>
            </div>
        </>
    );
};

export default ResourceStructureView;
