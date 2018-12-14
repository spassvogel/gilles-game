import * as React from "react";
import { AppContext, AppContextProps } from "src/components/App";

export const withAppContext = <P extends {}>(Component: React.ComponentType<P>) =>
class WithContext extends React.PureComponent<P & AppContextProps> {
    public render() {
        return (
            <AppContext.Consumer>
                {(context: any) => <Component {...this.props} {...context} />}
            </AppContext.Consumer>
        );
    }
};
