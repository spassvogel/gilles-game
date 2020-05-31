import * as React from "react";
import { Actor, CombatStoreState, CombatActionType } from "stores/combat";
import CombatControls from "./CombatControls";
import "./css/combatview.css";
import { SoundManager, Sound } from 'global/SoundManager';
import { useState, useRef } from 'react';

export interface Props {
}

export interface StateProps  {
    combat: CombatStoreState;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
    onStartAction: (type: CombatActionType, actor: string, target: [number, number], endsAt: number) => void;
}

type AllProps = Props & StateProps & DispatchProps;

const CombatView = (props: AllProps) => {
    const [selectedActor, setSelectedActor] = useState<Actor|null>(null);
    const [activeAction, setActiveAction] = useState<CombatActionType|null>(null);
    const ref = useRef<HTMLPreElement>(null);

    const mouseover = (e: React.MouseEvent<HTMLPreElement>) => {
        if (!e.target || !activeAction) {
            return;
        }
        const target = e.target as HTMLElement;
        if (target.tagName === "SPAN") {
            const location: number[] = target.attributes["data-position"].value.split(",").map((v: string) => parseFloat(v));
            const allowed = actionAllowed(selectedActor!, location, activeAction);

            target.classList.add(allowed ? "allowed" : "disallowed");
        }
    };

    const mouseout = (e: React.MouseEvent<HTMLPreElement>) => {
        const target = e.target as HTMLElement;
        target.classList.remove("allowed", "disallowed");
    };

    // useEffect(() => {
    //     if (ref.current) {
    //         ref.current!.addEventListener("mouseover", mouseover);
    //         ref.current!.addEventListener("mouseout", mouseout);
    //     }
    //     return () => {
    //         ref.current!.removeEventListener("mouseover", mouseover);
    //         ref.current!.removeEventListener("mouseout", mouseout);
    //     }
    // }, [activeAction]);

    const width = 10;
    const height = 10;
    const map = [];

    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const actor = findActorById(props.combat.actors, x, y);
            if (actor) {
                const selected = selectedActor && (actor.name === selectedActor.name);
                map.push(`<span data-position="${x},${y}" data-id="${actor.name}" style="font-weight: ${selected ? "bold" : "normal"}">${actor.name[0]}</span>`);
            } else {
                map.push(`<span data-position="${x},${y}">□</span>`);
            }
        }
        map.push("\n");
    }

    const clickMap = (e: React.MouseEvent<HTMLPreElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "SPAN") {
            const location: [number, number] = target.attributes["data-position"].value.split(",").map((v: string) => parseFloat(v));

            if (activeAction) {
                const allowed = actionAllowed(selectedActor!, location, activeAction);
                if (!allowed) {
                    SoundManager.playSound(Sound.error);
                } else {
                    const endsAt = Date.now() + 500;   // animation time
                    props.onStartAction(activeAction, selectedActor!.name, location, endsAt);
                    setActiveAction(null);
                }
            } else if (target.hasAttribute("data-id")) {
                // Select an actor
                const actorName = target.attributes["data-id"].value;
                const actor = findActorByName(props.combat.actors, actorName) || null;
                setSelectedActor(actor);
                setActiveAction(null);
            }
        }
    };

    const handleActivateAction = (type: CombatActionType) => {
        if (activeAction === type) {
            setActiveAction(null);
        } else {
            setActiveAction(type);
        }
    };

    const html = map.join("");
    const combatActionInProgress = props.combat.action !== undefined;
    const currentAction = combatActionInProgress ? props.combat.action!.type : "...";

    const getControl = () => {
        if (selectedActor) {
            return <CombatControls
                actor = {selectedActor}
                onActivateAction = {handleActivateAction}
                activeAction = {activeAction}
                disabled = {combatActionInProgress}
            />;
        }
        return null;
    };

    return (
        <>
            <fieldset className="combat">
                <legend>COMBAT</legend>
                { currentAction }
                <pre
                    style={{ fontFamily: "\"Courier New\", Courier, monospace"}}
                    dangerouslySetInnerHTML={{__html: html}}
                    onClick={clickMap}
                    onMouseOver={mouseover}
                    onMouseOut={mouseout}
                    ref={ref}
                >
                </pre>
             </fieldset>
            { getControl() }
        </>
    );
};

export default CombatView;

const findActorById = (actors: Actor[], x: number, y: number) => {
    return actors.find((a) => a.location[0] === x && a.location[1] === y);
};

const findActorByName = (actors: Actor[], name: string) => {
    return actors.find((a) => a.name === name);
};

const getDistance = (location1: number[], location2: number[]) => {
    return Math.floor(Math.sqrt(Math.pow(location2[1] - location1[1], 2) + Math.pow(location2[0] - location1[0], 2)));
};

const actionAllowed = (actor: Actor, location: number[], action: CombatActionType) => {
    switch (action) {
        case CombatActionType.move: {
            const moveDistance = 1; // tiles that we can move
            return getDistance(location, actor.location) <= moveDistance;
        }
        case CombatActionType.shoot: {
            const shootDistance = 4; // tiles that we can shoot
            return getDistance(location, actor.location) <= shootDistance;
        }
        case CombatActionType.slash:
            const slashDistance = 2; // tiles that we can shoot
            return getDistance(location, actor.location) <= slashDistance;
    }
};
