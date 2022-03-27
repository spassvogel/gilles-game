import { useState } from 'react';
import useKey from '@rooks/use-key';
import DebugView from './DebugView';
import { useSettings } from 'hooks/store/settings';
import './styles/debugDrawer.scss';

const DebugDrawer = () => {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  useKey('~', () => {
    setOpen(!open && settings.debugEnableDebugDrawer);
  });

  if (!open) return null;
  return (
    <div className="debug-drawer">
      <div className="close" onClick={() => setOpen(false)}>x</div>
      <DebugView />
    </div>
  );
};

export default DebugDrawer;

