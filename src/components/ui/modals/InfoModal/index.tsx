import React, { PropsWithChildren } from 'react';
import './styles/infoModal.scss';


export interface Props {
    className?: string;
}


// An InfoModal is a semi transparant modal. It is used for tooltips
// but can be used stand-alone
export const InfoModal = (props: PropsWithChildren<Props>) => {
    const { className, children } = props;
    return (
        <div className={`info-modal ${className}`}>
            {children}
        </div>
    )
}