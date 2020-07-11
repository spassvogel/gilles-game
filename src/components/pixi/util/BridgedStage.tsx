import React from "react";
import { ReactReduxContext, Provider } from 'react-redux';
import { Stage } from '@inlet/react-pixi';

// Contexts are not passed through the reconcilers with the new Context API.
// This means we lose the redux context
// Create a wrapper component that consumes the context and provides it again in the new reconciler context:
// https://github.com/inlet/react-pixi/issues/77
const BridgedStage = (props: React.ComponentProps<typeof Stage>) => {
    const { children, ...restProps } = props;
    return (
        <ReactReduxContext.Consumer>
            {({ store }) => (
                <Stage {...restProps}>
                    <Provider store={store}>
                        {children}
                    </Provider>
                </Stage>
            )}
        </ReactReduxContext.Consumer>
    );
}

export default BridgedStage;
