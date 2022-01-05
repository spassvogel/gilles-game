import React, { useState } from 'react';
import { Props as TabProps } from './Tab';
import { SoundManager } from 'global/SoundManager';
import './styles/tabstrip.scss';

export interface Props<T extends string> {
  className?: string;
  children: React.ReactElement<TabProps<T>>[] |  React.ReactElement<TabProps<T>>;
  activeTab?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<Element>;
  onTabSelected?: (tabId: T) => void;
}

const Tabstrip = <T extends string> (props: Props<T>) => {
  const { activeTab = null, onClick } = props;
  // used in autocollapse
  const [open, setOpen] = useState(false);

  if (!activeTab && props.children && props.children) {
    //activeTab = props.children[0].props.id;
  }
  const className = `${props.className}${(props.disabled ? ' disabled' : '')}`;

  const handleTabClick = (tabId: T) => {
    if (props.onTabSelected && props.disabled !== true) {
      props.onTabSelected(tabId);
    }
  };

  const children = React.Children.map(props.children, (child: React.ReactElement<TabProps<T>>) => {
    const clone: React.ReactElement<TabProps<T>> = React.cloneElement(child, {
      active: child.props.id === activeTab,
      onClick: () => { handleTabClick(child.props.id); },
    });
    return clone;
  });

  const handleClick = (e: React.MouseEvent<Element>) => {
    SoundManager.playSound('ui/buttonClick');
    onClick?.(e);
    setOpen(!open);
  };

  return (
    <>
      <ul className={`tabstrip ${className ?? ''}`} onClick={handleClick}>
        <input type="checkbox" className="open" id="open" checked={open} onChange={() => setOpen(!open)} />
        {children}
      </ul>
    </>
  );
};

export default Tabstrip;
