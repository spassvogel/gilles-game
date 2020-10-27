import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useStockpileState from 'hooks/store/useStockpileState';
import Button from 'components/ui/buttons/Button';
import UpDownValue from 'components/ui/common/UpDownValue';
import ItemsBox from 'components/ui/items/ItemsBox';
import ResourcesCostBox from 'components/ui/resources/ResourcesCostBox';
import { Item } from 'definitions/items/types';
import { TextManager } from 'global/TextManager';
import { useResourcesState } from 'hooks/store/resources';
import { useWorkersFreeState } from 'hooks/store/useWorkersState';
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from 'mechanics/crafting';
import { formatDuration } from 'utils/format/time';
import { getDefinition as getProductionDefinition } from "definitions/production";
import { ProductionDefinition } from 'definitions/production/types';
import { addItemToWarehouse } from 'store/actions/items';
import { removeResources } from 'store/actions/resources';
import { increaseWorkers } from 'store/actions/structures';
import { startTask } from 'store/actions/tasks';
import { TaskType } from 'store/types/task';
import { Structure } from 'definitions/structures';

export interface Props {
    item: Item;
    structure: Structure;
}

const CraftingDetails = (props: Props) => {
    const { item, structure } = props;
    const dispatch = useDispatch();
    const resourcesState = useResourcesState();
    const stockpileState = useStockpileState();
    const workersFree = useWorkersFreeState();
    const [workersAssigned, setWorkersAssigned] = useState<number>(0);

    const produces = getProductionDefinition(item)!;
    const costResources = produces.cost.resources!;
    const missingAtLeastOneResource = Object.keys(costResources)
        .some((resource) => costResources[resource] > resourcesState[resource]);

    let missingAtLeastOneItem = false;
    const costMaterials = produces.cost.materials;
    if (costMaterials) {
        missingAtLeastOneItem = costMaterials.some((i: Item) => stockpileState.indexOf(i) === -1);
    }

    const disabled = missingAtLeastOneResource || missingAtLeastOneItem || workersAssigned < 1;
    // TODO: [10/07/2019] Perhaps each item can have a number of minimum workers?

    const makeTimeString = (asNumber: number): string => {
        if (workersAssigned === 0) {
            return "";
        }
        const craftingTime = calculateProductionTime(asNumber, workersAssigned);
        const time = formatDuration(craftingTime);
        return TextManager.get("ui-structure-production-crafting-time", { time });
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        handleCraft(produces, workersAssigned);
        setWorkersAssigned(0);
    };

    const handleUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        setWorkersAssigned(workersAssigned + 1);
    };

    const handleDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setWorkersAssigned(workersAssigned - 1);
    };

    const handleCraft = (productionDefinition: ProductionDefinition, workers: number) => {
        const craftingTime = calculateProductionTime(productionDefinition.cost.time || 0, workers);
        dispatch(removeResources(productionDefinition.cost.resources || {}));
        dispatch(increaseWorkers(structure, workers));

        const callbacks = [
            addItemToWarehouse(productionDefinition.item),
            increaseWorkers(structure, workers),
        ];
        const start = startTask(TaskType.craftItem,
            productionDefinition.item,
            `${structure}.craft`,
            craftingTime,
            callbacks);
        dispatch(start);
    }

    return (
        <div className="crafting-details">
            { TextManager.get("ui-structure-production-craft-a", {item}) }
            <div className="crafting-costs">
                <fieldset>
                    <ResourcesCostBox resources={costResources} />
                </fieldset>
                <fieldset>
                    {costMaterials && <ItemsBox items={costMaterials} />}
                </fieldset>
            </div>
            <div className="buttonrow">
                <div>
                    <UpDownValue
                        value={workersAssigned}
                        label={TextManager.get("ui-structure-production-workers")}
                        onUp={handleUp}
                        onDown={handleDown}
                        upDisabled={
                            workersAssigned >= workersFree ||
                            workersAssigned >= MAX_WORKERS_CRAFTING
                        }
                        downDisabled={workersAssigned < 1}
                    />
                    { makeTimeString(produces.cost.time || 0)}
                </div>
                <div>
                    <Button
                        disabled={disabled}
                        className="craft"
                        onClick={handleClick}
                    >
                        {TextManager.get("ui-structure-production-craft")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CraftingDetails;