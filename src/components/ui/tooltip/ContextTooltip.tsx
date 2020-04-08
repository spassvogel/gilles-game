import React, { useEffect, useState } from 'react';
import { ContextType } from 'constants/context';
import { TooltipManager, Context } from 'global/TooltipManager';
import { TextManager } from 'utils/textManager';
import ItemContext from 'containers/ui/context/ItemContext';
import Tooltip from './Tooltip';
import './css/contextTooltip.css';

export interface Props {
}

// A contextual popup showing what you just clicked. Can be an Item
const ContextTooltip = (props: Props) => {

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
    let content;
    console.log(JSON.stringify(selectedContext));

    switch (type) {
        case ContextType.item:
        default:
            content = <ItemContext info={info} />;
    }

    const name = TextManager.getItemName(info.item);

    return (
        <Tooltip referenceRect={selectedContext.referenceRect}>
            <div className = "context-tooltip">
                <div>{name}</div>
                {content}
            </div>
        </Tooltip>
    )
}
export default ContextTooltip;
