
import * as React from "react";
import "./css/topbar.css";

export interface Props {
    
}

export interface StateProps  {
    gold: number;
    workers: number;    // total
    workersFree: number;
}

export default function(props: StateProps) {

    return (
        <div className="topbar">
            <span>
                workers: <b>{ props.workersFree + " / " + props.workers }</b>
            </span>
            <span>
                gold: <b>{ props.gold }</b>
            </span>
        </div>
    );
}
