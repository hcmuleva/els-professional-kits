import React from 'react'
import UserContentList from './UserContentList'
import { Tabs } from 'antd';
import GetSubcategories from './GetSubcategories';
import ManageSubscriptions from './ManageSubscriptions';

export default function SubscriptionController() {
  const onChange = key => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Subscription',
      children: <UserContentList/>,
    },
    {
      key: '2',
      label: 'Subscribe',
      children: <GetSubcategories/>,
    },
    {
      key: '3',
      label: 'manage',
      children: <ManageSubscriptions/>,
    }]
  return (
    <div>
      
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}
