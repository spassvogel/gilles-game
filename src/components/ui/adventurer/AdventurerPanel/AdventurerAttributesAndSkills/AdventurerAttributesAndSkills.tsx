import { AttributeListItems } from 'components/ui/attributes/AttributeList'
import SkillsListItems from 'components/ui/skills/SkillsList'
import * as TextManager from 'global/TextManager'
import { useAdventurer } from 'hooks/store/adventurers'
import { AttributeSourceType, calculateEffectiveAttributesExtended, MAX_VALUE } from 'mechanics/adventurers/attributes'
import { type CSSProperties, useMemo } from 'react'
import { entries } from 'utils/typescript'
import './styles/attributesAndSkills.scss'

type Props = {
  adventurerId: string
  skills?: boolean // whether to show skills
}

const style = { '--item-count': MAX_VALUE }

const AdventurerAttributesAndSkills = (props: Props) => {
  const { adventurerId, skills } = props
  const adventurer = useAdventurer(adventurerId)
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer])
  const hasAdditional = entries(extendedAttributes).some(([_attr, comp]) => comp.some(c => c.origin.type !== AttributeSourceType.base))

  return (
    <section className={`attributes-and-skills ${hasAdditional ? 'has-additional' : ''}`} style={style as CSSProperties} id='skills'>
      <h3 className='title'>{TextManager.get('ui-adventurer-info-attributes-title')}</h3>
      <AttributeListItems attributes={extendedAttributes} />
      { skills !== undefined && (
        <>
          <h3 className='title'>{TextManager.get('ui-adventurer-info-skills-title')}</h3>
          <SkillsListItems skills={adventurer.skills} />
        </>
      )}
    </section>
  )
}

export default AdventurerAttributesAndSkills
