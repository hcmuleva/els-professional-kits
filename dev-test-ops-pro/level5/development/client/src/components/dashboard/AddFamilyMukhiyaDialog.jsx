import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, List, Spin, message, Checkbox } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { fetchFamilies } from '../../services/families';

const AddFamilyMukhiyaDialog = ({ 
  visible, 
  onClose, 
  familyId,
  templeId,
  onAddMukhiya 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && familyId) {
      fetchFamilyMembers();
    }
  }, [visible, familyId]);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedUserId(null);
      
      const response = await fetchFamilies(familyId);
      
      if (response?.data?.attributes?.members?.data) {
        setUsers(response.data.attributes.members.data);
      } else {
        setUsers([]);
        message.warning('No members found in this family');
      }
    } catch (err) {
      setError('Failed to fetch family members');
      message.error('Failed to load family members');
      console.error('Error fetching family members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMukhiya = () => {
    if (selectedUserId) {
      console.log('Adding Mukhiya:', {
        userId: selectedUserId,
        familyId,
        templeId
      });
      onAddMukhiya(selectedUserId, familyId);
      onClose();
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };
  
  const filteredUsers = users.filter(user =>
    `${user.attributes.first_name || ''} ${user.attributes.father || ''} ${user.attributes.mobile || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title="Select Family Head (Mukhiya)"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        selectedUserId && (
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleAddMukhiya}
            style={{
              background: `linear-gradient(135deg, #8B4513 0%, #A0522D 100%)`,
              border: 'none'
            }}
          >
            Add as Mukhiya
          </Button>
        ),
      ]}
      width={600}
      afterClose={() => {
        setSearchTerm('');
        setSelectedUserId(null);
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search family members..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Spin />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'red' }}>
          {error}
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item 
              onClick={() => handleSelectUser(user.id)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedUserId === user.id ? '#f0f0f0' : 'transparent',
                padding: '8px 12px',
                borderRadius: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Checkbox 
                  checked={selectedUserId === user.id}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectUser(user.id);
                  }}
                  style={{ marginRight: 16 }}
                />
                <List.Item.Meta
                  avatar={<UserOutlined />}
                  title={`${user.attributes.first_name || 'No Name'} ${user.attributes.father || ''}`}
                  description={
                    <>
                      {user.attributes.mobile && <div>Mobile: {user.attributes.mobile}</div>}
                      {user.attributes.email && <div>Email: {user.attributes.email}</div>}
                    </>
                  }
                />
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No family members found' }}
        />
      )}
    </Modal>
  );
};

export default AddFamilyMukhiyaDialog;