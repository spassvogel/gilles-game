import { type PropsWithChildren } from 'react'
import * as TextManager from 'global/TextManager'
import useGoldState from 'hooks/store/useGoldState'
import { type Structure } from 'definitions/structures'
import ResourcesCost from './production/ResourcesCost'
import { type ResourceStructureDefinition } from 'definitions/structures/types'
import { useStructureDefinition } from 'hooks/store/structures'
import { type Resource } from 'definitions/resources'
import { useResourcesState } from 'hooks/store/resources'
import { useDispatch } from 'react-redux'
import { subtractGold } from 'store/actions/gold'
import { addLogText } from 'store/actions/log'
import { upgradeStructure } from 'store/actions/structures'
import { startTask } from 'store/actions/tasks'
import { LogChannel } from 'store/types/logEntry'
import { TaskType } from 'store/types/task'
import Button from 'components/ui/buttons/Button'
import { removeResources } from 'store/actions/resources'
import { formatDuration } from 'utils/format/time'
import { type Action } from 'store/actions'

import './styles/upgradeHelpModal.scss'

export type Props = {
  structure: Structure
  level: number

  addUpgradeCallbacks?: (level: number) => Action[] // add custom actions after upgrade is done
}

const UpgradeHelpModal = (props: PropsWithChildren<Props>) => {
  const { structure, level, addUpgradeCallbacks, children } = props
  const dispatch = useDispatch()
  const structureDefinition: ResourceStructureDefinition = useStructureDefinition(structure)
  const nextLevel = structureDefinition.levels[level + 1]

  const { time } = nextLevel.cost

  const gold = useGoldState()
  const goldCost = (nextLevel != null ? nextLevel.cost.gold ?? 0 : -1)
  const missingGold = goldCost > gold

  const resourcesState = useResourcesState()
  const costResources = ((nextLevel.cost.resources != null) || {}) as { [key in Resource]: number }
  const missingAtLeastOneResource = Object.keys(costResources)
    .some((key) => {
      const resource = key as Resource
      return (costResources[resource] ?? 0) > (resourcesState?.[resource] ?? 0)
    })

  const canUpgrade = nextLevel != null && !missingGold && !missingAtLeastOneResource

  const handleUpgrade = () => {
    dispatch(subtractGold(goldCost))
    dispatch(removeResources(costResources))
    const callbacks = [
      ...(((addUpgradeCallbacks?.(level + 1))) ?? []),
      upgradeStructure(structure),
      addLogText('log-town-upgrade-structure-complete', {
        level: level + 1,
        structure
      }, LogChannel.town)
    ]

    const start = startTask(TaskType.upgradeStructure,
      `${structure}.upgrade`,
      'town',
      nextLevel.cost.time ?? 0,
      callbacks)
    dispatch(start)
  }

  return (
    <div className="structure-upgrade-help-modal">
      <div className="top">
        <h3>{TextManager.get('ui-structure-help-upgrade-title', { structure })}</h3>
        <div className="level">
          {TextManager.get('ui-structure-help-upgrade-header-level', {
            level: level + 2
          })}
        </div>
      </div>
      <div className="cost">
        <h3>Costs</h3>
        { (nextLevel.cost.resources != null) && <ResourcesCost resources={nextLevel.cost.resources} gold={nextLevel.cost.gold} className="wrap" /> }
      </div>
      <Button
        className="start"
        onClick={handleUpgrade}
        disabled={!canUpgrade}
      >
        { TextManager.get('ui-structure-help-upgrade-start', {
          time: formatDuration(time ?? 0)
        })}
      </Button>
      {children}
    </div>
  )
}

export default UpgradeHelpModal
