import React from 'react';
import ReactDOM from 'react-dom';
import App from "components/App";
import { Persistor } from 'redux-persist';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let persistor: Persistor = null;

  ReactDOM.render(<App persistor={persistor} />, div);
});