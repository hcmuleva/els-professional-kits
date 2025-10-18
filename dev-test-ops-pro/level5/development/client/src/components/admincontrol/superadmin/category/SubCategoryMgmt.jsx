import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../../../../services/subcategory';
import { Input, Button, Space, message } from 'antd';

export default function SubCategoryMgmt() {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', name_hi: '', icon: '' });
  const [newSub, setNewSub] = useState({ name: '', name_hi: '', icon: '' });
  const navigate = useNavigate()
  const [categoryObj,setCategoryObj] = useState({});
  const fetchSubcategories = async () => {
    try {
      const res = await getAllSubCategories(categoryId);
      setCategoryObj(res?.data?.attributes?.category||{})
      setSubcategories(res?.data || []);
    } catch {
      message.error('Failed to load subcategories');
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const handleCreate = async () => {
    if (!newSub.name.trim()) return message.warning('Name required');
    try {
      await createSubCategory(categoryId, newSub);
      setNewSub({ name: '', name_hi: '', icon: '' });
      message.success('Created');
      fetchSubcategories();
    } catch {
      message.error('Create failed');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateSubCategory(id, editData);
      setEditId(null);
      message.success('Updated');
      fetchSubcategories();
    } catch {
      message.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubCategory(id);
      message.success('Deleted');
      fetchSubcategories();
    } catch {
      message.error('Delete failed');
    }
  };

  return (
    <div>
        <Button onClick={() => navigate('/categories')} style={{ marginBottom: 16 }}>
        ← Back to Categories
      </Button>
      <h3>CategoryId #{categoryId}</h3>
      <Space direction="vertical" style={{ marginBottom: 24 }}>
        <Input placeholder="Name" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} />
        <Input placeholder="Hindi Name" value={newSub.name_hi} onChange={(e) => setNewSub({ ...newSub, name_hi: e.target.value })} />
        <Input placeholder="Icon" value={newSub.icon} onChange={(e) => setNewSub({ ...newSub, icon: e.target.value })} />
        <Button type="primary" onClick={handleCreate}>Create Subcategory</Button>
      </Space>

      {subcategories.map((sub) => {
        const isEditing = sub.id === editId;
        return (
          <div key={sub.id} style={{ border: '1px solid #ccc', marginBottom: 8, padding: 10, borderRadius: 8 }}>
            {isEditing ? (
              <Space direction="vertical">
                <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                <Input value={editData.name_hi} onChange={(e) => setEditData({ ...editData, name_hi: e.target.value })} />
                <Input value={editData.icon} onChange={(e) => setEditData({ ...editData, icon: e.target.value })} />
                <Space>
                  <Button type="primary" onClick={() => handleUpdate(sub.id)}>Save</Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </Space>
              </Space>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span>{sub.attributes.icon}</span>
                  <span>{sub.attributes.name}</span>
                  <span>{sub.attributes.name_hi}</span>
                </div>
                <Space>
                  <Button type="link" onClick={() => {
                    setEditId(sub.id);
                    setEditData({
                      name: sub.attributes.name,
                      name_hi: sub.attributes.name_hi,
                      icon: sub.attributes.icon,
                    });
                  }}>Edit</Button>
                  <Button type="link" danger onClick={() => handleDelete(sub.id)}>Delete</Button>
                </Space>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
