import * as React from "react";
import "./css/squareiconbutton.css";

export interface Props {
    text: string; /* temp */
    className?: string;
    onClick?: React.MouseEventHandler<Element>;
}

const SquareIconButton = (props: Props) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.onClick) {
            props.onClick(e);
        }
    };
    const className = props.className || "";
    return (
        <div
            className={`ui-button widgets-squareiconbutton ${className}`}
            onClick={handleClick}
        >
            {props.text}
        </div>
    );
};

export default SquareIconButton;
