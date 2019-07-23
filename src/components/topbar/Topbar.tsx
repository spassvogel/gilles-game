import { Windows } from "constants/ui";
import Resourcebar from "containers/topbar/Resourcebar";
import { AppContextProps } from "hoc/withAppContext";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./css/topbar.css";

export interface Props {
}
export interface DispatchProps {
}

// These are injected by mapStateToProps on the Container
export interface StateProps  {
}

type AllProps = Props & StateProps & DispatchProps & RouteComponentProps & AppContextProps;

export default function(props: AllProps) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        props.onWindowOpened(Windows.menu);
    };
    return (
        <div className = "topbar">
            <div className = "topbar-left">
                <Resourcebar />
            </div>
            <div className = "topbar-right">
                <div className = "hamburger" onClick = { handleClick }>☰</div>
            </div>
        </div>
    );
}
