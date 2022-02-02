import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { useAdventurer } from 'hooks/store/adventurers';
import { TextManager } from 'global/TextManager';
import { xpToLevel } from 'mechanics/adventurers/levels';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';

export interface Props {
  adventurerId: string;
}

const Health = (props: Props) => {
  const { adventurerId } = props;
  const { health, basicAttributes, xp } = useAdventurer(adventurerId);
  const level = xpToLevel(xp);
  const baseHP = calculateBaseHitpoints(level, basicAttributes.for);

  return (
    <div className="health">
      {TextManager.get('ui-adventurer-info-health')}
      <PlainProgressbar
        progress={health / baseHP}
        label={`${health.toFixed(2)}/${baseHP}`}
        variation="health"
      />
    </div>
  );
};
export default Health;
