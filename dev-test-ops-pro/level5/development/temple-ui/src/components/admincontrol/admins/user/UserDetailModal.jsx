// UserDetailModal.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const UserDetailModal = ({ open, onClose, user }) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="User Details">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Name">{user?.first_name} {user?.last_name}</Descriptions.Item>
        <Descriptions.Item label="Father">{user?.father}</Descriptions.Item>
        <Descriptions.Item label="Gotra">{user?.gotra}</Descriptions.Item>
        <Descriptions.Item label="Status">{user?.userstatus}</Descriptions.Item>
        <Descriptions.Item label="Village">{user?.address?.village || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Tehsil">{user?.address?.tehsil || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="District">{user?.address?.district || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="State">{user?.address?.state || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Pincode">{user?.address?.pincode || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserDetailModal;
