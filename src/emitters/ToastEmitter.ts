import { FIVE_SECONDS } from 'utils/format/time'
import { type Type } from 'components/ui/toasts/Toast'
import EventEmitter from 'events'
import type TypedEmitter from 'typed-emitter'
import { SoundManager } from '../global/SoundManager'

export type ToastConfig = {
  time: number
  title: string
  type?: Type
  icon?: string
  link?: string
}

export const EVENT_TOASTS_UPDATED = 'toast'
type ToastEvents = {
  [EVENT_TOASTS_UPDATED]: (context: ToastConfig[] | undefined) => void
}

export class ToastEmitter extends (EventEmitter as unknown as new () => TypedEmitter<ToastEvents>) {
  private static readonly _instance = new ToastEmitter()

  private static stack: ToastConfig[] = []

  private static readonly lifeTime = FIVE_SECONDS // Time each toast lives
  // also update CSS animation!

  static addToast (title: string, type?: Type, icon?: string, link?: string) {
    this.stack = [...this.stack, {
      time: Date.now(),
      title,
      type,
      icon,
      link
    }]

    this.instance.emit(EVENT_TOASTS_UPDATED, this.stack)

    void SoundManager.playSound('UI_TOAST')

    setTimeout(() => {
      // Remove all popups that have expired
      this.stack = this.stack.filter((toast) => {
        return Date.now() - toast.time < this.lifeTime
      })
      this.instance.emit(EVENT_TOASTS_UPDATED, this.stack)
    }, this.lifeTime)
  }

  static get instance () {
    return this._instance
  }
}
