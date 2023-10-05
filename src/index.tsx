import { createRoot } from 'react-dom/client';
import * as Random from './utils/random';
import { TextManager } from './global/TextManager';
import { loadResourceAsync } from 'utils/pixiJs';
import { ErrorBoundary } from 'react-error-boundary';
import Game from 'components/Game';
import ErrorModal from 'components/ui/error/ErrorModal';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';

const initialize = async () => {
  const texts = await loadResourceAsync(`${process.env.PUBLIC_URL}/lang/en.json`);
  if (texts) {
    TextManager.init(texts.data);
  }
  Random.init('GILLESROX2');

  const root = createRoot(document.getElementById('root')  as HTMLElement);
  root.render((
    <ErrorBoundary FallbackComponent={ErrorModal} >
      <Game />
    </ErrorBoundary>
  ));
};

initialize();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

