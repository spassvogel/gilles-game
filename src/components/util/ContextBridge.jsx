import React from "react";
import { ReactReduxContext, Provider } from 'react-redux';

// Contexts are not passed through the reconcilers with the new Context API. Create a wrapper component that consumes the context and provides it again in the new reconciler context:
// https://github.com/inlet/react-pixi/issues/77
const BridgedStage = ({ children }) => {
    return (
        <ReactReduxContext.Consumer>
          {(value) => {
              const store = value?.store;
              console.log(store)
              return (<Provider store={store}>{children}</Provider>)
          }}
        </ReactReduxContext.Consumer>
    );
}
  

export default BridgedStage;
