// Ensures type safety for typescript
export function hasOwnProperty<X extends unknown, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.hasOwnProperty.call(obj, prop);
}
