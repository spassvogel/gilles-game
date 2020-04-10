import Menu from "components/ui/window/windows/MenuWindow";
import * as React from "react";
import "./css/topbar.css";
import Resourcebar from './Resourcebar';
import { useContext } from 'react';
import { AppContext } from 'components/App';




const Topbar = () => {
    const context = useContext(AppContext)!;

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const window = <Menu title = "Menu" />;
        context.onOpenWindow(window);
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