import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { SceneControllerContext } from '../context/SceneControllerContext';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { IconSize } from 'constants/icons';
import "./styles/combatBar.scss";
import { TextManager } from 'global/TextManager';

interface Props {
    questName: string;
}

const CombatBar = (props: Props) => {
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));
    const controller = useContext(SceneControllerContext)!;

    return (
        <div className="combat-bar">
            <div className="title">
                {TextManager.get("ui-combat-bar-title")}
            </div>
            <div className="adventurers">
                {adventurers.map(a => (
                    <React.Fragment key={a.id}>
                        <AdventurerAvatar adventurer={a} size={IconSize.smallest}/>
                        <div className="ap">
                            {controller.getRemainingAdventurerAp(a.id)} AP
                        </div>
                    </React.Fragment>
                ))}

            </div>
        </div>
    )
}

export default CombatBar;
