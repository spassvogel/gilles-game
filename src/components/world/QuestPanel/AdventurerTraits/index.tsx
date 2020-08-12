import React from "react";
import useAdventurerState from 'hooks/store/adventurers';
import { Trait } from 'definitions/traits/types';
import './styles/adventurerTraits.scss';
import { getDefinition } from 'definitions/traits';
import { TextManager } from 'global/TextManager';

interface Props {
    adventurerId: string;
}

const AdventurerTraits = (props: Props) => {
    const adventurer = useAdventurerState(props.adventurerId);

    const renderTrait = (trait: Trait, last: boolean) => {
        const traitDefinition = getDefinition(trait);
        return (
            <li>
                {TextManager.getTraitName(trait)}
                {!last && (', ')}
            </li>
        )
    };

    if (!adventurer?.traits) {
        return null;
    }
    return (
        <ul className="adventurer-traits">
            {adventurer.traits.map((t, i)=> renderTrait(t, i === adventurer.traits!.length -1))}
        </ul>
    )
}

export default AdventurerTraits;