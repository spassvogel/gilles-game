import { type Structure } from 'definitions/structures'
import { TextManager } from 'global/TextManager'
import './styles/structureViewHeader.scss'

type Props = {
  structure: Structure
}

const StructureViewHeader = (props: Props) => {
  const displayName = TextManager.getStructureName(props.structure)
  return (
    <div className={`structureview-header structureview-header-${props.structure}`}>
      <h1 className="app-h1-white">{displayName}</h1>
    </div>
  )
}

export default StructureViewHeader
