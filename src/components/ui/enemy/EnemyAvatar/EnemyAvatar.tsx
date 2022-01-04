import Icon, { IconSize } from 'components/ui/common/Icon';
import { getDefinition } from 'definitions/enemies';
import { EnemyType } from 'definitions/enemies/types';
import { ActorObject } from 'store/types/scene';
import "./styles/enemyAvatar.scss";

export interface Props {
  actorObject: ActorObject
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
    size
  } = props;

  const className = `${(props.className || "")} enemy-avatar`;
  const definition = getDefinition(actorObject.name as EnemyType);

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(actorObject.id);
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
