import React, { Component } from 'react';
import { connect, actions } from 'mirrorx';
import isEqual from 'lodash/isEqual';
import { Card, WingBlank, WhiteSpace, Tag, Grid, Modal, Toast } from 'antd-mobile';
import walletIcon from '../../assets/wallet.svg';
import transferIcon from '../../assets/transfer.svg';
import lockIcon from '../../assets/lock.svg';

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
        }, {
          icon: lockIcon,
          text: '修改密码',
          onClick: () => {
            Modal.prompt('密码', '请输入钱包密码', async password => {
              const { seed } = await actions.wallets.auth({ wallet, password });
              if (!seed) {
                Toast.fail('密码错误');
              } else {
                Modal.prompt('设置新密码', '请输入新密码，至少8位', async password => {
                  if (!password || password.length < 8) {
                    Toast.fail('密码至少8位');
                  } else {
                    await actions.wallets.setPassword({ wallet, seed, password });
                    Toast.success('密码修改成功');
                  }
                }, 'secure-text');
              }
            }, 'secure-text');
          }
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
