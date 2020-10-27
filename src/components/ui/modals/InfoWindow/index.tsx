import React, { ComponentProps, PropsWithChildren } from 'react';
import './styles/infoWindow.scss';

export interface Props {
    className?: string;
}

// An InfoWindow is a semi transparant black square. It is used for tooltips
// and InfoModal
export const InfoWindow = (props: PropsWithChildren<Props> & ComponentProps<"div">) => {
    const { className, children, ...otherProps } = props;
    return (
        <div
            {...otherProps}
            className={`info-window ${className || ""}`}
        >
            {children}
        </div>
    )
}
