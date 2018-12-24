import * as React from "react";

export interface Props {
    itemsLoaded?: number;
    itemsTotal?: number;
}

/**
 * Loading indicator
 */
export default class Indicator extends React.Component<Props> {
    public render() {
        const { itemsLoaded, itemsTotal } = this.props;
        return <div> { `Loading (${Math.floor((itemsLoaded || 0) / (itemsTotal || 0 ) * 100)})%`} </div>;
    }
}
