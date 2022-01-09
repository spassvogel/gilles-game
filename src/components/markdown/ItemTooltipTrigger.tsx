import { ReactNode, useMemo } from 'react';
import { ContextType } from 'constants/context';
import { TextManager } from 'global/TextManager';
import { TooltipManager } from 'global/TooltipManager';
import { ElementContent } from 'react-markdown/lib/ast-to-react';

type Props = {
  children: ReactNode[]
};

const ItemTooltipTrigger = (props: Props) => {
  const { children } = props;

  const item = useMemo(() => {
    if (typeof children[0] === 'string') {
      return JSON.parse(children[0]);
    }
  }, [children]);

  const handleClick = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement);
    const originRect = origin.getBoundingClientRect();

    TooltipManager.showContextTooltip(ContextType.item, item, originRect);
    event.stopPropagation();
  };

  return (
    <>
      [
      <span className="trigger" onClick={handleClick}>
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
