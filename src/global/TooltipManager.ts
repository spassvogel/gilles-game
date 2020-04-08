import { ContextInfo, ContextType } from 'constants/context';
import EventEmitter from './EventEmitter';

export interface Context {
    type: ContextType;
    info: ContextInfo;
    referenceRect: ClientRect;
}

export abstract class TooltipManager extends EventEmitter<Context>() {

    static EVENT_CONTEXT_UPDATED = "tooltipContextUpdated";

    static showContextTooltip (type: ContextType, info: ContextInfo, originRect: ClientRect) {
        this.emit(this.EVENT_CONTEXT_UPDATED, { type, info, referenceRect: originRect});       
    }
    
    static clear() {
        this.emit(this.EVENT_CONTEXT_UPDATED, undefined);       
    }
}