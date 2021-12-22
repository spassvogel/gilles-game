import { Fragment } from 'react';
import { TextManager } from 'global/TextManager';
import { AttributeSource, AttributeSourceType, ExtendedAttribute } from 'mechanics/adventurers/attributes';
import { roundIfNeeded } from 'utils/format/number';
import { Attribute } from 'store/types/adventurer';
import './styles/attributeContext.scss';

export interface Props {
  extendedAttribute: ExtendedAttribute;
}

const AttributeContext = (props: Props) => {
  const { extendedAttribute } = props;

  return (
    <div className="attribute-context">
      <hr />
      <div className="mechanics">
        {TextManager.getAttributeMechanics(extendedAttribute.attribute)}
      </div>
      <hr />
      <dl className="values">
        {extendedAttribute.components.map((eAC, i) => {
          const origin = renderOrigin(eAC.origin, extendedAttribute.attribute);
          return (
            <Fragment key={eAC.origin.type + i}>
              <dt title={origin}>{origin}</dt>
              <dd className={eAC.origin.type === AttributeSourceType.base ? "base" : "additional"}>{roundIfNeeded(eAC.value)}</dd>
            </Fragment>
          )
        })}
      </dl>
      <hr />
      <div className="description">
        {TextManager.getAttributeDescription(extendedAttribute.attribute)}
      </div>
    </div>
  )
}
export default AttributeContext;

const renderOrigin = (origin: AttributeSource, attribute: Attribute) => {
  switch (origin.type) {
    case AttributeSourceType.base:
      return `base ${TextManager.getAttributeName(attribute)}`;
    case AttributeSourceType.soma:
      return "soma";
    case AttributeSourceType.item:
      return TextManager.getItemName(origin.item);
  }
}
