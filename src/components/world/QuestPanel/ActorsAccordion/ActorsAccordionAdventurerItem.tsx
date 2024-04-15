import { type CSSProperties, useMemo } from 'react'
import { type Merge } from 'type-fest'
import { useAdventurer } from 'hooks/store/adventurers'
import Attributes from 'components/ui/attributes/AttributeList'
import { xpToLevel } from 'mechanics/adventurers/levels'
import * as TextManager from 'global/TextManager'
import { calculateEffectiveAttributes, calculateEffectiveAttributesExtended, MAX_VALUE } from 'mechanics/adventurers/attributes'
import AccordionItem, { type Props as AccordionItemProps } from 'components/ui/accordion/AccordionItem'
import CombatAttributes from 'components/ui/tooltip/ContextTooltip/context/ActorContext/CombatAttributes'
import { useAdventurerActorObject, useQuest } from 'hooks/store/quests'
import { PlainProgressbar } from 'components/ui/common/progress'
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints'
import { roundIfNeeded } from 'utils/format/number'
import { Allegiance, isEnemy } from 'store/types/scene'

type Props = Merge<Omit<AccordionItemProps, 'id' | 'title'>, {
  adventurerId: string
  selected: boolean
  questName: string
}>
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const style = { '--item-count': MAX_VALUE } as CSSProperties

const ActorsAccordionAdventurerItem = (props: Props) => {
  const { adventurerId, selected, questName, ...rest } = props
  const quest = useQuest(questName)
  const adventurer = useAdventurer(adventurerId)
  const attributes = calculateEffectiveAttributes(adventurer)
  const { xp } = adventurer
  const level = xpToLevel(xp)
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer])
  const actor = useAdventurerActorObject(questName ?? '', adventurerId)
  const baseHP = calculateBaseHitpoints(level, attributes.for)
  const health = adventurer.health
  const label = health > 0 ? `${roundIfNeeded(Math.max(health, 0))}/${baseHP}` : TextManager.get('ui-adventurer-info-dead')
  const apDisplay = health > 0 ? TextManager.get('ui-actor-info-ap', { ap: actor?.ap }) : TextManager.get('ui-actor-info-ap-dead')
  const apActive = health > 0 && quest.scene?.turn === Allegiance.player

  const enemyIsDoingSomething = useMemo(() => {
    const action = (quest.scene?.actionQueue ?? [])[0]
    if (action === undefined) return false
    return isEnemy(action.intent.actor)
  }, [quest.scene?.actionQueue])

  return (
    <AccordionItem
      className={`actors-accordion-item ${selected && !enemyIsDoingSomething ? 'selected' : ''}`}
      { ...rest}
      id={adventurerId}
      title={(<>
        <div className={`name ${health > 0 ? '' : 'dead'}`}>{adventurer.name}</div>
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

export default ActorsAccordionAdventurerItem
