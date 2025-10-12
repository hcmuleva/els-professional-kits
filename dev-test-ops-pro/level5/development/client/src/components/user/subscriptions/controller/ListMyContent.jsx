import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getUsercontents } from '../../../../services/content';
import CreateContent from './CreateContent';

export default function ListMyContent({authorData,userId}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsercontents(userId); // assuming this method uses userId to fetch created contents
        setData(response?.data || []);
      } catch (error) {
        console.error('Error fetching user contents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const columns = [
    {
      title: 'Topic',
      dataIndex: ['attributes', 'topic'],
      key: 'topic',
    },
    {
      title: 'Subtopic',
      dataIndex: ['attributes', 'subtopic'],
      key: 'subtopic',
    },
    {
      title: 'Content Type',
      dataIndex: ['attributes', 'contenttype'],
      key: 'contenttype',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary">Assign Plan</Button>
          <Button type="default">Users</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        loading={loading}
      />
    </div>
  );
}
