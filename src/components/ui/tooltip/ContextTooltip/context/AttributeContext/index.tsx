import { Fragment } from 'react';
import { TextManager } from 'global/TextManager';
import { ExtendedAttribute } from 'mechanics/adventurers/attributes';
import './styles/attributeContext.scss';
import { roundIfNeeded } from 'utils/format/number';

export interface Props {
  extendedAttribute: ExtendedAttribute;
}

const TraitContext = (props: Props) => {
  const { extendedAttribute } = props;

  return (
    <div className="attribute-context">
      <hr />
      <div className="mechanics">
        {TextManager.getAttributeMechanics(extendedAttribute.attribute)}
      </div>
      <dl className="values">
        {extendedAttribute.components.map(eAC => (
          <Fragment key={eAC.origin}>
            <dt>{eAC.origin}</dt>
            <dd className={eAC.origin === "base" ? "base" : "additional"}>{roundIfNeeded(eAC.value)}</dd>
          </Fragment>
        ))}
      </dl>
      <hr />
      <div className="description">
        {TextManager.getAttributeDescription(extendedAttribute.attribute)}
      </div>
    </div>
  )
}
export default TraitContext;
