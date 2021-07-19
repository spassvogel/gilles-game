import * as React from "react";
import { TextManager } from 'global/TextManager';
import { PropsWithChildren } from "react";
import { Structure } from "definitions/structures";
import "./styles/upgradeHelpModal.scss"

export interface Props  {
    structure: Structure;
    level: number;
}

const UpgradeHelpModal = (props: PropsWithChildren<Props>) => {
    const { structure, level, children } = props;

    return (
        <div className="structure-upgrade-help-modal">
            <div className="top">
                <h3>{TextManager.get("ui-structure-help-upgrade-title", { structure } )}</h3>
                <div className="level">
                    {TextManager.get("ui-structure-help-upgrade-header-level", {
                        level: level + 2
                    })}
                </div>
            </div>
            <div className="cost">
                
            </div>
            {children}
        </div>
    )
}

export default UpgradeHelpModal;