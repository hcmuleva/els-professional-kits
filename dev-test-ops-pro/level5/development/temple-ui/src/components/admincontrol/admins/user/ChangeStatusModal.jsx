// ChangeStatusModal.jsx
import React, { useState } from 'react';
import { Modal, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const statusOptions = [
  'APPROVED', 'UNAPPROVED', 'REJECTED', 'BLOCKED',
  'PENDING', 'ENGAGED', 'SUSPENDED',
];

const ChangeStatusModal = ({ userId, currentStatus, open, onClose, onStatusChange }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleSubmit =  () => {
    try {
   
      onStatusChange?.(newStatus);
      onClose();
    } catch (error) {
      message.error('Failed to update status');
    } finally {
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      title="Change User Status"
    >
      <Select
        value={newStatus}
        onChange={setNewStatus}
        style={{ width: '100%' }}
      >
        {statusOptions.map(status => (
          <Option key={status} value={status}>{status}</Option>
        ))}
      </Select>
    </Modal>
  );
};

export default ChangeStatusModal;
