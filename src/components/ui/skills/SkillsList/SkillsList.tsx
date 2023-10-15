import { MAX_VALUE } from 'mechanics/adventurers/attributes'
import { type CSSProperties } from 'react'
import { type SkillsStoreState } from 'store/types/adventurer'
import SkillsListItems from './SkillsListItems'

import './styles/skillsList.scss'

type Props = {
  skills: SkillsStoreState
}

const style = { '--item-count': MAX_VALUE }

const SkillsList = (props: Props) => {
  const { skills } = props
  return (
    <div className='skills-list' style={style as CSSProperties} >
      <SkillsListItems skills={skills} />
    </div>
  )
}
export default SkillsList
