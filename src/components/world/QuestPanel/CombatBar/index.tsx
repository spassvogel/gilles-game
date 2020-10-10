import React, { useState, useMemo, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { SceneControllerContext } from '../context/SceneControllerContext';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';

interface Props {
    questName: string;
}

const CombatBar = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));

    return (
        <div>
            {adventurers.map(a => (
                <AdventurerAvatar adventurer={a} key={a.id}/>
            ))}
        </div>
    )
}

export default CombatBar;