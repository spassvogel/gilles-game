import { TextManager } from 'global/TextManager';
import { Attribute } from "store/types/adventurer";
import './styles/attributeContext.scss';

export interface Props {
  attribute: Attribute;
}

const TraitContext = (props: Props) => {

  const { attribute } = props;

  return (
    <div className="attribute-context">
      <div className="description">
        {TextManager.getAttributeDescription(attribute)}
      </div>
      <div className="mechanics">
        {TextManager.getAttributeMechanics(attribute)}
      </div>
    </div>
  )
}
export default TraitContext;
