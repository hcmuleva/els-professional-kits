import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { createUser } from '../api/user';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createUser({
        username: values.username,
        email: values.email,
        mobile_number: values.mobile_number,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        gender: values.gender
      });
      message.success('User added successfully!');
      navigate('/users');
    } catch (error) {
      message.error('Failed to add user: ' + (error.message || 'Something went wrong'));
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#f0f2f5'
    }}>
      <div style={{
        width: '400px', padding: '40px', background: '#fff',
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1a73e8' }}>
          Add New User
        </h2>
        <Form name="add-user" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input Username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="mobile_number"
            rules={[{ required: true, message: 'Please input Mobile Number!' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Mobile Number"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: 'Please input First Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="First Name"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: 'Please input Last Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Last Name"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: 'Please select Gender!' }]}
          >
            <Select placeholder="Select Gender" style={{ height: '40px', borderRadius: '4px' }}>
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%', height: '40px', borderRadius: '4px',
                background: '#1a73e8', border: 'none'
              }}
            >
              Add User
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a href="/users" style={{ color: '#1a73e8' }}>
              Back to User List
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddUser;