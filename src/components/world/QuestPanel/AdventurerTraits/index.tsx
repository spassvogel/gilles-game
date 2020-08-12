import useAdventurerState from 'hooks/store/adventurers';

interface Props {
    adventurerId: string;
}

const AdventurerTraits = (props: Props) => {
    const adventurer = useAdventurerState(props.adventurerId);

}

export default AdventurerTraits;