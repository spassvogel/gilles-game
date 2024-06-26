import resourceDescriptions, { type Resource } from 'definitions/resources'
import * as React from 'react'
import { type ResourceStoreState } from 'store/types/resources'
import * as TextManager from 'global/TextManager'
import { useMemo } from 'react'
import { useResourcesState } from 'hooks/store/resources'
import Icon from 'components/ui/common/Icon'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import useGoldState from 'hooks/store/useGoldState'
import './styles/resourcesCost.scss'
import { ContextType } from 'constants/context'

export type Props = {
  className?: string
  resources: ResourceStoreState
  gold?: number
}

/**
 *
 */
const ResourcesCost = (props: Props) => {
  const {
    resources,
    gold
  } = props

  const storeResources = useResourcesState()

  const sufficientResources = useMemo(() => {
    return Object.keys(resources).reduce<Record<string, boolean>>((acc, value) => {
      const resource = value as Resource
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc[value] = storeResources[resource]! >= resources[resource]!
      return acc
    }, {})
  }, [resources, storeResources])
  const availableGold = useGoldState()
  const sufficientGold = gold === undefined || availableGold >= gold

  const className = (props.className ?? '') + ' resources-cost'
  const listItems = Object.keys(props.resources).map((key: string) => {
    const resource = key as Resource
    let listItemClass = 'resource'
    if (!sufficientResources[resource]) {
      listItemClass += ' insufficient'
    }
    const resourceDescription = resourceDescriptions[resource]
    if (resourceDescription == null) {
      throw new Error(`No resource description found for ${resource}`)
    }

    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement)
      const originRect = origin.getBoundingClientRect()
      TooltipEmitter.showContextTooltip(ContextType.resource, resource, originRect)
      event.stopPropagation()
    }

    return (
      <li
        className={listItemClass}
        key={resource}
      >
        <Icon
          image={resourceDescription.iconImg}
          size="smallest"
          onClick={handleClick}
        />
        <div className="name">
          {TextManager.getResourceName(resource)}
        </div>
        <div className="amount" >
          { props.resources[resource] }
        </div>
      </li>
    )
  })

  return (
    <ul className={className}>
      {listItems}
      {gold !== undefined && (
        <li className={['gold', ...(sufficientGold ? [] : ['insufficient'])].join(' ')}>
          <Icon
            image="img/resources/gold.png"
            size="smallest"
          />
          <div className="name">
            {TextManager.get('resource-gold-name')}
          </div>
          <div className="amount" >
            { gold }
          </div>
        </li>
      )}
    </ul>
  )
}

export default ResourcesCost
