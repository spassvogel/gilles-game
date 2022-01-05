import { FIVE_SECONDS } from 'utils/format/time';
import { Type } from 'components/ui/toasts/Toast';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { SoundManager } from './SoundManager';

export interface ToastConfig {
  time: number;
  title: string;
  type?: Type;
  icon?: string;
  link?: string;
}

export const EVENT_TOASTS_UPDATED = 'toast';
interface ToastEvents {
  [EVENT_TOASTS_UPDATED]: (context: ToastConfig[] | undefined) => void;
}
export class ToastManager extends (EventEmitter as new () => TypedEmitter<ToastEvents>) {
  private static _instance = new ToastManager();

  private static stack: ToastConfig[] = [];

  private static lifeTime = FIVE_SECONDS; // Time each toast lives
  // also update CSS animation!

  static addToast(title: string, type?: Type, icon?: string, link?: string) {

    this.stack = [...this.stack, {
      time: Date.now(),
      title,
      type,
      icon,
      link,
    }];

    this.instance.emit(EVENT_TOASTS_UPDATED, this.stack);

    SoundManager.playSound('ui/toast');

    setTimeout(() => {
      // Remove all popups that have expired
      this.stack = this.stack.filter((toast) => {
        return Date.now() - toast.time < this.lifeTime;
      });
      this.instance.emit(EVENT_TOASTS_UPDATED, this.stack);

    }, this.lifeTime);
  }

  static get instance() {
    return this._instance;
  }
}
