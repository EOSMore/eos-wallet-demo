import React from 'react';
import isEqual from 'lodash/isEqual';
import divide from 'lodash/divide';
import floor from 'lodash/floor';
import { List } from 'antd-mobile';
import sponsorIcon from '../../assets/sponsor.svg';
import moneyBagIcon from '../../assets/money_bag.svg';

const Item = List.Item;
const Brief = Item.Brief;

export default ({ message, name }) => {
  if (isEqual(message.type, 'transfer')) {
    if (isEqual(message.data.from, name)) {
      //转出
      return (
        <Item
          multipleLine
          thumb={sponsorIcon}
          extra={<span style={{ color: '#ff4d4f' }}>-{floor(divide(message.data.amount, 10000), 4)} EOS</span>}
        >
          {message.data.to}<Brief>{message.data.memo}</Brief>
        </Item>
      );
    }
    return (
      <Item
        multipleLine
        thumb={moneyBagIcon}
        extra={<span style={{ color: '#13c2c2' }}>+{floor(divide(message.data.amount, 10000), 4)} EOS</span>}
      >
        {message.data.from}<Brief>{message.data.memo}</Brief>
      </Item>
    );
  } else {
    return (
      <Item>
        交易类型<Brief>{message.type}</Brief>
      </Item>
    );
  }
};
