import React from 'react';
import { TextManager } from 'utils/textManager';
import { ToastConfig } from './ToastManager';

type Props = ToastConfig;

export enum Type {
    achievementUnlocked,
    questCompleted,
    cheat
}

const Toast = (props: Props) => {
    const { 
        title,
        type = Type.achievementUnlocked,
        icon = "/img/items/quest-items/dragon-eye.png"
    } = props;

    const typeText = TextManager.get(`ui-toast-type-${Type[type]}`)
    return (
        <div className="toast">
            <div className="label type">{typeText}</div>
            <div className="label title">{title}</div>
            <div className="icon">
                <div className="background"></div>
                <img className="image" width="300" alt="dragon eye" src={`${process.env.PUBLIC_URL}${icon}`} />
                <div className="foreground"></div>
            </div>
            <div className="banner"></div>
        </div>
    );
}

export default Toast;