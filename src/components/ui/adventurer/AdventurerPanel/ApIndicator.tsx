import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { TextManager } from 'global/TextManager';
import useQuest from 'hooks/store/useQuest';
import React, { useContext, useMemo } from "react";
import { AdventurerStoreState } from 'store/types/adventurer';

export interface Props {
    adventurer: AdventurerStoreState;
    questName?: string;
}

/** Used when AdventurerPanel is used in Quest view
 * todo: move outside of /world
 */
const ApIndicator = (props: Props) => {
    const quest = useQuest(props.questName!);
    const controller = useContext(SceneControllerContext)!;

    const ap = useMemo(() => {
        if (!controller) return null;
        return controller.getSceneActor(props.adventurer.id)?.ap || null;
    }, [controller, props.adventurer.id]);

    if (!quest?.scene?.combat) {
        return null;
    }
    return (
        <span>{TextManager.get("ui-adventurer-info-ap-remaining", { ap })}</span>
    );
}

export default ApIndicator;