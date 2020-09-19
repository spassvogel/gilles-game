import Window, { Props } from "components/ui/window/Window";
import * as React from "react";
import "components/ui/window/styles/window.scss";

export const withWindow = <TWrappedComponentProps extends Props>(WrappedComponent: React.ComponentType<TWrappedComponentProps>) => {
    return class WithWindow extends React.Component<TWrappedComponentProps> {

        public render() {
            return <Window { ...this.props } >
                <WrappedComponent { ...this.props } />
            </Window>;
        }
    };
};
