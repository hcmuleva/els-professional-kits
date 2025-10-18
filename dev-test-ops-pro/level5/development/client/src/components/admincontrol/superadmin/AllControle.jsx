import React from 'react';
import { Tabs } from 'antd';
import CreateController from './CreateController';
import Role from './Role';
import Permission from './Permission';
import CategoryMgmt from './category/CategoryMgmt';
const AllControle = () => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: 'Category',
        key: '1',
        children: <CategoryMgmt/>,
      },
      {
        label: 'Role',
        key: '2',
        children: <Role/>,
      },
      {
        label: 'Permission',
        key: '3',
        children: <Permission/>,
      },
      
    ]}
  />
);
export default AllControle;