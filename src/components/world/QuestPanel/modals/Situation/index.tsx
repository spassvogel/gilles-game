import React, { MouseEvent, useRef, useContext } from "react";
import { TextManager } from 'global/TextManager';
import { SceneControllerContext } from '../../context/SceneControllerContext';
import "../styles/situation.scss";
import "../styles/modal.scss";

interface Props {
    situation: string;
    adventurerId: string;
    onClose: () => void;
}

const Situation = (props: Props) => {
    const controller = useContext(SceneControllerContext)!;
    const ref = useRef<HTMLDivElement>(null);
    const situation = controller.getSituation(props.situation, props.adventurerId);
    if (!situation) return null;

    const { title, choices } = situation;

    const handleChoiceClick = (e: MouseEvent<HTMLButtonElement>) => {
        //choice: string
        const choice = e.currentTarget.getAttribute('data-option')!;
        controller.handleSituationOptionClick(props.situation, choice);
        e.stopPropagation();
    }

    const handleClose = (e: MouseEvent<HTMLDivElement>) => {
        props.onClose();
        e.stopPropagation();
    }
    return (
        <div className={`interaction-modal situation`} ref={ref}>
            <div className="header">
                <div className="title">
                    {TextManager.get(title)}
                </div>
                <div className="close" onClick={handleClose} />
            </div>
             { choices.length > 0 && (
                <div className="content">
                    {choices.map(choice => (
                        <button key={choice} data-option={choice} onClick={handleChoiceClick}>{TextManager.get(choice)}</button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Situation;