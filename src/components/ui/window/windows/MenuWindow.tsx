import { Props as WindowProps } from "components/ui/window/Window";
import CheatWindow from "containers/windows/CheatWindow";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/cheatbox.css";

export interface DispatchProps {
}

export interface StateProps {
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
}

type AllProps = Props & StateProps & DispatchProps & WindowProps;
const Menu = (props: AllProps & AppContextProps) => {

    const handleClickCheats = () => {
        const window = <CheatWindow title = "Cheats" />;
        props.onOpenWindow(window);
    };
    return (
        <div className="menu">
            <ul>
                <li onClick = { handleClickCheats }>Cheats!</li>
            </ul>
        </div>
    );
}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
