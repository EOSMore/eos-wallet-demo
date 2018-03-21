import React, { Component } from 'react';
import { connect, actions } from 'mirrorx';
import isEqual from 'lodash/isEqual';
import { Card, WingBlank, WhiteSpace, Tag, Grid } from 'antd-mobile';
import walletIcon from '../../assets/wallet.svg';
import transferIcon from '../../assets/transfer.svg';

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
        <WhiteSpace/>
        <Grid onClick={e => e.onClick()} columnNum={3} hasLine={false} data={[{
          icon: transferIcon,
          text: '转账',
          onClick: () => actions.routing.push('/transfer')
        }]} />
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
