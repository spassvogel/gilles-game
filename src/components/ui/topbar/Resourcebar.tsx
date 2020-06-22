import "components/ui/css/common/icon.css";
import { resourceOrder } from "constants/resources";
import resourceDescriptions from "definitions/resources";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { TextManager } from "global/TextManager";
import { useSelector } from 'react-redux';
import "./css/resourcebar.css";
import { StoreState } from 'stores';
import { selectFreeWorkers } from 'selectors/workers';
import { formatNumber } from 'utils/number';

export interface StateProps  {
    gold: number;
    workers: number;    // total
    workersFree: number;
    resources: ResourceStoreState;
}

/** Shown on top in the UI */
const Resourcebar = () => {
    // console.log('rendering resourcebar')

    // todo: seperate useSelectors for better performance
    const storeProps = useSelector<StoreState, StateProps>((store: StoreState) => {
        return {
            gold: store.gold,
            resources: store.resources,
            workers: store.workers,
            workersFree: selectFreeWorkers(store),
        };
    });

    const createItem = (icon: string, amount: number, title: string) => {
        return (
            <li title={title} key={title}>
                <div
                    className="icon common-icon-smallest"
                    style = {{ backgroundImage: `url(${process.env.PUBLIC_URL}${icon})`}}
                />
                <div className="amount">
                    { formatNumber(amount, 0) }
                </div>
            </li>
        )
    };

    const resources = resourceOrder.map((resource) => {
        const resourceDescription = resourceDescriptions[resource];
        return createItem(resourceDescription.iconImg, storeProps.resources[resource as string], TextManager.getResourceName(resource));
    });

    resources.push(
        createItem("/img/resources/worker.png", storeProps.workersFree, "workers"),
        createItem("/img/resources/gold.png", storeProps.gold, "gold"),
    );

// <span>
//     workers: <b>{ props.workersFree + " / " + props.workers }</b>
// </span>
// <span>
//     gold: <b>{ props.gold }</b>
// </span>

    return (
        <ul className="resourcebar">
            { resources }
        </ul>
    );
};
export default Resourcebar;
