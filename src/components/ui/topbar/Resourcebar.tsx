import { resourceOrder } from "constants/resources";
import resourceDescriptions from "definitions/resources";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { formatNumber } from 'utils/number';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import useGoldState from 'hooks/store/useGoldState';
import useResourcesState from 'hooks/store/useResourcesState';
import { useWorkersFreeState } from 'hooks/store/useWorkersState';
import "./styles/resourcebar.scss";
import "components/ui/styles/icon.scss";

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

    const createItem = (icon: string, amount: number, type: string) => {

        const handleClick = (event: React.MouseEvent) => {

            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
            TooltipManager.showContextTooltip(ContextType.resource, type, originRect);
            event.stopPropagation();
        };

        return (
            <li key={type} onClick={handleClick}>
                <div
                    className="icon common-icon-smallest"
                    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${icon})` }}
                />
                <div className="amount">
                    { formatNumber(amount, 0) }
                </div>
            </li>
        )
    };

    const resources = resourceOrder.map((resource) => {
        const resourceDescription = resourceDescriptions[resource];
        return createItem(resourceDescription.iconImg, storeResources[resource as string], resource);
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
