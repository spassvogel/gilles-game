import * as React from "react";
import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { useAdventurerState } from "hooks/store/adventurers";

export interface Props {
    adventurerId: string;
}

const Health = (props: Props) => {
    const { adventurerId } = props;
    const { health } = useAdventurerState(adventurerId);

    return (
        <div className="health">
            Health
            <PlainProgressbar
                progress={health / 100}
                label={`${health.toFixed(2)}%`}
                variation="health"
            />
        </div>
    )
}
export default Health;
