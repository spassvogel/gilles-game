import { Attribute, attributeList } from "store/types/adventurer";
import { TextManager } from "global/TextManager";
import { TooltipManager } from "global/TooltipManager";
import { ContextType } from "constants/context";
import { AttributesExtended, AttributeSourceType, ExtendedAttribute } from "mechanics/adventurers/attributes";
import { roundIfNeeded } from "utils/format/number";
import "./styles/attributes.scss"

interface Props {
  attributes: AttributesExtended;
  small?: boolean
}

const Attributes = (props: Props) => {
  const { attributes, small } = props;

  const renderRow = (attribute: Attribute) => {
    const extendedAttribute: ExtendedAttribute = {
      attribute,
      components: attributes[attribute]
     };
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.attribute, extendedAttribute, originRect);
      event.stopPropagation();
    }

    // Split out base and additional attribute components
    const { base, additional } = extendedAttribute.components.reduce((acc, value) => {
      if (value.origin.type === AttributeSourceType.base) {
        acc.base += value.value;
      } else {
        acc.additional += value.value;
      }
      return acc;
    }, { base: 0, additional: 0});

    return (
      <li key={attribute}>
        <div className="attribute-name">
          <span onClick={handleClick}>
            {small ? attribute : TextManager.getAttributeName(attribute)}
          </span>
        </div>
        <div className="attribute-value">
          {roundIfNeeded(base)}
          { additional > 0 && ( <span className="additional"> +{ roundIfNeeded(additional)}</span>)}
        </div>
      </li>
    );
  }

  return (
    <div className="basic-attributes">
      {/* todo: use css grid */}
      <ul className="attribute-list">
        {attributeList.map(a => renderRow(a))}
      </ul>
    </div>
  )
}
export default Attributes;
