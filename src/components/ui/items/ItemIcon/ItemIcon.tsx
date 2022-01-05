import { ContextType } from 'constants/context';
import { ItemSource } from 'constants/items';
import { getDefinition } from 'definitions/items';
import { Item } from 'definitions/items/types';
import { TooltipManager } from 'global/TooltipManager';
import Icon, { IconSize } from 'components/ui/common/Icon';
import { getIconClassName, sizeClassName } from './utils';
import './styles/itemIcon.scss';

export interface Props {
  item: Item;
  onClick?: (event: React.MouseEvent) => void;
  size?: IconSize;
  showContext?: boolean;
  source?: ItemSource;
}

const ItemIcon = (props: Props) => {
  const { item, size, source } = props;
  const itemDefinition = getDefinition(item.type);

  if (!itemDefinition) {
    throw new Error(`could not find definition for ${item}`);
  }

  const handleClick = (event: React.MouseEvent) => {
    if (props.showContext !== false) {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();
      TooltipManager.showContextTooltip(ContextType.item, item, originRect, undefined, source);
      event.stopPropagation();
    }

    if (props.onClick) {
      props.onClick(event);
    }
  };

  const className = `item-icon ${getIconClassName(itemDefinition.rarity)} ${sizeClassName(size)}`;

  return (
    <div className={className}>
      <Icon
        image={itemDefinition.iconImg}
        size={props.size}
        onClick={handleClick}
      />
      {item.quantity && item.quantity > 1 && (
        <div className="quantity">{item.quantity}</div>
      )}
    </div>
  );
};

export default ItemIcon;
