import { Attribute } from "store/types/adventurer";
import { TextManager } from "global/TextManager";
import { TooltipManager } from "global/TooltipManager";
import { ContextType } from "constants/context";
import { AttributesExtended } from "mechanics/adventurers/attributes";
import "./styles/attributes.scss"

interface Props {
  attributes: AttributesExtended;
  small?: boolean
}

const Attributes = (props: Props) => {
  const { attributes, small } = props;

  const renderRow = (attribute: Attribute) => {
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.attribute, attribute, originRect);
      event.stopPropagation();
    }

    // Split out base and additional attribute components
    const { base, additional } = attributes[attribute].reduce((acc, value) => {
      if (value.origin === "base") {
        acc.base += value.value;
      } else {
        acc.additional += value.value;
      }
      return acc;
    }, { base: 0, additional: 0})
    return (
      <li >
        <div className="attribute-name">
          <span onClick={handleClick}>
            {small ? attribute : TextManager.getAttributeName(attribute)}
          </span>
        </div>
        <div className="attribute-value">
          {base} 
          { additional > 0 && ( <span className="additional"> +{additional.toFixed(1)}</span>)}          
        </div>
      </li>
    );
  }

  return (
    <div className="basic-attributes">
      {/* todo: use css grid */}
      <ul className="attribute-list">
        {renderRow("str")}
        {renderRow("for")}
        {renderRow("int")}
        {renderRow("agi")}
      </ul>
    </div>
  )
}
export default Attributes;
