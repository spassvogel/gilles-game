import * as React from "react";

export interface Props {
    itemsLoaded?: number;
    itemsTotal?: number;
}

export default class Indicator extends React.Component<Props> {
    public render() {
        return <div> { `Loading (${((this.props.itemsLoaded || 0) / (this.props.itemsTotal || 0 )) * 100})%`} </div>;
    }
}
