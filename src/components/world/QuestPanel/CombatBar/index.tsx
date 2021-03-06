import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import { createSelectAdventurersOnQuest } from 'store/selectors/adventurers';
import { SceneControllerContext } from '../context/SceneControllerContext';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { IconSize } from 'components/ui/common/Icon';
import "./styles/combatBar.scss";

interface Props {
    questName: string;
    selectedAdventurerId?: string;
}

const CombatBar = (props: Props) => {
    const {selectedAdventurerId} = props;
    const adventurers = useSelector(createSelectAdventurersOnQuest(props.questName));
    const controller = useContext(SceneControllerContext);

    return (
        <div className="combat-bar">
            <div className="title">
                {TextManager.get("ui-combat-bar-title")}
            </div>
            <div className="adventurers">
                {adventurers.map(a => (
                    <div key={a.id} className={`adventurer ${selectedAdventurerId === a.id ? "selected" : ""}`}>
                        <AdventurerAvatar adventurer={a} size={IconSize.smallest}/>
                        <div className="ap">
                            {controller?.getSceneActor(a.id)?.ap || 0} AP
                        </div>
                    </div>
                ))}
            </div>
            <Button size="small" onClick={() => controller?.endTurn()}>End turn</Button>
        </div>
    )
}

export default CombatBar;
