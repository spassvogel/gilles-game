import * as TextManager from 'global/TextManager'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import { ContextType } from 'constants/context'
import { roundIfNeeded } from 'utils/format/number'
import AttributeIndicator from 'components/ui/attributes/AttributeIndicator'
import { Fragment } from 'react'
import { type WeaponType } from 'definitions/weaponTypes/types'
import { type SkillsStoreState } from 'store/types/adventurer'

type Props = {
  skills: SkillsStoreState
}

// Seperate list of skills, intended to share the same container as AttributeListItems
const SkillsListItems = (props: Props) => {
  const { skills } = props

  const renderRow = (skill: WeaponType) => {
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement)
      const originRect = origin.getBoundingClientRect()

      TooltipEmitter.showContextTooltip(ContextType.skill, skill, originRect)
      event.stopPropagation()
    }

    const value = skills[skill] ?? 0
    return (
      <Fragment key={skill}>
        <div className="name">
          <span onClick={handleClick}>
            {TextManager.getSkillName(skill)}
          </span>
        </div>
        <AttributeIndicator base={skills[skill] ?? 0} />
        <div className="value-base">
          {roundIfNeeded(value)}
        </div>
        <div className="value-additional"></div>
      </Fragment>
    )
  }

  return (
    <>
       {Object.keys(skills)?.map((s) => {
         const skill: WeaponType = s as WeaponType
         return renderRow(skill)
       })}
    </>
  )
}
export default SkillsListItems
