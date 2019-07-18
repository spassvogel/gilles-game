
import Resourcebar from "containers/topbar/Resourcebar";
import * as React from "react";
import { TextManager } from "utils/textManager";
import "./css/topbar.css";

export interface Props {
}
export interface DispatchProps {
}

// These are injected by mapStateToProps on the Container
export interface StateProps  {
}

export default function(props: Props & StateProps & DispatchProps) {

    return (
        <div className = "topbar">
            <div className = "topbar-left">
                <Resourcebar />
            </div>
            <div className = "topbar-right">
                <div className = "hamburger">☰</div>
            </div>
        </div>
    );
}
