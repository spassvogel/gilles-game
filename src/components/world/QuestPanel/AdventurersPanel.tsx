import AdventurerPanel, { AdventurerSectionSelection } from 'components/ui/adventurer/AdventurerPanel';
import { AdventurerStoreState } from 'store/types/adventurer';
import AdventurerTabstrip from './AdventurerTabstrip';

type Props = {
  adventurerId: string;
  adventurers: AdventurerStoreState[];
  onAdventurerTabSelected: (adventurerId: string) => void;
  questName?: string;
  disabled?: boolean;
};

// A tabstrip with adventurer details below it
const AdventurersPanel = (props: Props) => {
  const { adventurerId, adventurers, onAdventurerTabSelected, disabled, questName } = props;
  return (
    <>
     <AdventurerTabstrip
        adventurers={adventurers}
        selectedAdventurerId={adventurerId}
        onAdventurerTabSelected={onAdventurerTabSelected}
        disabled={disabled}
      />
      <div className="adventurer-details">
        <AdventurerSectionSelection />
        { adventurerId && (
          <AdventurerPanel
            adventurerId={adventurerId}
            questName={questName}
          />
        )}
      </div>
    </>
  );
};

export default AdventurersPanel;
