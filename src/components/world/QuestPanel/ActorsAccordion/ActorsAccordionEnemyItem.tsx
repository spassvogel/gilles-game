import { type Merge } from 'type-fest'
import * as TextManager from 'global/TextManager'
import AccordionItem, { type Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem'
import { useEnemyActorObject, useQuest } from 'hooks/store/quests'
import { getDefinition } from 'definitions/enemies'
import { generateBaseAttributes, MAX_VALUE } from 'mechanics/adventurers/attributes'
import Attributes from 'components/ui/attributes/AttributeList'

import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints'
import { PlainProgressbar } from 'components/ui/common/progress'
import { roundIfNeeded } from 'utils/format/number'
import { type CSSProperties, useMemo } from 'react'
import { Allegiance, isEnemy } from 'store/types/scene'
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes'

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  enemyId: string
  selected: boolean
  questName: string
}>

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const style = { '--item-count': MAX_VALUE } as CSSProperties

const ActorsAccordionEnemyItem = (props: Props) => {
  const { enemyId, selected, questName, ...rest } = props
  const actorObject = useEnemyActorObject(questName, enemyId)
  const quest = useQuest(questName)
  if (actorObject === undefined) {
    throw new Error(`No actor found with id ${enemyId}`)
  }

  const definition = getDefinition(actorObject.enemyType)
  const level = actorObject.level ?? 1
  const extendedAttributes = generateBaseAttributes(definition.attributes)
  const attributes = definition.attributes
  const baseHP = calculateBaseHitpoints(level, attributes.for)
  const health = actorObject.health
  const label = health > 0 ? `${roundIfNeeded(Math.max(health, 0))}/${baseHP}` : TextManager.get('ui-adventurer-info-dead')
  const apDisplay = health > 0 ? TextManager.get('ui-actor-info-ap', { ap: actorObject?.ap }) : TextManager.get('ui-actor-info-ap-dead')
  const apActive = health > 0 && quest.scene?.turn === Allegiance.enemy

  const currentlyDoingAnAction = useMemo(() => {
    const action = (quest.scene?.actionQueue ?? [])[0]
    if (action === undefined) return false
    return isEnemy(action.intent.actor) && action.intent.actor.enemyId === enemyId
  }, [enemyId, quest.scene?.actionQueue])

  return (
    <AccordionItem
      className={`actors-accordion-item ${selected ? 'selected' : ''} ${currentlyDoingAnAction ? 'enemy-action' : ''}`}
      { ...rest}
      id={enemyId}
      title={(<>
        <div className={`name ${health > 0 ? '' : 'dead'}`}>{actorObject.name}</div>
        <div className={`ap ${apActive ? 'active' : ''}`}>{apDisplay}</div>
      </>)}
    >
      <div>
        <div className={'attribute-list'} style={style}>
          <div className="health">
            {TextManager.get('ui-actor-info-health')}
          </div>
          <PlainProgressbar
            progress={health / baseHP}
            label={label}
            variation="health"
          />
          <div className="level">
           {health > 0 ? TextManager.get('ui-tooltip-actor-level', { level }) : ''}
          </div>
        </div>
        <Attributes attributes={extendedAttributes} small />
        <CombatAttributes attributes={attributes} level={level} />
      </div>
    </AccordionItem>
  )
}

export default ActorsAccordionEnemyItem
