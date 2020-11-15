import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import React, { useContext, useEffect, useState } from 'react';
import { SceneActionType } from 'store/types/scene';
import { ActionIntent } from '../SceneUI';
import Segment from './Segment';
import "./styles/combatUIWidget.scss";

interface Props {
    location: [number, number];
    actionIntent?: ActionIntent;

    onActionChange: (action?: SceneActionType) => void;
}

// CombatUIWidget shows a circle
const CombatUIWidget = (props: Props) => {
    const {location, actionIntent, onActionChange} = props;
    const segmentWidth = 32;
    const segmentHeight = 46;
    const controller = useContext(SceneControllerContext)!;
    const {tileWidth, tileHeight} = controller.getTileDimensions();
    const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;
    const [collapsed, setCollapsed] = useState(true);
    // const rotate = true;
    // useEffect(() => {
    //     if (rotate){
    //         setTimeout(() => {
    //             console.log(rot)
    //             setRot(rot + 1)
    //         }, 3)
    //     }

    // }, [rot]);

    const handleMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleMouseOver = () => {
        setCollapsed(false);
    }

    const handleMouseOut = () => {
        // setCollapsed(true); // todo enable
    }

    const handleSegmentActivate = (action: SceneActionType) => {
        onActionChange(action);

        // const ap = controller.calculateWalkApCosts(location, location);

    }

    const handleSegmentDeactivate = (_action: SceneActionType) => {
        onActionChange(undefined);
        //setText("") // todo enablee
    }

    
    return (
        <div
            className={`combat-ui-widget ${collapsed ? "collapsed" : "expanded"}`}
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Segment
                position="w"
                icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/knife-thrust.svg`}
                onActivate={() => handleSegmentActivate(SceneActionType.slash)}
                onDeactivate={() => handleSegmentDeactivate(SceneActionType.slash)}
            />
            <Segment position="sw" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/high-shot.svg`}/>
            <Segment
                position="s"
                icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/walking-boot.svg`}
                onActivate={() => handleSegmentActivate(SceneActionType.move)}
                onDeactivate={() => handleSegmentDeactivate(SceneActionType.move)}
            />
            <Segment position="se" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/sunken-eye.svg`}/>
            <Segment position="e" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/crosshair.svg`}/>
            <div className="info" style={{ width: tileWidth }}>
                {getText(actionIntent)}
            </div>
        </div>
    )
}

export default CombatUIWidget;

const getText = (actionIntent?: ActionIntent) => {
    if (!actionIntent) return null;
    if (actionIntent.action === SceneActionType.move) {
        if (!actionIntent.path?.length) {
            // no path possible
            return null;
        }
        const insufficient = (actionIntent.actorAP || 0) < (actionIntent.apCost || 0);
        return (
            <>
            <span>
                Move
            </span>
            <span className={`${(insufficient) ? "insufficient": ""}`}>
                {` ${actionIntent.apCost}`}AP
            </span>
            </>
        );
    }
    if (actionIntent.action === SceneActionType.slash) {
        if (!actionIntent.path?.length) {
            // no path possible
            return null;
        }
        const insufficient = (actionIntent.actorAP || 0) < (actionIntent.apCost || 0);
        return (
            <>
            <span>
                Slash
            </span>
            <span className={`${(insufficient) ? "insufficient": ""}`}>
                {` ${actionIntent.apCost}`}AP
            </span>
            </>
        );
    }
    return "?";
}