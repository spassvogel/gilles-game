// This is the format AStarFind works with
export const convertIn = (l: [number, number]) => ({ x: l[0], y: l[1] });
export const convertOut = (input: number[]): [number, number] => [input[0], input[1]];
