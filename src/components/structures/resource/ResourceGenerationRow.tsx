import ReactMarkdown from 'react-markdown'
import { type Structure } from 'definitions/structures'
import * as TextManager from 'global/TextManager'
import { useEngine } from 'hooks/store/engine'
import { formatDuration } from 'utils/format/time'
import { RESOURCE_INTERVAL } from 'mechanics/resources'
import { Direction } from 'components/ui/common/progress/PlainProgressbar'
import resourceDescriptions, { type Resource } from 'definitions/resources'
import { useStructureLevel, useStructureState } from 'hooks/store/structures'
import { type ResourceStructureLevelDefinition } from 'definitions/structures/types'
import Icon from 'components/ui/common/Icon'
import TickingProgressbar from 'components/ui/common/progress/TickingProgressbar'
import { useMaxResourcesState, useResourcesState } from 'hooks/store/resources'

type Props = {
  structure: Structure
  resource: Resource
}

const ResourceGenerationRow = (props: Props) => {
  const { structure, resource } = props
  const engine = useEngine()
  const { workers } = useStructureState(structure)

  const levelDefinition = useStructureLevel<ResourceStructureLevelDefinition>(structure)
  const generates = levelDefinition.generates[resource] ?? 0
  const delta = RESOURCE_INTERVAL - (Date.now() - engine.lastProducedUpdate)
  const resourceDescription = resourceDescriptions[resource]
  const resources = useResourcesState()
  const maxResources = useMaxResourcesState()
  const full = (resources[resource] ?? 0) >= (maxResources?.[resource] ?? 0)
  if (full) {
    return (
      <div className="resource-generation-row">
        <div className="error-full">
        <ReactMarkdown>
          {TextManager.get('ui-structure-resource-warehouse-full', { structure, resource })}
        </ReactMarkdown>
        </div>
      </div>
    )
  }
  return (
    <div className="resource-generation-row">
      <div className="info">
        <Icon image={resourceDescription.iconImg} size="smallest"/>
        <div>
          {TextManager.get('ui-structure-resource-generates', {
            amount: generates,
            resource
          })}
        </div>
      </div>
      {full}
      { workers > 0 &&
      <TickingProgressbar
        className="generating"
        direction={Direction.decreasing}
        label={`${TextManager.get('ui-structure-resource-next-generates', {
          amount: generates * workers,
          resource,
          time: formatDuration(delta)
        })}`}
        progress={delta / RESOURCE_INTERVAL}
      />}
      { ((workers ?? 0) === 0) && TextManager.get('ui-structure-resource-no-workers')}
    </div>
  )
}
export default ResourceGenerationRow
