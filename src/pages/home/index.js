import React, { Component } from 'react';
import { connect, actions } from 'mirrorx';
import isEqual from 'lodash/isEqual';
import { Card, WingBlank, WhiteSpace, Tag } from 'antd-mobile';
import walletIcon from '../../assets/wallet.svg';

class Home extends Component {
  componentDidMount() {
    const { wallet } = this.props;
    if (wallet.name) {
      actions.wallets.getBalance(wallet.name);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.wallet, this.props.wallet)) {
      actions.wallets.getBalance(nextProps.wallet.name);
    }
  }
  render() {
    const { wallet, balance } = this.props;
    return (
      <WingBlank>
        <WhiteSpace/>
        <Card>
          <Card.Header
            title={<div><span style={{ fontSize: 10, color: "#108ee9"}}>当前钱包</span>{wallet.name}</div>}
            thumb={walletIcon}
            thumbStyle={{ width: 60, height: 60 }}
            extra={<Tag selected>切换钱包</Tag>}
          />
          <Card.Body>
            <div>账户余额： {balance}</div>
          </Card.Body>
        </Card>
      </WingBlank>
    );

  }
}

export default connect(({ wallets }) => {
  const { list, selected, balances } = wallets;
  const wallet = list[selected];
  return {
    wallet: wallet || {},
    balance: (wallet && wallet.name && balances) ? balances[wallet.name] : ''
  };
})(Home);
