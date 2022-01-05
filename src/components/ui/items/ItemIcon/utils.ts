import { IconSize } from 'components/ui/common/Icon';
import { Rarity } from 'constants/items';

export const getIconClassName = (rarity?: Rarity): string => {
  switch (rarity) {
    case Rarity.common:
      return 'item-icon-common';
    case Rarity.uncommon:
      return 'item-icon-uncommon';
    case Rarity.rare:
      return 'item-icon-rare';
    case Rarity.epic:
      return 'item-icon-epic';
    case Rarity.legendary:
      return 'item-icon-legendary';
  }
  return getIconClassName(Rarity.common);
};

export const sizeClassName = (size?: IconSize): string => {
  switch (size) {
    case IconSize.smallest:
      return 'item-icon-size-smallest';
    case IconSize.small:
      return 'item-icon-size-small';
    case IconSize.medium:
      return 'item-icon-size-medium';
    case IconSize.big:
      return 'item-icon-size-big';
    case IconSize.biggest:
      return 'item-icon-size-biggest';
  }
  return sizeClassName(IconSize.medium);
};
