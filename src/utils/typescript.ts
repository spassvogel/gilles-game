// Ensures type safety for typescript
export function hasOwnProperty<X, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.hasOwnProperty.call(obj, prop);
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][];

export type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K>: never;

export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}

