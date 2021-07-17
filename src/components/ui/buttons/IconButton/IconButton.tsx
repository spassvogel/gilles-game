import Icon, { IconSize, IconSizeType } from "components/ui/common/Icon";
import * as React from "react";
import { PropsWithChildren } from 'react';
import './styles/iconButton.scss';

export type Props = PropsWithChildren<{
    iconImg: string;
    size?: IconSizeType; // Can use enum or string
}>


const IconButton = (props: React.ComponentProps<'button'> & Props) => {
    const { iconImg, children, ...otherProps } = props;

    const className = [
        'icon-button',
        (props.className ?? ""),
        `size-${typeof props.size === "string" ? props.size : IconSize[props.size ?? IconSize.medium]}`,
    ]

    return (
        <button
            {...otherProps}
            className={className.join(' ')}
        >
            <Icon
                image={iconImg}
                size={props.size}
            />
            { children && (
                <div className="text">
                    {children}
                </div>
            )}
        </button>
    );
};

export default IconButton;
