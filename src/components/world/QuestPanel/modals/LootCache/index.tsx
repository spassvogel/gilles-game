import React, { useState, useMemo, useEffect } from "react";
import "./lootCache.css";
import useQuest from 'hooks/useQuest';

interface Props {
    questName: string;
    cacheName: string;
    onClose: () => void;
}

const LootCache = (props: Props) => {
    const quest = useQuest(props.questName);
    const {scene} = quest;
    const cache = scene?.caches[props.cacheName];

    if (!cache) {
        return null;
    }

    return (
        <div className="lootCache">
            <div className="header">
                <div className="title">
                    {cache.title}
                </div>
                <div className="close" onClick={props.onClose}>
                </div>
            </div>
            <div className="items">

            </div>
        </div>
    )
}

export default LootCache;