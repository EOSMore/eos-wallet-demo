import React, { Component } from 'react';
import { actions, connect } from 'mirrorx';
import moment from 'moment';
import { PullToRefresh, WhiteSpace, List, Icon } from 'antd-mobile';
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import TransactionMessage from './message';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidMount() {
    const { wallet, param } = this.props;
    if (wallet.name) {
      this.getData({ name: wallet.name, param });
    }
    actions.header.set({
      title: '交易记录',
      right: null,
      left: <Icon onClick={() => actions.routing.push('/')} type="left" />
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.wallet, this.props.wallet)) {
      this.getData({ name: nextProps.wallet.name, param: nextProps.param });
    }
  }
  getData = async ({ name, param }) => {
    await actions.transactions.getList({ name, ...param });
  };
  handleRefresh = async () => {
    const { param, wallet } = this.props;
    this.setState({
      refreshing: true
    });
    await actions.transactions.getList({ name: wallet.name, ...param, skip_seq: param.skip_seq + 10 });
    this.setState({
      refreshing: false
    });
  };
  render() {
    const { refreshing } = this.state;
    const { data, wallet } = this.props;
    return (
      <div>
        <PullToRefresh
          direction="up"
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
          indicator={{
            activate: "上拉加载更多",
            deactivate: "上拉加载更多",
            finish: "完成加载"
          }}
        >
          <WhiteSpace size="lg" />
          {data && data.map(transaction => (
            <div key={transaction.id}>
              <List renderHeader={() => moment.utc(transaction.expiration).fromNow()}>
                {transaction.messages.map((message, index) => (
                  <TransactionMessage key={index} message={message} name={wallet.name}/>
                ))}
              </List>
              <WhiteSpace size="lg" />
            </div>
          ))}
        </PullToRefresh>
      </div>
    );
  }
}

export default connect(({ wallets, transactions }) => {
  const { list, selected } = wallets;
  const { lists, params } = transactions;
  const wallet = find(list, { name: selected }) || {};
  return {
    wallet,
    data: wallet.name ? lists[wallet.name] : [],
    param: wallet.name ? params[wallet.name] : { skip_seq: 0, num_seq: 10 }
  };
})(Transactions);

