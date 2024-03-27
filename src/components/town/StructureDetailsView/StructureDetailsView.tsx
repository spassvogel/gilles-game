import { useSelector } from 'react-redux'
import { getDefinition, type Structure } from 'definitions/structures'
import { type StructureDefinition, StructureType } from 'definitions/structures/types'
import { StructureState } from 'store/types/structure'
import { type StoreState } from 'store/types'
import { type TasksStoreState } from 'store/types/tasks'
import { useStructureState } from 'hooks/store/structures'
import { formatDuration } from 'utils/format/time'
import { TickingProgressbar } from 'components/ui/common/progress'
import ProductionStructureView from 'components/structures/production/ProductionStructureView'
import WarehouseStructureView from 'components/structures/warehouse/WarehouseStructureView'
import TavernStructureView from 'components/structures/tavern/TavernStructureView'
import ResourceStructureView from 'components/structures/resource/ResourceStructureView'
import * as TextManager from 'global/TextManager'

import './styles/structuredetailsview.scss'

type Props = {
  structure: Structure
}

const StructureDetailsView = (props: Props) => {
  const { structure } = props
  const tasks = useSelector<StoreState, TasksStoreState>(store => store.tasks)
  const buildTask = tasks.running.filter((val) =>
    val.origin === 'town' && val.name === `${structure}.build`)[0]
  const structureState = useStructureState(structure)

  const renderContent = () => {
    if (structureState.state === StructureState.Building) {
      if (buildTask == null) return null
      return (
        <div className="building">
          <TickingProgressbar
            progress={buildTask.progress}
            label={TextManager.get('ui-structure-bulding', { time: formatDuration(buildTask.timeRemaining) })}
          />
        </div>
      )
    } else {
      const structureDefinition: StructureDefinition = getDefinition(structure)
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
