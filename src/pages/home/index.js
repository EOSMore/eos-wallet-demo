import React, { Component } from 'react';
import { connect, actions } from 'mirrorx';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import { Card, WingBlank, WhiteSpace, Button, Grid, Modal, Drawer, List, Radio, Toast } from 'antd-mobile';
import walletIcon from '../../assets/wallet.svg';
import transferIcon from '../../assets/transfer.svg';
import lockIcon from '../../assets/lock.svg';
import walletBlackIcon from '../../assets/wallet-black.svg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }
  componentDidMount() {
    const { wallet } = this.props;
    if (wallet.name) {
      actions.wallets.getBalance(wallet.name);
    }
    actions.header.set({
      title: 'More Wallet',
      right: null,
      left: null
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.wallet, this.props.wallet)) {
      actions.wallets.getBalance(nextProps.wallet.name);
    }
  }
  handleDrawerOpenChange = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  };
  changePassword = wallet => {
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
  };
  renderSidebar = () => {
    const { wallets, wallet } = this.props;
    return ([
      <List key="list" renderHeader={() => '选择钱包'}>
        {wallets.map(currentWallet => (
          <Radio.RadioItem
            key={currentWallet.name}
            checked={isEqual(currentWallet.name, wallet.name)}
            onChange={() => {
              Toast.loading("", 0);
              this.handleDrawerOpenChange();
              setTimeout(async () => {
                await actions.wallets.setSelected(currentWallet.name);
                Toast.hide();
              }, 500);
            }}
          >
            {currentWallet.name}
          </Radio.RadioItem>
        ))}
      </List>,
      <WhiteSpace key="space" size="xl"/>,
      <List key="action">
        <List.Item onClick={() => actions.routing.push('/guide')} thumb={walletBlackIcon}>
          创建钱包
        </List.Item>
      </List>
    ]);
  };
  render() {
    const { drawerOpen } = this.state;
    const { wallet, balance } = this.props;
    return (
      <Drawer
        contentStyle={{ paddingTop: 45 }}
        open={drawerOpen}
        position="right"
        onOpenChange={this.handleDrawerOpenChange}
        sidebar={this.renderSidebar()}
        sidebarStyle={{ background: '#fff', width: 200 }}
      >
        <WingBlank>
          <WhiteSpace/>
          <Card>
            <Card.Header
              title={<div><span style={{ fontSize: 10, color: "#108ee9"}}>当前钱包</span>{wallet.name}</div>}
              thumb={walletIcon}
              thumbStyle={{ width: 60, height: 60 }}
              extra={<Button type="ghost" size="small" inline onClick={this.handleDrawerOpenChange}>切换钱包</Button>}
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
            onClick: () => this.changePassword(wallet)
          }]} />
        </WingBlank>
      </Drawer>
    );

  }
}

export default connect(({ wallets }) => {
  const { list, selected, balances } = wallets;
  const wallet = find(list, { name: selected }) || {};
  return {
    wallet,
    wallets: list,
    balance: balances ? balances[selected] : ''
  };
})(Home);
