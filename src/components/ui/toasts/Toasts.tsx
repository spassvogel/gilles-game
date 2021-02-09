import React, { useEffect, useState } from 'react';
import { ToastManager, ToastConfig, EVENT_TOASTS_UPDATED } from 'global/ToastManager';
import Toast from './Toast';
import './styles/toasts.scss';

// Toasts can be added by calling ToastManager.addToast
// ToastManager will inform whenever the something is added to the list of toasts via EVENT_TOASTS_UPDATED
// The toasts themselves will fade out via css transition
const Toasts = () => {

    const [activeToasts, setActiveToasts] = useState<ToastConfig[]>([]);

    const toastsUpdated = (stack?: ToastConfig[]) => {
        if (stack) setActiveToasts(stack);
    }

    useEffect(() => {
        ToastManager.instance.addListener(EVENT_TOASTS_UPDATED, toastsUpdated);
        return () => {
            ToastManager.instance.removeListener(EVENT_TOASTS_UPDATED, toastsUpdated);
        }
    }, []);

    return (
        <div className="toasts" > 
            { activeToasts.map((toastConfig) => (
                <Toast key={toastConfig.time} {...toastConfig}/>
            ))}
        </div>
    )
}

export default Toasts;