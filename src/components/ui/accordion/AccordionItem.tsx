import { ComponentProps, CSSProperties, useContext, useLayoutEffect, useRef, useState } from 'react';
import { AccordionContext } from './context/AccordionContext';

type Props = { id: string } & ComponentProps<'div'>;


const AccordionItem = (props: Props) => {
  const { title = '', className, id, children, ...rest } = props;
  const context = useContext(AccordionContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState(0);
  const isExpanded = context?.itemsExpanded.indexOf(id) !== -1;

  const classNames = [
    'accordion-item',
    className ?? '',
    ...(isExpanded ? ['expanded'] : []),
  ];

  useLayoutEffect(() => {
    if (contentRef.current) {
      setClientHeight(contentRef.current?.clientHeight);
    }
  }, [isExpanded]);

  // when clientHeight is 0, it means it's collapsed. Set max-height to 1200
  const style = { '--content-height': clientHeight || 1200 } as CSSProperties;
  return (
    <div className={classNames.join(' ')} style={style}>
      <header className={`header ${className ?? ''}`} { ...rest } onClick={() => context?.toggleItem(id)}>
        {title}
      </header>
      <div className="content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;



