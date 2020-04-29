import React, { useState } from "react";
import "./css/tabstrip.css";
import { Props as TabProps } from "./Tab";

export interface Props {
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
    onTabSelected?: (tabId: string) => void;
    children?: any;
    activeTab?: string;
}

type AllProps = Props;
const Tabstrip = (props: AllProps) => {
    let {activeTab = null} = props;
    if (!activeTab && props.children && props.children.length) {
        activeTab = props.children[0].props.id;
    }
    const className = props.className || "";

    const children = React.Children.map(props.children, (child: React.ReactElement<TabProps>) => {
        const clone: React.ReactElement<TabProps> = React.cloneElement(child, {
            active: child.props.id === activeTab,
            onClick: () => { handleTabClick(child.props.id); },
        });
        return clone;
    });

    const handleTabClick = (tabId: string) => {
        if (props.onTabSelected) {
            props.onTabSelected(tabId);
        }
    };

    const handleClick = (e: React.MouseEvent<Element>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <ul className = {`tabstrip ${className}`} onClick={handleClick}>
            {children}
        </ul>
    );
};

export default Tabstrip;
