import { Route, Routes } from 'react-router-dom';
import { getTownLink, getWorldLink } from 'utils/routing';
import DebugContextTown from './DebugContextTown';
import DebugContextWorld from './DebugContextWorld';
import './styles/debugContext.scss';

const DebugContext = () => {

  return (
    <div className="debug-context">
       <Routes>
        <Route path={`${getWorldLink()}/*`} element={(<DebugContextWorld />)} />
        <Route path={getTownLink()} element={(<DebugContextTown />)} />
      </Routes>
    </div>
  );
};

export default DebugContext;
