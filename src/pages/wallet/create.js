import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Steps, WingBlank, WhiteSpace, List, InputItem, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';

class WalletCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      data: {},
      wallet: {},
      mnemonic: ''
    };
  }
  next = () => {
    const { current, data } = this.state;
    this.props.form.validateFields({ force: true }, async error => {
      switch (current) {
        case 0:
          if (!error) {
            const values = this.props.form.getFieldsValue();
            this.setState({
              current: current + 1,
              data: { ...data, ...values }
            });
          }
          break;
        case 1:
          if (!error) {
            const values = this.props.form.getFieldsValue();
            const submitValues = { ...data, ...values };
            Toast.loading('', 0);
            try {
              const { wallet, mnemonic } = await actions.wallets.create(submitValues);
              this.setState({
                current: current + 1,
                data: submitValues,
                wallet,
                mnemonic
              });
              Toast.hide();
            } catch (e) {
              Toast.fail(e.message);
            }
          }
          break;
        case 2:
          actions.routing.push('/');
          break;
        default:
          break;
      }
    });
  };
  render() {
    const { current, wallet, mnemonic } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <WhiteSpace size="lg"/>
        <form>
          <WingBlank>
            <Steps current={current} direction="horizontal" size="small">
              <Steps.Step key={0} title="设置密码" />
              <Steps.Step key={1} title="账号名称" />
              <Steps.Step key={2} title="钱包信息" />
            </Steps>
          </WingBlank>
          <WhiteSpace/>
          <List>
            {current === 0 &&
              <InputItem
                placeholder="给钱包设置一个密码，至少8位"
                type="password"
                error={!!getFieldError('password')}
                {...getFieldProps('password', {
                  rules: [{
                    required: true, message: '请设置钱包密码'
                  }, {
                    min: 8, message: '至少8位'
                  }]
                })}
              >
                钱包密码
              </InputItem>
            }
            {current === 1 &&
              <InputItem
                placeholder="由1-5，a-z以及.组成，至少7位"
                error={!!getFieldError('name')}
                {...getFieldProps('name', {
                  rules: [{
                    required: true, message: '请设置账户名称'
                  }, {
                    min: 6, message: '至少7位'
                  }, {
                    pattern: /^[a-z1-5.]+$/, message: '账户名称只能由1-5，a-z以及英文句号组成'
                  }]
                })}
              >
                账号名称
              </InputItem>
            }
            {current === 2 && [
                <List.Item key="name" extra={wallet.name}>名称</List.Item>,
                <List.Item key="mnemonic">
                  助记词（请手动记下来，多备份在多处）<List.Item.Brief>{mnemonic}</List.Item.Brief>
                </List.Item>
              ]
            }
          </List>
          <WhiteSpace/>
          <WingBlank>
            <Button type="primary" onClick={this.next}>
              {current < 2 ? '下一步' : '完成'}
            </Button>
          </WingBlank>
        </form>
      </div>
    );
  }
}

export default createForm()(WalletCreate);
