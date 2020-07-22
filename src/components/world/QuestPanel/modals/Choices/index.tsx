import React, { useState, useRef, useContext } from "react";
import useQuest from 'hooks/store/useQuest';
import { TextManager } from 'global/TextManager';
import useAdventurer from 'hooks/store/useAdventurer';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import "../styles/choices.scss";
import "../styles/modal.scss";

interface Props {
    title: string;
    choices: string[];
    adventurerId: string;
    onClose: () => void;
}

const Choices = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
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