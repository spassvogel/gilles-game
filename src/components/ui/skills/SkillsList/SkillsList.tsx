import { MAX_VALUE } from 'mechanics/adventurers/attributes';
import { CSSProperties } from 'react';
import { SkillsStoreState } from 'store/types/adventurer';
import SkillsListItems from './SkillsListItems';
import './styles/skillsList.scss';

type Props = {
  skills: SkillsStoreState;
};

const style = { '--item-count': MAX_VALUE } as CSSProperties;
const SkillsList = (props: Props) => {
  const { skills } = props;
  return (
    <div className='skills-list' style={style}>
      <SkillsListItems skills={skills} />
    </div>
  );
};
export default SkillsList;
