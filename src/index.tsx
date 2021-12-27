import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import * as Random from "./utils/random";
import { TextManager } from "./global/TextManager";
import { loadResourceAsync } from 'utils/pixiJs';
import { ErrorBoundary } from "react-error-boundary";
import Game from "components/Game";
import ErrorModal from "components/ui/error/ErrorModal";
import "./index.css";

const initialize = async () => {
  registerServiceWorker();
  const texts = await loadResourceAsync(`${process.env.PUBLIC_URL}/lang/en.json`);
  if (texts) {
    TextManager.init(texts.data);
  }
  Random.init("GILLESROX2");

  ReactDOM.render((
    <ErrorBoundary FallbackComponent={ErrorModal} >
      <Game />
    </ErrorBoundary>
    ),
    document.getElementById("root") as HTMLElement,
  );
};

initialize();

