import * as React from "react";
import { SoundManager} from 'global/SoundManager';
import Button from '../buttons/Button';
import { PropsWithChildren, useEffect } from "react";

// todo: refactor using WindowManager [30/03/2020]
export interface Props {
    title: string;
    backEnabled?: boolean;
    closeEnabled?: boolean;
    onClose?: () => void;
    onBack?: () => void;
}

/**
 *
 */
const Window = (props: PropsWithChildren<Props>) => {

    const handleClose = (_e: React.MouseEvent) => {
        if (props.onClose) {
            props?.onClose();

            SoundManager.playSound("ui/buttonClick");
        }
    };

    const handleBack = (_e: React.MouseEvent) => {
        if (props.onBack) {
            props?.onBack();

            SoundManager.playSound("ui/buttonClick");
        }
    };

    useEffect(() => {
        SoundManager.musicFiltered = true;
        return () => {
            SoundManager.musicFiltered = false;
        }
    })

    return (
        <div className = "window">
            <div className = "header">
                { props.backEnabled !== false && (
                    <Button
                        className="back-button"
                        onClick={handleBack}
                        square={true}
                        size={"medium"}
                        color="purple"
                        text="<"
                    />
                )}
                <h3>{ props.title }</h3>
                { props.closeEnabled !== false && (
                    <Button
                        className="close-button"
                        onClick={handleClose}
                        square={true}
                        size={"medium"}
                        color="purple"
                        text="x"
                    />
                )}
            </div>
            { props.children }
        </div>
    );
};

export default Window;
