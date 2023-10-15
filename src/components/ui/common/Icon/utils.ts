export enum IconSize {
  smallest = 'smallest',
  small = 'small',
  medium = 'medium',
  big = 'big',
  biggest = 'biggest',
}

export type IconSizeType = IconSize | keyof typeof IconSize

export enum Border {
  none = 'none',
  gold = 'gold',
}

export const sizeClassName = (size?: IconSize): string => {
  switch (size) {
    case IconSize.smallest:
      return 'size-smallest'
    case IconSize.small:
      return 'size-small'
    case IconSize.medium:
      return 'size-medium'
    case IconSize.big:
      return 'size-big'
    case IconSize.biggest:
      return 'size-biggest'
  }
  return sizeClassName(IconSize.medium)
}

export const borderClassName = (border?: Border): string => {
  switch (border) {
    case Border.gold:
      return 'border-gold'
    case Border.none:
    default:
      return ''
  }
}
