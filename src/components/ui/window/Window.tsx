import "components/ui/css/common/icon.css";
import "components/ui/resources/css/resourcesbox.css";
import * as React from "react";

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
        BackButton = <div className = "ui-button back-button" onClick = { handleBack } > { "<" } </div>;
    }

    let CloseButton = null;
    if (props.closeEnabled !== false) {
        CloseButton = <div className = "ui-button close-button" onClick = { handleClose }>x</div>;
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
