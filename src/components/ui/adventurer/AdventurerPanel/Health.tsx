import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { useAdventurer } from 'hooks/store/adventurers';
import { TextManager } from 'global/TextManager';
import { xpToLevel } from 'mechanics/adventurers/levels';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';
import { roundIfNeeded } from 'utils/format/number';

export type Props = {
  adventurerId: string;
};

const Health = (props: Props) => {
  const { adventurerId } = props;
  const { health, basicAttributes, xp } = useAdventurer(adventurerId);
  const level = xpToLevel(xp);
  const baseHP = calculateBaseHitpoints(level, basicAttributes.for);

  const label = health > 0 ? `${roundIfNeeded(Math.max(health, 0))}/${baseHP}` : TextManager.get('ui-adventurer-info-dead');
  return (
    <div className="health">
      {TextManager.get('ui-actor-info-health')}
      <PlainProgressbar
        progress={health / baseHP}
        label={label}
        variation="health"
      />
    </div>
  );
};
export default Health;
