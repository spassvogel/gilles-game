import React from 'react';
import { getDefinition, Structure } from 'definitions/structures';
import { TextManager } from 'global/TextManager';
import { useEngine } from 'hooks/store/engine';
import { formatDuration } from 'utils/format/time';
import { RESOURCE_INTERVAL } from 'constants/resources';
import  { Direction } from 'components/ui/common/progress/PlainProgressbar';
import { Resource } from 'definitions/resources';
import useStructureState from 'hooks/store/useStructureState';
import { ResourceStructureDefinition, ResourceStructureLevelDefinition } from 'definitions/structures/types';
import Icon from 'components/ui/common/Icon';
import resourceDescriptions from "definitions/resources";
import TickingProgressbar from 'components/ui/common/progress/TickingProgressbar';

interface Props {
    structure: Structure;
    resource: Resource;
}

const ResourceGenerationRow = (props: Props) => {
    const {structure, resource} = props;
    const engine = useEngine();
    const {level, workers} = useStructureState(structure);
    const structureDefinition = getDefinition<ResourceStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure} with type ResourceStructureDefinition.`);
    }
    const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[level];
    const generates = levelDefinition.generates[resource] || 0;
    const delta = RESOURCE_INTERVAL - (Date.now() - engine.lastProducedUpdate);
    const resourceDescription = resourceDescriptions[resource];

    return (
        <div className="resource-generation-row">
            <div className="info">
                <Icon image={resourceDescription.iconImg}  size="smallest"/>
                <div>
                    {TextManager.get("ui-structure-resource-generates", {
                        amount: generates,
                        resource,
                    })}
                </div>
            </div>
            { workers > 0 &&
            <TickingProgressbar
                className="generating"
                direction={Direction.decreasing}
                label={`${TextManager.get("ui-structure-resource-next-generates", {
                    amount: generates * workers,
                    resource,
                    time: formatDuration(delta)
                })}`}
                progress={delta / RESOURCE_INTERVAL}
            />}
            { !workers && TextManager.get("ui-structure-resource-no-workers")}
        </div>
    )
}
export default ResourceGenerationRow;