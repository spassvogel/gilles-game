import Icon, { IconSize } from 'components/ui/common/Icon';
import { getDefinition } from 'definitions/enemies';
import { EnemyObject } from 'store/types/scene';
import './styles/enemyAvatar.scss';

export interface Props {
  actorObject: EnemyObject
  className?: string;
  onClick?: (adventurerId: string) => void;
  size?: IconSize;
}

/**
 * The EnemyAvatar displays the avatar of an enemy scene object
 */
const EnemyAvatar = (props: Props) => {
  const {
    actorObject,
    size,
  } = props;

  const className = `${(props.className || '')} enemy-avatar`;
  const definition = getDefinition(actorObject.enemyType);

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(actorObject.enemyId);
    }
  };
  return (
    <Icon
      className={className}
      image={definition.avatarImg}
      size={size}
      onClick={handleClick}
    />
  );
};

export default EnemyAvatar;
