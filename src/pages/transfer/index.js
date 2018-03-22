import React, { Component } from 'react';
import { actions, connect } from 'mirrorx';
import { WingBlank, WhiteSpace, List, InputItem, Button, Modal, Toast } from 'antd-mobile';
import isEqual from "lodash/isEqual";
import { createForm } from 'rc-form';
import compose from 'recompose/compose';

class Transfer extends Component {
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
  handleSubmit = () => {
    const { wallet, balance } = this.props;
    this.props.form.validateFields({ force: true }, async error => {
      if (!error) {
        const maxAmount = parseFloat(balance);
        const values = this.props.form.getFieldsValue();
        if (values.amount < 0.0001) {
          Toast.fail('最少 0.0001 EOS');
        } else if (values.amount > maxAmount) {
          Toast.fail(`最多 ${maxAmount} EOS`);
        } else {
          Modal.prompt('密码', '请输入钱包密码', async password => {
            const keyProvider = await actions.wallets.auth({ wallet, password });
            if (!keyProvider) {
              Toast.fail('密码错误');
            } else {
              Toast.loading('', 0);
              const result = await actions.wallets.transfer({ wallet, keyProvider, ...values });
              if (result) {
                Toast.success('转账成功');
                actions.routing.push('/');
              } else {
                Toast.fail('转账失败');
              }
            }
          }, 'secure-text');
        }
      }
    });
  };
  render() {
    const { balance, form } = this.props;
    const { getFieldProps, getFieldError } = form;
    const maxAmount = parseFloat(balance);
    return (
      <div>
        <WhiteSpace/>
        <form>
          <List>
            <InputItem
              placeholder="填写对方账户名称"
              error={!!getFieldError('name')}
              {...getFieldProps('name', {
                rules: [{
                  required: true, message: '请填写对方账户名称'
                }, {
                  min: 6, message: '至少7位'
                }, {
                  pattern: /^[a-z1-5.]+$/, message: '账户名称只能由1-5，a-z以及英文句号组成'
                }]
              })}
            >
              对方账号名称
            </InputItem>
            <InputItem
              placeholder={`最多能转${maxAmount} EOS`}
              type="money"
              extra="EOS"
              moneyKeyboardAlign="left"
              error={!!getFieldError('amount')}
              {...getFieldProps('amount', {
                rules: [{
                  required: true, message: '请填写转账EOS数'
                }, {
                  min: 0.0001, message: '最少转0.0001EOS'
                }]
              })}
            >
              转账金额
            </InputItem>
            <InputItem
              placeholder="留言信息"
              error={!!getFieldError('message')}
              {...getFieldProps('message', {})}
            >
              留言
            </InputItem>
          </List>
          <WhiteSpace/>
          <WingBlank>
            <Button type="primary" onClick={this.handleSubmit}>转账</Button>
          </WingBlank>
        </form>
      </div>
    );
  }
}

const enhance = compose(
  connect(({ wallets }) => {
    const { list, selected, balances } = wallets;
    const wallet = list[selected];
    const balance = (wallet && wallet.name && balances) ? balances[wallet.name] : '';
    return {
      wallet: wallet || {},
      balance
    };
  }),
  createForm()
);

export default enhance(Transfer);
