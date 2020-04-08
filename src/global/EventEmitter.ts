function EventEmitter<TEventType>() {
    abstract class EventEmitter {
        static events = {};
        
        static addEventListener (eventName: string, listener: (event: TEventType) => void) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(listener);
        }

        static removeEventListener (eventName: string, listener: (event: TEventType) => void) {
            if (this.events[eventName]) {
                for (var i = 0; i < this.events[eventName].length; i++) {
                    if (this.events[eventName][i] === listener) {
                        this.events[eventName].splice(i, 1);
                        break;
                    }
                };
            }
        }

        protected static emit (eventName: string, event: TEventType) {
            if (this.events[eventName]) {
                this.events[eventName].forEach((fn: (event: TEventType) => any) => fn(event));
            }
        }
    }
    return EventEmitter;
}

export default EventEmitter;