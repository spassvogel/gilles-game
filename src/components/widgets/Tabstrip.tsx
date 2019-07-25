import React, { useState } from "react";
import "./css/tabstrip.css";
import { Props as TabProps } from "./Tab";

export interface Props {
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
    onTabSelected?: (tabId: string) => void;
    children?: any;
}

type AllProps = Props;
const Tabstrip = (props: AllProps) => {
    let initialSelectedTab = null;
    if (props.children && props.children.length) {
        initialSelectedTab = props.children[0].props.id;
    }
    const [activeTab, setActiveTab] = useState<string|null>(initialSelectedTab);
    const className = props.className || "";

    const children = React.Children.map(props.children, (child: React.ReactElement<TabProps>) => {
        const clone: React.ReactElement<TabProps> = React.cloneElement(child, {
            active: child.props.id === activeTab,
            onClick: () => { handleTabClick(child.props.id); },
        });
        return clone;
    });

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        if (props.onTabSelected) {
            props.onTabSelected(tabId);
        }
    };

    const handleClick = (e: React.MouseEvent<Element>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return <ul className = { `widget-tabstrip ${className}` } onClick = { handleClick } >
        { children }
    </ul>;
};

export default Tabstrip;
