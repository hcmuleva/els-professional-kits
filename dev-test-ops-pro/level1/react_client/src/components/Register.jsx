import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        mobile_number: values.mobile_number,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        gender: values.gender,
      });
      message.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed: ' + (error.message || 'Something went wrong'));
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
          Register
        </h2>
        <Form name="register" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
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
            rules={[{ required: true, message: 'Please input your Mobile Number!' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Mobile Number"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: 'Please input your First Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="First Name"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Last Name"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{ height: '40px', borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: 'Please select your Gender!' }]}
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
              Register
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a href="/login" style={{ color: '#1a73e8' }}>
              Already have an account? Login
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;