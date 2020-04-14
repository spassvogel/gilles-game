import { Props as WindowProps } from "components/ui/window/Window";
import CheatWindow from "containers/windows/CheatWindow";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/cheatbox.css";
import SettingsWindow from './SettingsWindow';

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

    const handleClickSettings = () => {
        const window = <SettingsWindow title = "Settings" />;
        props.onOpenWindow(window);
    };
    return (
        <div className="menu">
            <p>
                <button onClick={handleClickCheats}>Cheats!</button>
            </p>
            <p>
                <button onClick={handleClickSettings}>Settings</button>
            </p>
        </div>
    );
}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
