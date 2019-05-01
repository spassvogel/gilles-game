
import * as React from "react";
import { Persistor } from "redux-persist";
import { TextManager } from "src/utils/textManager";
import { View } from "./App";
import "./css/topbar.css";

export interface Props {
    appView: View;
    persistor: Persistor;
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
    const handleViewClick = () => {
        props.onViewButtonClick();
    };
    const handleResetClick = () => {
        props.persistor.purge();
        location.reload();
    };
    const viewButtonText = props.appView === View.Town ? TextManager.get(`common-view-button-world`) :
        TextManager.get(`common-view-button-town`);

    return (
        <div className="topbar">
            <div className="topbar-left">
                <button onClick= { () => handleViewClick() }> { viewButtonText } </button>
                { ` | `}
                <button onClick= { () => handleResetClick() } style={ { color: "red" } }> Restart! </button>
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
