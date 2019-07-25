import { Props as WindowProps } from "components/ui/window/Window";
import { Windows } from "constants/ui";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/cheatbox.css";
import CheatWindow from "containers/windows/CheatWindow";

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
class Menu extends React.Component<AllProps & AppContextProps, LocalState> {

    constructor(props: AllProps & AppContextProps) {
        super(props);

        this.state = {
        };
    }

    public render() {

        const handleClickCheats = () => {
            const window = <CheatWindow title = "Cheats" />;
            this.props.onOpenWindow(window);
        };
        return (
            <div className="menu">
                <ul>
                    <li onClick = { handleClickCheats }>Cheats!</li>
                </ul>
            </div>
        );
    }

}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
