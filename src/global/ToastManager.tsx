import { now } from 'moment';
import { Type } from '../components/ui/toasts/Toast';
import EventEmitter from './EventEmitter';

export interface ToastConfig {
    time: number;
    title: string;
    type?: Type;
    icon?: string;
}

export abstract class ToastManager extends EventEmitter<ToastConfig[]>() {
    
    private static stack: ToastConfig[] = [];
    private static lifeTime = 5000; // Time each toast lives

    static EVENT_TOASTS_UPDATED = "toast";

    static addToast(title: string, type?: Type, icon?: string) {

        this.stack = [...this.stack, {
            time: now(),
            title,
            type,
            icon
        }];

        this.emit(this.EVENT_TOASTS_UPDATED, this.stack);

        setTimeout(() => {
            // Remove all popups that have expired
            this.stack = this.stack.filter((toast) => {
                return now() - toast.time < this.lifeTime
            });
            this.emit(this.EVENT_TOASTS_UPDATED, this.stack);

        }, this.lifeTime);
    }
}