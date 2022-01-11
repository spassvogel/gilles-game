import { ReactNode, useMemo } from 'react';
import { ContextType } from 'constants/context';
import { TextManager } from 'global/TextManager';
import { TooltipManager } from 'global/TooltipManager';
import { ElementContent } from 'react-markdown/lib/ast-to-react';
import { getDefinition } from 'definitions/items';
import { Rarity } from 'constants/items';

type Props = {
  children: ReactNode[]
};

const getRarityClassName = (rarity?: Rarity): string => {
  switch (rarity) {
    case Rarity.common:
      return 'item-trigger-common';
    case Rarity.uncommon:
      return 'item-trigger-uncommon';
    case Rarity.rare:
      return 'item-trigger-rare';
    case Rarity.epic:
      return 'item-trigger-epic';
    case Rarity.legendary:
      return 'item-trigger-legendary';
  }
  return '';
};

// To be used inside Markdown component
const ItemTooltipTrigger = (props: Props) => {
  const { children } = props;

  const item = useMemo(() => {
    if (typeof children[0] === 'string') {
      return JSON.parse(children[0]);
    }
  }, [children]);

  const definition = useMemo(() => {
    if (!item) return;
    return getDefinition(item.type);
  }, [item]);

  const handleClick = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement);
    const originRect = origin.getBoundingClientRect();

    TooltipManager.showContextTooltip(ContextType.item, item, originRect);
    event.stopPropagation();
  };

  return (
    <>
      [
      <span className={`trigger ${getRarityClassName(definition?.rarity)}`} onClick={handleClick}>
        {TextManager.getItemName(item)}
      </span>
      ]
    </>
  );
};

export default ItemTooltipTrigger;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ItemTooltipTrigger': ElementContent[]
    }
  }
}
