import React from 'react';
import { Switch, Route, connect } from 'mirrorx';
import { NavBar } from 'antd-mobile';
import {Guide, Home, Transfer, WalletImport } from "./pages";
import { Initializer, DocumentTitle } from './components';

const BasicLayout = ({ header }) => (
  <DocumentTitle title={header.title}>
    <div>
      <NavBar mode="light" rightContent={header.right} leftContent={header.left}>{header.title}</NavBar>
      <Switch>
        <Route exact path="/guide" component={Guide} />
        <Route exact path="/import" component={WalletImport} />
        <Initializer>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/transfer" component={Transfer} />
          </Switch>
        </Initializer>
      </Switch>
    </div>
  </DocumentTitle>
);

export default connect(({ header }) => ({
  header
}))(BasicLayout);
