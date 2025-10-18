import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Space, Typography, message } from 'antd';
import {
  getRolesByCategory,
  deleteRole,
  updateRole,
  createRoleForCategory,
  getCategoryById,
} from '../../../../services/categoryRoles';

const { Title } = Typography;

export default function CategoryRoleMgmt() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', name_hi: '' });
  const [createData, setCreateData] = useState({ name: '', name_hi: '' });

  const fetchCategory = async () => {
    try {
      const res = await getCategoryById(categoryId);
      setCategoryInfo(res?.data?.data?.attributes);

    } catch {
      message.error('Failed to load category');
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRolesByCategory(categoryId);
      console.log("res",res?.data.data?.attributes?.categoryroles?.data)
     
      setRoles(res?.data.data?.attributes?.categoryroles?.data || []);
    } catch {
      message.error('Failed to load roles');
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchRoles();
  }, [categoryId]);

  const handleCreate = async () => {
    if (!createData.name.trim()) return message.warning('Role name is required');
    try {
      await createRoleForCategory({data:{category:categoryId, ...createData}});
      message.success('Role created successfully');
      setCreateData({ name: '', name_hi: '' });
      fetchRoles();
    } catch {
      message.error('Creation failed');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateRole(id, editData);
      message.success('Role updated');
      setEditId(null);
      fetchRoles();
    } catch {
      message.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      message.success('Role deleted');
      fetchRoles();
    } catch {
      message.error('Delete failed');
    }
  };

  return (
    <div>
      <Button onClick={() => navigate('/categories')} style={{ marginBottom: 16 }}>
        ← Back to Categories
      </Button>

      {categoryInfo && (
        <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Title level={4}>
            Roles for {categoryInfo.name} {categoryInfo.icon}
          </Title>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Create New Role</Title>
        <Input
          placeholder="Role Name"
          value={createData.name}
          onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Role Name (Hindi)"
          value={createData.name_hi}
          onChange={(e) => setCreateData({ ...createData, name_hi: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={handleCreate}>Create Role</Button>
      </div>

      <Title level={5}>Role List</Title>
      {roles.map((role) => {
        const isEditing = editId === role.id;
        return (
          <div
            key={role.id}
            style={{
              border: '1px solid #ccc',
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            {isEditing ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  value={editData.name}
                  placeholder="Role Name"
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <Input
                  value={editData.name_hi}
                  placeholder="Role Name (Hindi)"
                  onChange={(e) => setEditData({ ...editData, name_hi: e.target.value })}
                />
                <Space>
                  <Button type="primary" onClick={() => handleUpdate(role.id)}>Save</Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </Space>
              </Space>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{role.attributes.name}</strong> ({role.attributes.name_hi})
                </div>
                <Space>
                  <Button type="link" onClick={() => {
                    setEditId(role.id);
                    setEditData({
                      name: role.attributes.name,
                      name_hi: role.attributes.name_hi,
                    });
                  }}>Edit</Button>
                  <Button type="link" danger onClick={() => handleDelete(role.id)}>Delete</Button>
                </Space>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
