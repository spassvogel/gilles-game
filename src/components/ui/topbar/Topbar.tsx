import Menu from "components/ui/window/windows/MenuWindow";
import * as React from "react";
import Resourcebar from './Resourcebar';
import { useContext } from 'react';
import { AppContext } from 'components/App';
import { Persistor } from 'redux-persist';
import "./styles/topbar.scss";

interface Props {
    persistor: Persistor;
}

const Topbar = (props: Props) => {
    const context = useContext(AppContext);

    const handleClick = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const window = <Menu title = "Menu" persistor={props.persistor} />;
        context?.onOpenWindow(window);
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
export default Topbar;