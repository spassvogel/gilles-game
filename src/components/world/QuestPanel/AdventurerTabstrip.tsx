import React from 'react';
import Tabstrip from 'components/ui/tabs/Tabstrip';
import { AdventurerStoreState } from 'store/types/adventurer';
import Tab from 'components/ui/tabs/Tab';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { IconSize } from 'components/ui/common/Icon';

interface Props {
  adventurers: AdventurerStoreState[];
  selectedAdventurerId?: string;
  onAdventurerTabSelected: (adventurerId: string) => void;
  disabled?: boolean;
}

// Shows adventurer portraits in a tabstrip
const AdventurerTabstrip = (props: Props) => {
  const { adventurers, onAdventurerTabSelected } = props;

  const handleAdventurerTabSelected = (adventurerId: string) => {
    const adventurer = props.adventurers.find(a => a.id === adventurerId);
    if (adventurer) onAdventurerTabSelected(adventurer.id);
  };

  const renderAdventurerTab = (adventurer: AdventurerStoreState) => (
    <Tab id={adventurer.id} key={adventurer.id}>
      <AdventurerAvatar adventurer={adventurer} size={IconSize.small}/>
    </Tab>
  );
  return (
    <Tabstrip
      className="adventurers-tabstrip"
      onTabSelected={handleAdventurerTabSelected}
      activeTab={props.selectedAdventurerId}
      disabled={props.disabled}
    >
      {adventurers.map((a) => renderAdventurerTab(a))}
    </Tabstrip>
  );
};

export default AdventurerTabstrip;
