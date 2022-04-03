import Icon, { IconSize } from 'components/ui/common/Icon';
import { AdventurerStoreState } from 'store/types/adventurer';
import './styles/adventurerAvatar.scss';

export interface Props {
  adventurer: AdventurerStoreState;
  className?: string;
  displayName?: boolean;
  onClick?: (adventurerId: string) => void;
  size?: IconSize;
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer
 */
const AdventurerAvatar = (props: Props) => {
  const {
    adventurer,
    size,
  } = props;

  const className = `${(props.className || '')} avatar`;

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(props.adventurer.id);
    }
  };
  return (
    <Icon
      className={className}
      image={adventurer.avatarImg}
      size={size}
      onClick={handleClick}
    />
  );
};

export default AdventurerAvatar;