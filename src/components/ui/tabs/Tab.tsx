import * as React from "react";

export interface Props {
    id: string;
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
    active?: boolean;
}


const Tab = (props: React.PropsWithChildren<Props>) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };
    const className = ((props.active) ? "active" : "") + (props.className || "");
    return (
        <li className={`tabstrip-tab ${className}`} onClick={handleClick}>
            {props.children}
        </li>
    );
};

export default Tab;
