import React, { Component } from 'react';
import { actions } from 'mirrorx';
import isEmpty from 'lodash/isEmpty';
import { WingBlank, WhiteSpace, List, InputItem, Radio, TextareaItem, Button, Modal, Icon, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';

class WalletImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      account_names: [],
      password: '',
      seed: ''
    };
  }
  componentWillMount() {
    actions.wallets.check(false);
  }
  componentDidMount() {
    actions.header.set({
      title: '导入钱包',
      right: null,
      left: <Icon onClick={() => actions.routing.goBack()} type="left" />
    });
  }
  handleSubmit = () => {
    this.props.form.validateFields({ force: true }, async error => {
      if (!error) {
        const { mnemonic, password } = this.props.form.getFieldsValue();
        Toast.loading("", 0);
        const { account_names, seed } = await actions.wallets.importFromMnemonic(mnemonic);
        if (isEmpty(account_names)) {
          Toast.fail("无效助记词");
        } else {
          Toast.hide();
          this.setState({
            visible: true,
            account_names,
            password,
            seed
          });
        }
      }
    });
  };
  handleImport = async name => {
    const { password, seed } = this.state;
    const isNew = await actions.wallets.importAccount({ name, password, seed });
    if (!isNew) {
      Modal.alert("钱包已存在", "是否设置为新密码？", [
        { text: '取消', onPress: () => actions.routing.push("/") },
        { text: "确定", onPress: async () => {
          Toast.loading("", 0);
          await actions.wallets.setPassword({ name, seed, password });
          Toast.success("设置成功");
          actions.routing.push("/");
        }}
      ]);
    } else {
      Toast.success("导入成功");
      actions.routing.push('/');
    }
  };
  render() {
    const { visible, account_names } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <WhiteSpace size="lg"/>
        <form>
          <List>
            <TextareaItem
              error={!!getFieldError('mnemonic')}
              placeholder="填写备份助记词，以空格隔开"
              rows={4}
              {...getFieldProps('mnemonic', {
                rules: [{
                  required: true, message: '请填写助记词'
                }, {
                  min: 10, message: '最少10位'
                }]
              })}
            />
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
          </List>
          <WhiteSpace/>
          <WingBlank>
            <Button type="primary" onClick={this.handleSubmit}>导入</Button>
          </WingBlank>
        </form>
        <Modal visible={visible} transparent title="选择要导入的钱包">
          <List>
            {account_names.map(account_name => (
              <Radio.RadioItem onChange={() => this.handleImport(account_name)} key={account_name}>{account_name}</Radio.RadioItem>
            ))}
          </List>
        </Modal>
      </div>
    );
  }
}

export default createForm()(WalletImport);
