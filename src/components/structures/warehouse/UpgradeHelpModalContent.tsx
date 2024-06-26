import { Fragment } from 'react'
import resourceDescriptions, { type Resource } from 'definitions/resources'
import { type WarehouseStructureDefinition } from 'definitions/structures/types'
import Icon from 'components/ui/common/Icon'
import * as TextManager from 'global/TextManager'
import { useStructureDefinition } from 'hooks/store/structures'

import './styles/upgradeHelpModalContent.scss'

export type Props = {
  level: number
}

const UpgradeHelpModalContent = (props: Props) => {
  const { level } = props
  const structureDefinition = useStructureDefinition<WarehouseStructureDefinition>('warehouse')

  const currentLevel = structureDefinition.levels[level]
  const nextLevel = structureDefinition.levels[level + 1]

  const renderRow = (resource: Resource) => {
    const resourceDescription = resourceDescriptions[resource]

    return (
      <Fragment key={resource}>
        <div><Icon image={resourceDescription.iconImg} size="smallest"/></div>
        <div>{TextManager.getResourceName(resource)}</div>
        <div className="number">{currentLevel.maxResources[resource]}</div>
        <div className="arrow">»</div>
        <div className="number">{nextLevel.maxResources[resource]}</div>
      </Fragment>
    )
  }

  return (
    <div className="upgrade-help-model-content-warehouse">
      <h3>{TextManager.get('ui-structure-help-upgrade-improvements')}</h3>
      <div className="storage-increase">
        <div className="header"/>
        <div className="header">
          {TextManager.get('ui-structure-warehouse-help-upgrade-header-capacity')}
        </div>
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
        {Object.keys(nextLevel.maxResources).map(res => renderRow(res as Resource))}
      </div>
    </div>
  )
}

export default UpgradeHelpModalContent
