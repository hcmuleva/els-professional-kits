import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, CopyOutlined } from '@ant-design/icons';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/users');
    } catch (error) {
      message.error('Login failed: ' + (error.message || 'Invalid credentials'));
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy to clipboard');
    });
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
          Login
        </h2>
        
        {/* Test Credentials Banner */}
        <Alert
          message="Test Credentials"
          description={
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span><strong>Email:</strong> harish@hph.com</span>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />} 
                  size="small" 
                  onClick={() => copyToClipboard('harish@hph.com')}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Password:</strong> welcome</span>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />} 
                  size="small" 
                  onClick={() => copyToClipboard('gdddd')}
                />
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ 
            marginBottom: '20px',
            border: '1px solid #91d5ff',
            backgroundColor: '#e6f7ff'
          }}
        />

        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
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
              Log In
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a href="/register" style={{ color: '#1a73e8' }}>
              Don't have an account? Register
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;