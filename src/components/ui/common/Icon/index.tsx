import * as React from "react";
import { PropsWithChildren } from 'react';
import "./styles/icon.scss";

export interface Props {
    image: string;
    size?: IconSizeType;
    className?: string;
    border?: Border | keyof typeof Border;
}

export enum IconSize {
    smallest = "smallest",
    small = "small",
    medium = "medium",
    big = "big",
    biggest = "biggest"
}

export type IconSizeType = IconSize | keyof typeof IconSize;

export enum Border {
    none = "none",
    gold = "gold"
}

const Icon = (props: PropsWithChildren<Props> & React.ComponentProps<"div">) => {
    const {
        image,
        size,
        children,
        className = "",
        border = "none",
        ...restProps
    } = props;
    return (
        <div
            className={`icon ${sizeClassName((typeof size === "string") ? IconSize[size] : size)} ${className}`}
            {...restProps}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}${image})`,
            }}
        >
            {children}
            { border !== "none" && border && (
                <div className={`border ${borderClassName((typeof border === "string") ? Border[border] : border)} `}/>
            )}
        </div>
    );
};

export default Icon;


const sizeClassName = (size?: IconSize): string => {
    switch (size) {
        case IconSize.smallest:
            return "size-smallest";
        case IconSize.small:
            return "size-small";
        case IconSize.medium:
            return "size-medium";
        case IconSize.big:
            return "size-big";
        case IconSize.biggest:
            return "size-biggest";
    }
    return sizeClassName(IconSize.medium);
};

const borderClassName = (border?: Border): string => {
    switch (border) {
        case Border.gold:
            return "border-gold";
        case Border.none:
        default:
            return "";
    }
}