/**
 * Deep clone any object
 * @param obj Any type of object you want to deep clone.
 * @returns Deep clone of obj (same type as obj)
 */
export const deepCloneObject = <T>(obj: T): T => {
  // Use structuredClone() if available
  if (typeof structuredClone === 'function') {
    return structuredClone<T>(obj)
  }
  // Compatible for older browsers
  return JSON.parse(JSON.stringify(obj))
}
