import { ComponentProps, useState } from 'react';
import { AccordionContext } from './context/AccordionContext';
import './styles/accordion.scss';

type Props = ComponentProps<'div'>;

const Accordion = (props: Props) => {
  const { children, className } = props;
  const [itemsExpanded, setItemsExpanded] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (itemsExpanded.indexOf(id) > -1) {
      setItemsExpanded(itemsExpanded.filter(i => i !== id));
    } else {
      setItemsExpanded([...itemsExpanded, id]);
    }
  };
  return (
    <AccordionContext.Provider value={{
      itemsExpanded,
      toggleItem,
    }} >
    <div className={`accordion ${className ?? ''}`}>
      {children}
    </div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
