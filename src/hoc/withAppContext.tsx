import { AppContext, AppContextProps } from "components/App";
import * as React from "react";

// export const withAppContext = <P extends {}>(Component: React.ComponentType<P>) =>
// class WithContext extends React.Component<P & AppContextProps> {
//     public render() {
//         return (
//             <AppContext.Consumer>
//                 {(context: any) => <Component {...this.props as P} {...context} />}
//             </AppContext.Consumer>
//         );
//     }
// };
// export const withAppContext = <P extends object>(
//     Component: React.ComponentType<P>
//   ): React.FC<P & AppContextProps> => (props: AppContextProps) => {
//     return <AppContext.Consumer>
//         {(context: any) => <Component {...props as P} {...context} />}
//     </AppContext.Consumer>;
// };

export const withAppContext = <TWrappedComponentProps extends AppContextProps>(WrappedComponent: React.ComponentType<TWrappedComponentProps>) => {
    type WrappedComponentPropsExceptProvided = Exclude<keyof TWrappedComponentProps, keyof AppContextProps>;
    type ForwardedProps = Pick<TWrappedComponentProps, WrappedComponentPropsExceptProvided>;
    return class WithContext extends React.Component<ForwardedProps> {
        public render() {
            return (
                <AppContext.Consumer>
                    {(context: any) => <WrappedComponent {...this.props } {...context} />}
                </AppContext.Consumer>
            );
        }
    };
}