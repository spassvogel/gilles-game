import { TextManager } from 'global/TextManager';
import { ToastConfig } from 'global/ToastManager';
import { useHistory } from 'react-router';
import Icon from 'components/ui/common/Icon';

type Props = ToastConfig;

export enum Type {
  achievementUnlocked,
  cheat,
  game,
  itemCrafted,
  questCompleted,
  questEncounter,
  questLaunched,
  questUpdate,
}

const Toast = (props: Props) => {
  const {
    title,
    type = Type.achievementUnlocked,
    icon = '/img/items/quest-items/dragon-eye.png',
    link,
  } = props;
  const history = useHistory();

  const handleClick = () => {
    if (link) {
      history.push(link);
    }
  };

  const typeText = TextManager.getToastType(type);
  return (
    <div className={`toast ${link ? 'withlink' : ''}`} onClick={handleClick}>
      <div className="label type">{typeText}</div>
      <div className="label title">{title}</div>
      <Icon size="big" image={icon} className="toast-icon" border="gold" />
      <div className="banner"/>
    </div>
  );
};

export default Toast;
