import { Route, Switch } from 'react-router-dom';
import { getTownLink, getWorldLink } from 'utils/routing';
import DebugContextTown from './DebugContextTown';
import './styles/debugContext.scss';

const DebugContext = () => {

  return (
    <div className="debug-context">
       <Switch>
        <Route path={getWorldLink()}>
          in world
        </Route>
        <Route path={getTownLink()}>
          <DebugContextTown />
        </Route>
      </Switch>
    </div>
  );
};

export default DebugContext;
