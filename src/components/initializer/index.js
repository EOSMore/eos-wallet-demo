import React, { Component } from 'react';
import { actions } from 'mirrorx';

class Initializer extends Component {
  componentWillMount() {
    actions.wallets.check();
  }
  render() {
    const { children, ...rest } = this.props;
    return React.cloneElement(children, rest);

  }
}

export default Initializer;
