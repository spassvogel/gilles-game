
export enum LogChannel {
    common,         // Only visible in 'all'
    town,           // Visible in 'all' and town
    quest,          // Visible in 'all' and the appropriate quest tab
}

export interface LogEntry {
    time: number;
    key: string;
    channel: LogChannel;
    context?: any;
}
