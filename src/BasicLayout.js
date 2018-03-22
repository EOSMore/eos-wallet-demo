import React from 'react';
import { Switch, Route, connect } from 'mirrorx';
import { NavBar } from 'antd-mobile';
import {Guide, Home, Transfer} from "./pages";
import { Initializer } from './components';

const BasicLayout = ({ header }) => (
  <div>
    <NavBar mode="light" rightContent={header.right} leftContent={header.left}>{header.title}</NavBar>
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
);

export default connect(({ header }) => ({
  header
}))(BasicLayout);
