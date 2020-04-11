import "components/ui/css/common/icon.css";
import "components/ui/resources/css/resourcesbox.css";
import SquareIconButton from "components/ui/buttons/SquareIconButton";
import * as React from "react";

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
            props.onClose();
        }
    };
    const handleBack = (e: React.MouseEvent) => {
        if (props.onBack) {
            props.onBack();
        }
    };

    let BackButton = null;
    if (props.backEnabled !== false) {
         BackButton = <SquareIconButton className = "back-button" onClick = { handleBack } text = "<"/>;

    }

    let CloseButton = null;
    if (props.closeEnabled !== false) {
        CloseButton = <SquareIconButton className = "close-button" onClick = { handleClose } text = "x"/>;
    }

    return <div className = "window">
        <div className = "header">
            { BackButton }
            <h3>{ props.title }</h3>
            { CloseButton }
        </div>
        { props.children }
    </div>;
};

export default Window;
