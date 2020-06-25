import React, { useEffect, useState } from 'react';
import { ContextType } from 'constants/context';
import { TooltipManager, Context } from 'global/TooltipManager';
import { TextManager } from 'global/TextManager';
import Tooltip from './Tooltip';
import ItemContext from './context/ItemContext';
import './css/contextTooltip.css';


// A contextual popup showing what you just clicked. Can be an Item
const ContextTooltip = () => {

    const [selectedContext, setSelectedContext] = useState<Context | undefined>();

    const tooltipUpdated = (context: Context | undefined) => {
        setSelectedContext(context);
    }

    useEffect(() => {
        TooltipManager.addEventListener(TooltipManager.EVENT_CONTEXT_UPDATED, tooltipUpdated);
        return () => {
            TooltipManager.removeEventListener(TooltipManager.EVENT_CONTEXT_UPDATED, tooltipUpdated);
        }
    }, []);
    if (!selectedContext) { return null; }

    const { info, type } = selectedContext;
    const renderContent = () => {
        switch (type) {
            case ContextType.item:
            default:
                return <ItemContext info={info} />;
        }
    }

    const name = TextManager.getItemName(info.item);

    return (
        <Tooltip referenceRect={selectedContext.referenceRect}>
            <div className = "context-tooltip">
                <div>{name}</div>
                {renderContent()}
            </div>
        </Tooltip>
    )
}
export default ContextTooltip;
