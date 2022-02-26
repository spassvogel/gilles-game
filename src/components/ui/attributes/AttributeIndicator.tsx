import { MAX_VALUE } from 'mechanics/adventurers/attributes';
import './styles/attributeIndicator.scss';

interface Props {
  value: number;
}

const AttributeIndicator = (props: Props) => {
  const { value } = props;
  return (
    <div className="attribute-indicator">
      {[...Array(MAX_VALUE)].map((_, i) => (
        <div key={i} className={`blip ${i == Math.round(value - 1) ? 'active' : ''}`}></div>
      ))}
    </div>
  );
};

export default AttributeIndicator;
