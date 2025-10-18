import React from 'react'
import TempleAdmin from '../admin/TempleAdmin'
import { Tabs } from 'antd';
import TempleMgmt from './TempleMgmt';
import UserRoleChange from './UserRoleChange';

export default function TempleSuperAdmin({id}) {
  const onChange = key => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'TempleDetail',
      children: <TempleAdmin id={id}/>,
    },
    {
      key: '2',
      label: 'TempleMmgmt',
      children: <TempleMgmt/>,
    },
    {
      key: '3',
      label: 'UserRole',
      children: <UserRoleChange />,
    },
  ];
return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
  
}
