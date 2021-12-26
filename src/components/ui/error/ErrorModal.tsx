import { restartGame } from "index";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { FallbackProps } from "react-error-boundary";
import { getStoredState } from "redux-persist";
import { persistConfig } from "utils/configureStore";
import { InfoWindow } from "../modals/InfoWindow";
import Tab from "../tabs/Tab";
import Tabstrip from "../tabs/Tabstrip";
import "./styles/errorModal.scss";

const ErrorModal = (props: FallbackProps) => {
  const {error, resetErrorBoundary} = props;
  const [selectedTabId, setSelectedTabId] = useState<"stack" | "store">("stack");
  const [state, setState] = useState<string>("(no store state found)");

  const handleTabSelected = (tabId: typeof selectedTabId) => {
    setSelectedTabId(tabId);
  }

  const handleReset = () => {
    restartGame();
    localforage.clear();
    resetErrorBoundary();
  }

  useEffect(() => {
    (async () => {
      const initState = await getStoredState(persistConfig)
      setState(JSON.stringify(initState, undefined, 2))
    })()
  })

  return (
    <div className="error">
      <InfoWindow className="error-modal" title="">
        <h2 className="title" >
          Something went horribly wrong
        </h2>
        <div className="content">
          <pre>{error.message}</pre>

        <Tabstrip className="tabs" onTabSelected={handleTabSelected} activeTab={selectedTabId}>
          <Tab id={"stack"}>Stack</Tab>
          <Tab id={"store"}>Store</Tab>
        </Tabstrip>
        { selectedTabId === "stack" && (
          <pre>{error.stack}</pre>
        )}
        { selectedTabId === "store" && (
          <pre>{state}</pre>
        )}
        <button onClick={handleReset}>Try again</button>
      </div>
      </InfoWindow>
    </div>
  )
}

export default ErrorModal;
