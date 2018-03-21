import React from 'react';
import { render } from 'mirrorx';
import './index.less';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(<App />, document.getElementById('root'));
registerServiceWorker();
