import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { IconSize } from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import { useAdventurers } from 'hooks/store/adventurers';
import './styles/adventurersOverview.scss';

const AdventurersOverview = () => {
  const adventurers = useAdventurers();

  return (
    <div className="adventurers-overview">
      {adventurers.map(a => (
        <div className="adventurer" key={a.id}>
          <AdventurerAvatar adventurer={a} size={IconSize.biggest} />
          <div className="name">
            {TextManager.getAdventurerName(a.id)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdventurersOverview;
