export interface TextEntry {
    key: string;
    context?: any;
}

export function isTextEntry(test: any): test is TextEntry {
    return typeof test.key === 'string';
}