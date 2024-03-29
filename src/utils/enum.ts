export const randomEnum = <T extends ArrayLike<unknown>>(anEnum: T): T[keyof T] => {
  const enumValues = (Object.values(anEnum) as unknown) as Array<T[keyof T]>
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  return enumValues[randomIndex]
}
