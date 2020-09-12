import React, { useEffect, useState } from 'react';
import { ContextType } from 'constants/context';
import { TooltipManager, Context } from 'global/TooltipManager';
import { TextManager } from 'global/TextManager';
import ItemContext from '../context/ItemContext';
import { ItemDefinition } from 'definitions/items/types';
import { Resource } from 'definitions/resources';
import ResourceContext from '../context/ResourceContext';
import './styles/contextTooltip.scss';
import Tooltip from '../Tooltip';
import { TraitDefinition } from 'definitions/traits/types';
import TraitContext from '../context/TraitContext';
import { getItemNameClassName } from 'constants/items';


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
            case ContextType.resource: {
                const name = TextManager.getResourceName(info as Resource);
                return (
                    <>
                        <div className="name resource">{name}</div>
                        <ResourceContext info={info as string} />
                    </>
                );
            }
            case ContextType.item: {
                const name = TextManager.getItemName((info as ItemDefinition).item);
                const itemDefinition = info as ItemDefinition;
                const className = `name item ${getItemNameClassName(itemDefinition)}`
                return (
                    <>
                        <div className={`${className}`}>{name}</div>
                        <ItemContext info={itemDefinition} />
                    </>
                );
            }
            case ContextType.trait:
            default: {
                const traitDefinition = info as TraitDefinition;
                const name = TextManager.getTraitName(traitDefinition.trait);
                return (
                    <>
                        <div className="name item">{name}</div>
                        <TraitContext traitDefinition={traitDefinition} />
                    </>
                );
            }
        }
    }

    return (
        <Tooltip referenceRect={selectedContext.referenceRect}>
            <div className = "context-tooltip">
                {renderContent()}
            </div>
        </Tooltip>
    )
}
export default ContextTooltip;
