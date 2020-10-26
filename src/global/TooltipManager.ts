import { ContextInfo, ContextType } from 'constants/context';
import deepEquals from 'deep-equal';
import EventEmitter from './EventEmitter';

export interface Context {
    type: ContextType;
    info: ContextInfo;
    referenceRect: ClientRect;
    className?: string;
}

export abstract class TooltipManager extends EventEmitter<Context>() {

    static EVENT_CONTEXT_UPDATED = "tooltipContextUpdated";
    private static lastContext: Context | undefined;

    static showContextTooltip (type: ContextType, info: ContextInfo, originRect: ClientRect, className?: string) {
        const context = { type, info, referenceRect: originRect, className };

        if(deepEquals(context, this.lastContext)) {
            this.clear();
        } else {
            this.emit(this.EVENT_CONTEXT_UPDATED, context);
            this.lastContext = context;
        }
    }

    static clear() {
        this.emit(this.EVENT_CONTEXT_UPDATED, undefined);
        this.lastContext = undefined;
    }
}