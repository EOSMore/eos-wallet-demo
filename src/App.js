import React, { Component } from 'react';
import { Router, Route } from 'mirrorx';
import BasicLayout from './BasicLayout';
import './models';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Route path="/" component={BasicLayout} />
        </Router>
      </div>
    );
  }
}

export default App;
