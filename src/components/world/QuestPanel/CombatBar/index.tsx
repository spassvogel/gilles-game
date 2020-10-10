import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { SceneControllerContext } from '../context/SceneControllerContext';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { IconSize } from 'constants/icons';
import "./styles/combatBar.scss";

interface Props {
    questName: string;
}

const CombatBar = (props: Props) => {
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));

    return (
        <div className="combat-bar">
            {adventurers.map(a => (
                <AdventurerAvatar adventurer={a} key={a.id} size={IconSize.smallest}/>
            ))}
        </div>
    )
}

export default CombatBar;