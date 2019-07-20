
import Resourcebar from "containers/topbar/Resourcebar";
import * as React from "react";
import { TextManager } from "utils/textManager";
import "./css/topbar.css";
import { RouteComponentProps } from "react-router-dom";
import { AppContextProps } from "components/App";

export interface Props {
}
export interface DispatchProps {
}

// These are injected by mapStateToProps on the Container
export interface StateProps  {
}

type AllProps = Props & StateProps & DispatchProps & RouteComponentProps & AppContextProps;

export default function(props: AllProps) {
    console.log(props.match)
    console.log(props.location)
    console.log(props.history)

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        props.onPopupOpened("cheats1")
    }
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
