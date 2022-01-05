export interface TextEntry {
  key: string;
  context?: unknown;
}

export function isTextEntry(test: string | TextEntry): test is TextEntry {
  return typeof test !== 'string';
}
