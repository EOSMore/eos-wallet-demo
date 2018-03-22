import React, { Component } from 'react';
import {actions} from "mirrorx";
import { Icon } from 'antd-mobile';
import { WalletCreate } from '../wallet';

class Guide extends Component {
  componentDidMount() {
    actions.header.set({
      title: '创建钱包',
      right: <span onClick={() => actions.routing.push('/import')}>导入钱包</span>,
      left: <Icon onClick={() => actions.routing.goBack()} type="left" />
    });
  }
  render() {
    return (
      <div>
        <WalletCreate/>
      </div>
    );
  }
}

export default Guide;
