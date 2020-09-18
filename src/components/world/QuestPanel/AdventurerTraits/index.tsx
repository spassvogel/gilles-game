import React, { Fragment } from "react";
import { useAdventurerState } from 'hooks/store/adventurers';
import { Trait } from 'definitions/traits/types';
import './styles/adventurerTraits.scss';
import { getDefinition } from 'definitions/traits';
import { TextManager } from 'global/TextManager';
import { ContextType } from 'constants/context';
import { TooltipManager } from 'global/TooltipManager';

interface Props {
    adventurerId: string;
}

const AdventurerTraits = (props: Props) => {
    const adventurer = useAdventurerState(props.adventurerId);

    const renderTrait = (trait: Trait, last: boolean) => {
        const traitDefinition = getDefinition(trait);
        const handleClick = (event: React.MouseEvent) => {
            const origin = (event.currentTarget as HTMLElement);
            const originRect = origin.getBoundingClientRect();
            TooltipManager.showContextTooltip(ContextType.trait, traitDefinition, originRect);
            event.stopPropagation();
        };
        return (
            <Fragment key={trait}>
                <li onClick={handleClick}>
                    {TextManager.getTraitName(trait)}
                </li>
                {!last && (', ')}
            </Fragment>
        )
    };

    if (!adventurer?.traits) {
        return null;
    }
    return (
        <>
            <p>Traits</p>
            <ul className="adventurer-traits">
                {adventurer.traits.map((t, i)=> renderTrait(t, i === adventurer.traits!.length -1))}
            </ul>
        </>
    )
}

export default AdventurerTraits;