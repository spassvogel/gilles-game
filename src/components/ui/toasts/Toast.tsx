import React from 'react';
import { TextManager } from 'global/TextManager';
import { ToastConfig } from 'global/ToastManager';

type Props = ToastConfig;

export enum Type {
    questLaunched,
    questEncounter,
    questCompleted,
    achievementUnlocked,
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
            <div className="label title app-h2-white">{title}</div>
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