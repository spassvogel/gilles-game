import { getDefinition, type Structure } from 'definitions/structures'
import { StructureType } from 'definitions/structures/types'
import { StructureState } from 'store/types/structure'
import { useStructureState } from 'hooks/store/structures'
import { formatDuration } from 'utils/format/time'
import { TickingProgressbar } from 'components/ui/common/progress'
import ProductionStructureView from 'components/structures/production/ProductionStructureView'
import WarehouseStructureView from 'components/structures/warehouse/WarehouseStructureView'
import TavernStructureView from 'components/structures/tavern/TavernStructureView'
import ResourceStructureView from 'components/structures/resource/ResourceStructureView'
import * as TextManager from 'global/TextManager'

import './styles/structuredetailsview.scss'
import { useStructureBuildingTaskState } from 'hooks/store/tasks'

type Props = {
  structure: Structure
}

const StructureDetailsView = (props: Props) => {
  const { structure } = props
  const buildTask = useStructureBuildingTaskState(structure)
  const structureState = useStructureState(structure)

  const renderContent = () => {
    if (structureState.state === StructureState.Building) {
      if (buildTask == null) return null
      return (
        <div className="building">
          <TickingProgressbar
            progress={buildTask.progress}
            label={TextManager.get('ui-structure-building', { time: formatDuration(buildTask.timeRemaining) })}
          />
        </div>
      )
    } else {
      const structureDefinition = getDefinition(structure)
      switch (structureDefinition.type) {
        case StructureType.production: {
          return <ProductionStructureView structure={structure} />
        }
        case StructureType.resource: {
          return <ResourceStructureView structure={structure} />
        }
        case StructureType.warehouse: {
          return <WarehouseStructureView />
        }
        case StructureType.tavern: {
          return <TavernStructureView />
        }
        default: {
          return <div>{structure}</div>
        }
      }
    }
  }

  return (
    <div className="structure-details">
      { renderContent() }
    </div>
  )
}

export default StructureDetailsView
