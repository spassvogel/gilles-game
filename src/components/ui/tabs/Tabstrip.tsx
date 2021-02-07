import React from "react";
import { Props as TabProps } from "./Tab";
import { SoundManager} from 'global/SoundManager';
import "./styles/tabstrip.scss";

export interface Props {
    className?: string;
    children: React.ReactElement<TabProps>[] |  React.ReactElement<TabProps>;
    activeTab?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<Element>;
    onTabSelected?: (tabId: string) => void;
}

const Tabstrip = (props: Props) => {
    let {activeTab = null} = props;
    if (!activeTab && props.children && props.children) {
        //activeTab = props.children[0].props.id;
    }
    const className = `${props.className}${(props.disabled ? " disabled" : "")}`;
    const children = React.Children.map(props.children, (child: React.ReactElement<TabProps>) => {
        const clone: React.ReactElement<TabProps> = React.cloneElement(child, {
            active: child.props.id === activeTab,
            onClick: () => { handleTabClick(child.props.id); }
        });
        return clone;
    });

    const handleTabClick = (tabId: string) => {
        if (props.onTabSelected && props.disabled !== true) {
            props.onTabSelected(tabId);
        }
    };

    const handleClick = (e: React.MouseEvent<Element>) => {
        SoundManager.playSound("ui/buttonClick");
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <ul className={`tabstrip ${className ?? ""}`} onClick={handleClick}>
            {children}
        </ul>
    );
};

export default Tabstrip;
