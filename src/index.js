import React from 'react';
import { render } from 'mirrorx';
import './index.less';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

render(<App />, document.getElementById('root'));
registerServiceWorker();
