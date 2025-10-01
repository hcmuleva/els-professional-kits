import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getUsers } from '../api/user';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users: ' + (error.message || 'Something went wrong'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Mobile Number', dataIndex: 'mobile_number', key: 'mobile_number' },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  ];

  return (
    <div style={{
      padding: '20px', maxWidth: '1200px', margin: '0 auto', background: '#fff',
      borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#1a73e8', margin: 0 }}>User List</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/add-user')}
          style={{ background: '#1a73e8', border: 'none', borderRadius: '4px' }}
        >
          Add User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        style={{ background: '#fff', borderRadius: '4px' }}
      />
    </div>
  );
};

export default UserList;