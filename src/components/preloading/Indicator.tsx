import * as React from "react";

export interface Props {
    itemsLoaded?: number;
    itemsTotal?: number;
}

/**
 * Loading indicator
 */
const Indicator = (props: Props) =>  {
    const { itemsLoaded, itemsTotal } = props;
    return <div> { `Loading (${Math.floor((itemsLoaded || 0) / (itemsTotal || 0 ) * 100)})%`} </div>;
}

export default Indicator;
