// Ensures type safety for typescript
export function hasOwnProperty<X, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.hasOwnProperty.call(obj, prop);
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][];


// Type safe entries ([key, value] pair)
export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}


// Returns a list of enum values
export const listEnum = <T extends { [key: string]: number | string }>(enumeration: T) => {
  return Object.keys(enumeration).filter(v => !isNaN(Number(v))).map(v => Number(v));
};

