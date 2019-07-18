
import * as React from "react";
import { TextManager } from "utils/textManager";
import "./css/resourcebar.css";
import "components/ui/css/common/icon.css";
import { ResourceStoreState } from "stores/resources";
import resourceDescriptions from "definitions/resources";
import { resourceOrder } from "constants/resources";

export interface Props {
}

export interface DispatchProps {
}

// These are injected by mapStateToProps on the Container
export interface StateProps  {
    gold: number;
    workers: number;    // total
    workersFree: number;
    resources: ResourceStoreState;
}

const Resourcebar = (props: Props & StateProps & DispatchProps) => {

    const createItem = (icon: string, amount: number, title: string) => {
        return <li title = { title } key = { title }>
            <div className = "icon common-icon-smallest" style = {{
                backgroundImage:  `url(${icon})`,
            }}></div>
            <div className = "amount">
                { amount }
            </div>
        </li>;
    }

    const resources = resourceOrder.map((resource) => {
        const resourceDescription = resourceDescriptions[resource];
        return createItem(resourceDescription.iconImg, props.resources[resource as string], TextManager.getResourceName(resource))
    });

    resources.push(
        createItem("/img/resources/worker.png", props.workersFree, "workers"),
        createItem("/img/resources/gold.png", props.gold, "gold"),
    )

//     <span>
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
}
export default Resourcebar;
