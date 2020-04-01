import React, { useEffect, useState } from 'react';
import './toasts.css';
import Toast from './Toast';
import { ToastManager, ToastConfig } from './ToastManager';

// Toasts can be added by calling ToastManager.addToast
// ToastManager will inform whenever the something is added to the list of toasts via EVENT_TOASTS_UPDATED
// The toasts themselves will fade out via css transition
const Toasts = () => {

    const [activeToasts, setActiveToasts] = useState<ToastConfig[]>([]);

    const toastsUpdated = (stack: ToastConfig[]) => {
        setActiveToasts(stack);
    }

    useEffect(() => {
        ToastManager.addEventListener(ToastManager.EVENT_TOASTS_UPDATED, toastsUpdated);
        return () => {
            console.log('cleaning up')
            ToastManager.removeEventListener(ToastManager.EVENT_TOASTS_UPDATED, toastsUpdated);
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