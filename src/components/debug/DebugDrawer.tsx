import { useState } from 'react';
import useKey from '@rooks/use-key';
import './styles/debugDrawer.scss';
import DebugView from './DebugView';
import { useSettings } from 'hooks/store/settings';

const DebugDrawer = () => {
  const [open, setOpen] = useState(false); 
  const settings = useSettings();
  
  useKey('~', () => {
    setOpen(!open && settings.debugEnableDebugDrawer);
  });
  
  if (!open) return null;
  return (
    <div className="debug-drawer">
      <DebugView />
    </div>
  );
};

export default DebugDrawer;

