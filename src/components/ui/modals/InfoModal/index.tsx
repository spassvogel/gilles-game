import React, { PropsWithChildren } from 'react';
import { InfoWindow } from '../InfoWindow';
import './styles/infoModal.scss';

export interface Props {
    className?: string;
}

// An InfoModal is a semi transparant modal.
export const InfoModal = (props: PropsWithChildren<Props>) => {
    const { className, children } = props;
    return (
        <InfoWindow className={`info-modal ${className || ""}`}>
            {children}
        </InfoWindow>
    )
}