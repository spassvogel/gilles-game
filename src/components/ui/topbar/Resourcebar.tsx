import { resourceOrder } from "constants/resources";
import resourceDescriptions, { Resource } from "definitions/resources";
import * as React from "react";
import { ResourceStoreState } from "store/types/resources";
import { formatNumber } from 'utils/format/number';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import useGoldState from 'hooks/store/useGoldState';
import { useMaxResourcesState, useResourcesState } from 'hooks/store/resources';
import { useWorkersFreeState } from 'hooks/store/useWorkersState';
import Icon from 'components/ui/common/Icon';
import "./styles/resourcebar.scss";

export interface StateProps  {
    gold: number;
    workers: number;    // total
    workersFree: number;
    resources: ResourceStoreState;
}

/** Shown on top in the UI */
const Resourcebar = () => {

    const goldState = useGoldState();
    const storeResources = useResourcesState();
    const workersFree = useWorkersFreeState();
    const maxResources = useMaxResourcesState();

    const createItem = (icon: string, amount: number, type: Resource | "workers" | "gold") => {
        const full = type !== "workers" && type !== "gold" && (amount ?? 0) >= (maxResources?.[type] ?? 0);

        const handleClick = (event: React.MouseEvent) => {

            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
            TooltipManager.showContextTooltip(ContextType.resource, type, originRect);
            event.stopPropagation();
        };

        return (
            <li key={type} onClick={handleClick}>
                <Icon
                    image={icon}
                    size="smallest"
                />
                <div className={`amount ${full ? "full" : ""}`}>
                    { formatNumber(amount, 0) }
                </div>
            </li>
        )
    };

    const resources = resourceOrder.map((resource) => {
        const resourceDescription = resourceDescriptions[resource];
        return createItem(resourceDescription.iconImg, storeResources[resource] ?? 0, resource);
    });

    resources.push(
        createItem("/img/resources/worker.png", workersFree, "workers"),
        createItem("/img/resources/gold.png", goldState, "gold"),
    );

    return (
        <ul className="resourcebar">
            { resources }
        </ul>
    );
};
export default Resourcebar;
