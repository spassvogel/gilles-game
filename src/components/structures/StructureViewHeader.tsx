import { type Structure } from 'definitions/structures'
import './styles/structureViewHeader.scss'

type Props = {
  structure: Structure
}

const StructureViewHeader = (props: Props) => {
  return (
    <div className={`structureview-header structureview-header-${props.structure}`}>
    </div>
  )
}

export default StructureViewHeader
