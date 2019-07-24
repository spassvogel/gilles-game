import * as React from "react";
import "./css/tabstrip.css";

export interface Props {
    id: string;
    label: string; /* temp */
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
    active?: boolean;
}

type AllProps = Props;

const Tab = (props: AllProps) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };
    const className = ((props.active) ? "active" : "") + (props.className || "");
    return <div className = { `widget-tab ${className}` } onClick = { handleClick } >
        { props.label }
    </div>;
};

export default Tab;
