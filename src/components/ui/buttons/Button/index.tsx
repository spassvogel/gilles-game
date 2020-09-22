import * as React from "react";
import { PropsWithChildren } from 'react';
import './styles/button.scss';

export enum ButtonSize {
    auto, // will select either medium or small, depending on screen size
    large,
    medium,
    small,
}

export enum ButtonColor {
    blue = "blue",
    purple = "purple",
    green = "green"
}

export type Props = PropsWithChildren<{
    text?: string;
    color?: ButtonColor | "blue" | "purple" | "green"; // Can use enum or string
    size?: ButtonSize | "auto" | "large" | "medium" | "small"; // Can use enum or string
    className?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<Element>;
}>


const Button = (props: React.ComponentProps<'button'> & Props) => {
    const { color, size, ...otherProps } = props;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e)
    };

    const className = `button
        ${props.className || ""}
        button-${typeof color === "string" ? color : ButtonColor[color ?? ButtonColor.blue]}
        button-${typeof props.size === "string" ? props.size : ButtonSize[props.size ?? ButtonSize.auto]}
    `;
    return (
        <button
            {...otherProps}
            className={className}
            onClick={handleClick}
        >
            <span>
                {!!props.text && props.text}
                {!props.text && props.children}
            </span>
        </button>
    );
};

export default Button;
