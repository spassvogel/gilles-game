import { TextManager } from 'global/TextManager';
import { useActorObject, useQuest } from 'hooks/store/quests';
import { AdventurerStoreState } from 'store/types/adventurer';
import { ActorObject } from 'store/types/scene';

export interface Props {
  adventurer: AdventurerStoreState;
  questName: string;
}

/** Used when AdventurerPanel is used in Quest view
 */
const ApIndicator = (props: Props) => {
  const { questName, adventurer } = props;
  const quest = useQuest(questName);

  const actor = useActorObject<ActorObject>(questName ?? '', adventurer.id);
  const ap = actor?.ap || 0;

  if (!quest?.scene?.combat) {
    return null;
  }
  return (
    <span>{TextManager.get('ui-adventurer-info-ap-remaining', { ap })}</span>
  );
};

export default ApIndicator;
