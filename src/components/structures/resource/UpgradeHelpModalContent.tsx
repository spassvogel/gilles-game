import { Fragment } from 'react'
import { getDefinition, type Structure } from 'definitions/structures'
import resourceDescriptions, { type Resource } from 'definitions/resources'
import { type ResourceStructureDefinition } from 'definitions/structures/types'
import Icon from 'components/ui/common/Icon'
import { TextManager } from 'global/TextManager'

import './styles/upgradeHelpModalContent.scss'

export type Props = {
  structure: Structure
  level: number
}

const UpgradeHelpModalContent = (props: Props) => {
  const { level, structure } = props
  const structureDefinition: ResourceStructureDefinition = getDefinition(structure)

  const currentLevel = structureDefinition.levels[level]
  const nextLevel = structureDefinition.levels[level + 1]

  const renderRow = (resource: Resource) => {
    const resourceDescription = resourceDescriptions[resource]

    return (
      <Fragment key={resource}>
        <div><Icon image={resourceDescription.iconImg} size="smallest"/></div>
        <div>
           {TextManager.get('ui-structure-resource-help-upgrade-resource-generates', { resource })}
        </div>
        <div className="number">{currentLevel.generates[resource]}</div>
        <div className="arrow">›</div>
        <div className="number">{nextLevel.generates[resource]}</div>
      </Fragment>
    )
  }

  return (
    <div className="upgrade-help-model-content-resource">
      <div className="grid generates-increase">
        <div className="header">
          <h3>{TextManager.get('ui-structure-help-upgrade-improvements')}</h3>
        </div>
        <div className="header"/>
        <div className="header number">
          {TextManager.get('ui-structure-help-upgrade-header-level', {
            level: level + 1
          })}
        </div>
        <div className="header"/>
        <div className="header number">
        {TextManager.get('ui-structure-help-upgrade-header-level', {
          level: level + 2
        })}
        </div>
        <div><Icon image={'/img/resources/worker.png'} size="smallest"/></div>
        <div>{TextManager.get('ui-structure-help-upgrade-worker-capacity')}</div>
        <div className="number">{currentLevel.workerCapacity}</div>
        <div className="arrow">»</div>
        <div className="number">{nextLevel.workerCapacity}</div>
        {Object.keys(nextLevel.generates).map(res => renderRow(res as Resource))}
      </div>
    </div>
  )
}

export default UpgradeHelpModalContent
