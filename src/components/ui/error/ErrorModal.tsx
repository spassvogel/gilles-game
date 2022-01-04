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
  const {error, resetErrorBoundary } = props;
  const [selectedTabId, setSelectedTabId] = useState<"stack" | "store">("stack");
  const [state, setState] = useState<string>("(no store state found)");

  useEffect(() => {
    (async () => {
      const initState = await getStoredState(persistConfig)
      setState(JSON.stringify(initState, undefined, 2))
    })()
  })

  // if (process.env.NODE_ENV !== "production") {
  //   resetErrorBoundary();
  //   return null;
  // }

  const handleTabSelected = (tabId: typeof selectedTabId) => {
    setSelectedTabId(tabId);
  }

  const handleReset = () => {
    localforage.clear();
    window.location.reload();
    // restartGame();
  }


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
        <form action="https://formspree.io/f/mayvnnbp" method="POST" className="buttons">
          <input type="hidden" name="message" value={error.message} />
          <input type="hidden" name="stack" value={error.stack} />
          <input type="hidden" name="store" value={state} />
          <button onClick={handleReset}>Reset game</button>
          <button type="submit">Report bug</button>
        </form>
      </div>
      </InfoWindow>
    </div>
  )
}

export default ErrorModal;
