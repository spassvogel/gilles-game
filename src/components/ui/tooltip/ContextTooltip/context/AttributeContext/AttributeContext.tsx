import { Fragment } from 'react'
import * as TextManager from 'global/TextManager'
import { AttributeSourceType, type ExtendedAttribute } from 'mechanics/adventurers/attributes'
import { roundIfNeeded } from 'utils/format/number'
import { renderOrigin } from './utils'
import './styles/attributeContext.scss'

export type Props = {
  extendedAttribute: ExtendedAttribute
}

const AttributeContext = (props: Props) => {
  const { extendedAttribute } = props
  return (
    <div className="attribute-context">
      <hr />
      <div className="mechanics">
        {TextManager.getAttributeMechanics(extendedAttribute.attribute)}
      </div>
      <hr />
      <dl className="values">
        {extendedAttribute.components.map((eAC, i) => {
          const origin = renderOrigin(eAC.origin, extendedAttribute.attribute)
          return (
            <Fragment key={eAC.origin.type + i}>
              <dt title={origin}>{origin}</dt>
              <dd className={eAC.origin.type === AttributeSourceType.base ? 'base' : 'additional'}>{roundIfNeeded(eAC.value)}</dd>
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
export default AttributeContext
