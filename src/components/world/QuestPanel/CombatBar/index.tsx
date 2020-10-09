import React, { useState, useMemo, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { createSelectAdventurersOnQuest } from 'selectors/adventurers';
import { SceneControllerContext } from '../context/SceneControllerContext';

interface Props {
    questName: string;
}

const CombatBar = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));

    return (
        <div>
            {adventurers.map(a => a.name)}
        </div>
    )
}

export default CombatBar;