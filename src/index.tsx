import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ResourceView from './components/ResourceView';

ReactDOM.render(
    <ResourceView />,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
