import { Type } from '../components/ui/toasts/Toast';
import EventEmitter from './EventEmitter';
import { SoundManager, Sound } from './SoundManager';

export interface ToastConfig {
    time: number;
    title: string;
    type?: Type;
    icon?: string;
    link?: string;
}

export abstract class ToastManager extends EventEmitter<ToastConfig[]>() {

    private static stack: ToastConfig[] = [];
    private static lifeTime = 5000; // Time each toast lives

    static EVENT_TOASTS_UPDATED = "toast";

    static addToast(title: string, type?: Type, icon?: string, link?: string) {

        this.stack = [...this.stack, {
            time: Date.now(),
            title,
            type,
            icon,
            link
        }];

        this.emit(this.EVENT_TOASTS_UPDATED, this.stack);

        SoundManager.playSound(Sound.toast);

        setTimeout(() => {
            // Remove all popups that have expired
            this.stack = this.stack.filter((toast) => {
                return Date.now() - toast.time < this.lifeTime
            });
            this.emit(this.EVENT_TOASTS_UPDATED, this.stack);

        }, this.lifeTime);
    }
}