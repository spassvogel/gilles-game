import "components/ui/window/css/window.css";
import Window, { Props } from "components/ui/window/Window";
import * as React from "react";

export const withWindow = <TWrappedComponentProps extends Props>(WrappedComponent: React.ComponentType<TWrappedComponentProps>) => {
    return class WithWindow extends React.Component<TWrappedComponentProps> {

        constructor(props: TWrappedComponentProps) {
            super(props);
        }

        public render() {
            return <Window { ...this.props } >
                <WrappedComponent { ...this.props } />
            </Window>;
        }
    };
};
