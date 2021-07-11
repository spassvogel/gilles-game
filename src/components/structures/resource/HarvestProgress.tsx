import React from 'react';
import { TickingProgressbar } from "components/ui/common/progress";
import { Direction } from "components/ui/common/progress/TickingProgressbar";
import { Structure } from "definitions/structures";
import { TextManager } from "global/TextManager";
import { useEngine } from "hooks/store/engine";
import { HARVEST_INTERVAL } from "mechanics/gameTick/harvest";
import { formatDuration } from "utils/format/time";

interface Props {
    structure: Structure;
}

const HarvestProgress = (props: Props) => {
    const engine = useEngine();

    const delta = HARVEST_INTERVAL - (Date.now() - engine.lastProducedUpdate);

    return (
         <TickingProgressbar
            className="harvest"
            direction={Direction.decreasing}
            label={`${TextManager.get("ui-structure-resource-next-harvest", {
                time: formatDuration(delta)
            })}`}
            progress={delta / HARVEST_INTERVAL}
        />
    )
}

export default HarvestProgress;