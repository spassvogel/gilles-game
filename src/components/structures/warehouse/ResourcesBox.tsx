import { useRef } from 'react'
import { useSelector } from 'react-redux'
import resourceDescriptions, { Resource } from 'definitions/resources'
import { type ResourceStoreState } from 'store/types/resources'
import { TextManager } from 'global/TextManager'
import ReactMarkdown from 'react-markdown'
import { type StructuresStoreState } from 'store/types/structures'
import { getStructureByResource } from 'definitions/structures'
import { type StoreState } from 'store/types'
import { StructureState } from 'store/types/structure'
import { formatNumber } from 'utils/format/number'
import Icon from '../../ui/common/Icon'
import { BubbleLayer, BubbleManager, BubbleType } from 'global/BubbleManager'
import { Point } from 'pixi.js'
import './styles/resourcesBox.scss'

export type Props = {
  className?: string
  resources: ResourceStoreState
  structures: StructuresStoreState
  maxResources: ResourceStoreState
  deltaResources: ResourceStoreState
}

/**
 * The ResourcesBox is used in the Warehouse to show a list of resources
 */
const ResourcesBox = (props: Props) => {
  const {
    resources,
    deltaResources
  } = props
  const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures)
  const className = ['resources-box', props.className].join(' ')
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className={className} ref={ref}>
      {
        Object.keys(resources).map((value: string) => {
          const resource = value as Resource
          const resourceDescription = resourceDescriptions[resource]
          const amount = props.resources[resource] ?? 0
          if (resourceDescription === undefined) {
            throw new Error(`No resource description found for ${resource}`)
          }

          if ((deltaResources[resource] ?? 0) > 0) {
            // Show bubble
            const el = ref.current?.querySelector(`[data-resource="${resource}"] .amount`)
            const rect = el?.getBoundingClientRect()
            const point = new Point(rect?.right, rect?.top)

            BubbleManager.addBubble(`+ ${deltaResources[resource]?.toFixed(2)}`, point, BubbleType.resource, BubbleLayer.general)
          }

          const structure = getStructureByResource(Resource[resource])

          const full = amount >= (props.maxResources?.[resource] ?? 0)
          return (
            <div className="row" data-resource={resource} key={resource}>
              <Icon image={resourceDescription.iconImg} size="smallest"/>
              <div className="name">
                { TextManager.getResourceName(resource) }
              </div>
              <div className={`amount${full ? ' full' : ''}`} >
                { formatNumber(amount, 0) }
              </div>
              <div className="max" >
                { ` /${props.maxResources[resource]}` }
              </div>
              <div className="structure">
                {structures[structure].state === StructureState.Built
                  ? (
                    <>
                      <span className="source">
                        {TextManager.get('ui-structure-warehouse-resources-source')}
                      </span>
                      <ReactMarkdown>{TextManager.get('ui-structure-warehouse-resources-source-structure-link', { structure })}</ReactMarkdown>
                    </>
                    )
                  : (
                    <>
                      <span className="source">
                      {TextManager.get('ui-structure-warehouse-resources-source')}
                      </span>
                      <ReactMarkdown>{TextManager.get('ui-structure-warehouse-resources-source-structure', { structure })}</ReactMarkdown>
                      <span className="unbuilt">
                        {TextManager.get('ui-structure-warehouse-resources-source-unbuilt')}
                      </span>
                    </>
                    )}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ResourcesBox
