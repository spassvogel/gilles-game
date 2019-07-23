import { AppContext } from "components/App";
import { MediaItem } from "components/preloading/Preloader";
import { ContextInfo, ContextType } from "constants/context";
import { Windows } from "constants/ui";
import * as React from "react";

// Sharing context within the entire App
export interface AppContextProps {
    onContextualObjectActivated: (type: ContextType, info: ContextInfo, origin: React.RefObject<any>, originRect: ClientRect) => void;
    onOpenWindow: (window: Windows) => void;
    media: MediaItem[];
}

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
};
