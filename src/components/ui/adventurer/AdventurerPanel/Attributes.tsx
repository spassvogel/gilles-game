import { Attribute, attributeList } from 'store/types/adventurer';
import { TextManager } from 'global/TextManager';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import { AttributesExtended, AttributeSourceType, ExtendedAttribute, MAX_VALUE } from 'mechanics/adventurers/attributes';
import { roundIfNeeded } from 'utils/format/number';
import AttributeIndicator from 'components/ui/attributes/AttributeIndicator';
import { CSSProperties, Fragment } from 'react';
import { entries } from 'utils/typescript';
import './styles/attributes.scss';

type Props = {
  attributes: AttributesExtended;
  small?: boolean;
};

const style = { '--item-count': MAX_VALUE } as CSSProperties;
const Attributes = (props: Props) => {
  const { attributes, small } = props;

  const renderRow = (attribute: Attribute) => {
    const extendedAttribute: ExtendedAttribute = {
      attribute,
      components: attributes[attribute],
    };
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.attribute, extendedAttribute, originRect);
      event.stopPropagation();
    };

    // Split out base and additional attribute components
    const { base, additional } = extendedAttribute.components.reduce((acc, value) => {
      if (value.origin.type === AttributeSourceType.base) {
        acc.base += value.value;
      } else {
        acc.additional += value.value;
      }
      return acc;
    }, { base: 0, additional: 0 });

    return (
      <Fragment key={attribute}>
        <div className="attribute-name">
          <span onClick={handleClick}>
            {small ? attribute : TextManager.getAttributeName(attribute)}
          </span>
        </div>
        <AttributeIndicator base={base} additional={additional} />
        <div className="attribute-base">
          {roundIfNeeded(base)}
        </div>
        { additional > 0 && (
          <div className="attribute-additional">
           +{roundIfNeeded(additional)}
          </div>
        )}
      </Fragment>
    );
  };

  const hasAdditional = entries(attributes).some(([_attr, comp]) => comp.some(c => c.origin.type !== AttributeSourceType.base));

  return (
    <div className="basic-attributes">
      <div className={`attribute-list ${hasAdditional ? 'has-additional' : ''}`} style={style}>
        {attributeList.map(a => renderRow(a))}
      </div>
    </div>
  );
};
export default Attributes;
