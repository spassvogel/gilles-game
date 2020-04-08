import { now } from 'moment';
import { Type } from '../components/ui/toasts/Toast';

export interface ToastConfig {
    time: number;
    title: string;
    type?: Type;
    icon?: string;
}

export abstract class ToastManager {
    
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

    static events = {};
    
    static addEventListener (event: string, listener: (stack: ToastConfig[]) => void) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(listener);
    }

    static removeEventListener (event: string, listener: (stack: ToastConfig[]) => void) {
        if (this.events[event]) {
            for (var i = 0; i < this.events[event].length; i++) {
                if (this.events[event][i] === listener) {
                    this.events[event].splice(i, 1);
                    break;
                }
            };
        }
    }

    private static emit (event: string, stack: ToastConfig[]) {
        if (this.events[event]) {
            this.events[event].forEach((fn: (stack: ToastConfig[]) => any) => fn(stack));
        }
    }
}