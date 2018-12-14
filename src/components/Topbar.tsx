
import * as React from "react";
import { View } from "./App";
import "./css/topbar.css";

export interface Props {
    appView: View;
}
export interface DispatchProps {
    onViewButtonClick: () => void;
}

// These are injected by mapStateToProps on the Container
export interface StateProps  {
    gold: number;
    workers: number;    // total
    workersFree: number;
}

export default function(props: Props & StateProps & DispatchProps) {
    const handleClick = () => {
        props.onViewButtonClick();
    };
    return (
        <div className="topbar">
            <div className="topbar-left">
                <button onClick= { () => handleClick() }> { View[props.appView] } </button>
            </div>
            <div className="topbar-right">
                <span>
                    workers: <b>{ props.workersFree + " / " + props.workers }</b>
                </span>
                <span>
                    gold: <b>{ props.gold }</b>
                </span>
            </div>
        </div>
    );
}
