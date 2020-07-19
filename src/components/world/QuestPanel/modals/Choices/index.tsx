import React, { useState, useEffect, useRef, useContext } from "react";
import useQuest from 'hooks/store/useQuest';
import DraggableItemsList from 'components/ui/items/DraggableItemsList';
import { TextManager } from 'global/TextManager';
import AdventurerAvatar from 'components/ui/AdventurerAvatar';
import useAdventurer from 'hooks/store/useAdventurer';
import { DragSourceType } from 'constants/dragging';
import { useDispatch } from 'react-redux';
import { addGold } from 'actions/gold';
import { takeGoldFromCache, takeItemFromCache } from 'actions/quests';
import { addItemToInventory } from 'actions/adventurers';
import { adventurerFreeInventorySlots } from 'storeHelpers';
import "../styles/choices.scss";
import "../styles/modal.scss";
import { SceneControllerContext } from '../../context/SceneControllerContext';

interface Props {
    title: string;
    choices: string[];
    adventurerId: string;
    onClose: () => void;
}

const Choices = (props: Props) => {
    const dispatch = useDispatch();
    const controller = useContext(SceneControllerContext)!;
    const quest = useQuest(controller.questName);
    const {scene} = quest;
    const adventurer = useAdventurer(props.adventurerId);
    const [taking, setTaking] = useState(false)
    const freeSlots = adventurerFreeInventorySlots(adventurer);
    const ref = useRef<HTMLDivElement>(null);

    const onChoiceClick = () => {
        console.log(controller.questName)
    }
    return (
        <div className={`interaction-modal choices`} ref={ref}>
            <div className="header">
                <div className="title">
                    {TextManager.get(props.title)}
                </div>
                <div className="close" onClick={props.onClose} />
            </div>
             { props.choices.length > 0 && (
                <div className="content">
                    {props.choices.map(choice => (
                        <button key={choice} onClick={onChoiceClick}>{TextManager.get(choice)}</button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Choices;