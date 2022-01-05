import { ContextInfo, ContextType } from 'constants/context';
import { ItemSource } from 'constants/items';
import deepEquals from 'deep-equal';
import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';

export interface Context {
  type: ContextType;
  info: ContextInfo;
  source?: ItemSource;
  referenceRect: DOMRect;
  className?: string;
}

export const EVENT_CONTEXT_UPDATED = 'tooltipContextUpdated';
interface TooltipEvents {
  [EVENT_CONTEXT_UPDATED]: (context: Context | undefined) => void;
}

export class TooltipManager extends (EventEmitter as new () => TypedEmitter<TooltipEvents>) {
  private static _instance = new TooltipManager();

  private static lastContext: Context | undefined;

  // Note you probably want to call event.stopPropagation() after calling this
  static showContextTooltip(type: ContextType, info: ContextInfo, originRect: DOMRect, className?: string, source?: ItemSource) {
    const context = { type, info, referenceRect: originRect, className, source };

    if (deepEquals(context, this.lastContext)) {
      this.clear();
    } else {
      this.instance.emit(EVENT_CONTEXT_UPDATED, context);
      this.lastContext = context;
    }
  }

  static clear() {
    this.instance.emit(EVENT_CONTEXT_UPDATED, undefined);
    this.lastContext = undefined;
  }

  static get instance() {
    return this._instance;
  }
}
