import * as React from "react";
import { SoundManager, Sound } from 'global/SoundManager';
import Button from '../buttons/Button';
import "components/ui/styles/icon.scss";

// todo: refactor using WindowManager [30/03/2020]
export interface Props {
    title: string;
    backEnabled?: boolean;
    closeEnabled?: boolean;
    onClose?: () => void;
    onBack?: () => void;
}

type AllProps = Props;

/**
 *
 */
const Window: React.FunctionComponent<AllProps> = (props) => {

    const handleClose = (e: React.MouseEvent) => {
        if (props.onClose) {
            props?.onClose();

            SoundManager.playSound(Sound.buttonClick);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        if (props.onBack) {
            props?.onBack();

            SoundManager.playSound(Sound.buttonClick);
        }
    };

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
