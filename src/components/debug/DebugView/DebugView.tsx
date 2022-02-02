import { useState } from 'react';
import Button from 'components/ui/buttons/Button';
import DebugItems from '../DebugItems';
import DebugSprites from '../DebugSprites/DebugSprites';
import './styles/debugView.scss';

const allPages = ['items',  'sprites'] as const;
type Page = typeof allPages[number];

const DebugView = () => {
  const [page, setPage] = useState<Page>('items');

  return (
    <div className="debug">
      <ul className="menu">
        <li>
          <Button onClick={() => setPage('items')} color={page === 'items' ? 'green' : 'blue'}> Items</Button>
        </li>
        <li>
          <Button onClick={() => setPage('sprites')} color={page === 'sprites' ? 'green' : 'blue'}> Sprites</Button>
        </li>
      </ul>
      { page === 'items' && <DebugItems />}
      { page === 'sprites' && <DebugSprites />}
    </div>
  );
};

export default DebugView;
