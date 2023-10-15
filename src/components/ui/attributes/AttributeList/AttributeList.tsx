import { type AttributesExtended, AttributeSourceType, MAX_VALUE } from 'mechanics/adventurers/attributes'
import { type CSSProperties } from 'react'
import { entries } from 'utils/typescript'
import AttributeListItems from './AttributeListItems'
import './styles/attributeList.scss'

type Props = {
  attributes: AttributesExtended
  small?: boolean
}

const style = { '--item-count': MAX_VALUE }
const AttributeList = (props: Props) => {
  const { attributes } = props
  const hasAdditional = entries(attributes).some(([_attr, comp]) => comp.some(c => c.origin.type !== AttributeSourceType.base))

  return (
    <div className={`attribute-list ${hasAdditional ? 'has-additional' : ''}`} style={style as CSSProperties}>
      <AttributeListItems attributes={attributes} />
    </div>
  )
}
export default AttributeList
