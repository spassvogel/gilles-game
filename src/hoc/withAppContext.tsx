import { AppContext } from "components/App";
import * as React from "react";
import { Component, ComponentType } from 'react';

// Sharing context within the entire App
export interface AppContextProps {
    onOpenWindow: (window: React.ReactElement) => void;
    onCloseWindow: () => void;
}

export const withAppContext = <TWrappedComponentProps extends AppContextProps>(WrappedComponent: ComponentType<TWrappedComponentProps>) => {
    type WrappedComponentPropsExceptProvided = Exclude<keyof TWrappedComponentProps, keyof AppContextProps>;
    type ForwardedProps = Pick<TWrappedComponentProps, WrappedComponentPropsExceptProvided>;
    return class WithContext extends Component<ForwardedProps> {
        public render() {
            return (
                <AppContext.Consumer>
                    {(context: any) => <WrappedComponent {...this.props } {...context} />}
                </AppContext.Consumer>
            );
        }
    };
};
