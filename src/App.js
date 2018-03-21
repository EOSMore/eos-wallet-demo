import React, { Component } from 'react';
import { Router, Route, Switch } from 'mirrorx';
import { NavBar } from 'antd-mobile';
import './models';
import { Guide, Home, Transfer } from './pages';
import { Initializer } from './components';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <NavBar mode="light">MORE</NavBar>
            <Switch>
              <Route exact path="/guide" component={Guide} />
              <Initializer>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/transfer" component={Transfer} />
                </Switch>
              </Initializer>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
