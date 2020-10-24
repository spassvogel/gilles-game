
import * as React from "react";
import { PropsWithChildren } from 'react';
import "./styles/icon.scss";

export interface Props {
    image: string;
    size?: IconSize | "smallest" | "small" | "medium";
    className?: string
}

export enum IconSize {
    smallest = "smallest",
    small = "small",
    medium = "medium",
    big = "big",
    biggest = "biggest"
}

const Icon = (props: PropsWithChildren<Props> & React.ComponentProps<"div">) => {
    const {
        image,
        size,
        children,
        className = ""
    } = props;

    return (
        <div
            className={`icon ${getClassName((typeof size === "string") ? IconSize[size] : size)} ${className}`}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}${image})`,
            }}
        >
            {children}
        </div>
    );
};

export default Icon;


const getClassName = (size?: IconSize): string => {
    switch (size) {
        case IconSize.smallest:
            return "common-icon-smallest";
        case IconSize.small:
            return "common-icon-small";
        case IconSize.medium:
            return "common-icon-medium";
        case IconSize.big:
            return "common-icon-big";
        case IconSize.biggest:
            return "common-icon-biggest";
    }
    return getClassName(IconSize.medium);
};
