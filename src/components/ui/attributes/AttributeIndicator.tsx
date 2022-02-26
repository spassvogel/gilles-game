import { MAX_VALUE } from 'mechanics/adventurers/attributes';
import { useCallback } from 'react';
import './styles/attributeIndicator.scss';

interface Props {
  base: number;
  additional?: number;
}

const AttributeIndicator = (props: Props) => {
  const { base, additional = 0 } = props;

  const determineClass = useCallback((index: number) => {
    if (index == Math.round(base - 1)) {
      return 'base';
    }
    if (index > Math.round(base - 1) && index <= Math.round(base - 1) + Math.round(additional)) {
      return 'additional';
    }
    return '';
  }, [additional, base]);



  return (
    <div className="attribute-indicator" >
      {[...Array(MAX_VALUE)].map((_, i) => (
        <div key={i} className={`blip ${determineClass(i)}`}></div>
      ))}
    </div>
  );
};

export default AttributeIndicator;
