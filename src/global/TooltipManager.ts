import { ContextInfo, ContextType } from 'constants/context';
import deepEquals from 'deep-equal';
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
export interface Context {
    type: ContextType;
    info: ContextInfo;
    referenceRect: ClientRect;
    className?: string;
}

export const EVENT_CONTEXT_UPDATED = "tooltipContextUpdated";
interface TooltipEvents {
    [EVENT_CONTEXT_UPDATED]: (context: Context | undefined) => void;
}

export class TooltipManager extends (EventEmitter as new () => TypedEmitter<TooltipEvents>) {
    private static _instance = new TooltipManager();
    private static lastContext: Context | undefined;

    static showContextTooltip (type: ContextType, info: ContextInfo, originRect: ClientRect, className?: string) {
        const context = { type, info, referenceRect: originRect, className };

        if(deepEquals(context, this.lastContext)) {
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
