import * as React from "react";
import "./css/tabstrip.css";

export interface Props {
    id: string;
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
    active?: boolean;
    children?: any;
}

type AllProps = Props;

const Tab = (props: AllProps) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };
    const className = ((props.active) ? "active" : "") + (props.className || "");
    return <li className = { `widget-tab ${className}` } onClick = { handleClick } >
        { props.children }
    </li>;
};

export default Tab;
