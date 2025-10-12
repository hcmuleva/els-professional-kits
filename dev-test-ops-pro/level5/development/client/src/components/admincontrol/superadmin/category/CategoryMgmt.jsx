import React, { useEffect, useState } from 'react';
import {
  getAllCategory,
  updateCategory,
  deleteCategory,
  createCategory,
} from '../../../../services/category';
import { Input, Button, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function CategoryMgmt() {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', name_hi: '', icon: '' });
  const [newCategory, setNewCategory] = useState({ name: '', name_hi: '', icon: '' });
  const navigate = useNavigate()
  const fetchCategories = async () => {
    try {
      const res = await getAllCategory();
      const sorted = (res?.data || []).sort((a, b) =>
        new Date(b.attributes.updatedAt) - new Date(a.attributes.updatedAt)
      );
      setCategories(sorted);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditId(category.id);
    setEditData({
      name: category.attributes.name,
      name_hi: category.attributes.name_hi,
      icon: category.attributes.icon,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, editData);
      message.success('Category updated');
      setEditId(null);
      fetchCategories();
    } catch (error) {
      message.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted');
      fetchCategories();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const handleCreate = async () => {
    if (!newCategory.name.trim()) {
      message.warning('Name is required');
      return;
    }
    try {
      await createCategory(newCategory);
      message.success('Category created');
      setNewCategory({ name: '', name_hi: '', icon: '' });
      fetchCategories();
    } catch (error) {
      message.error('Failed to create category');
    }
  };

  return (
    <div>
      <h3>Create New Category</h3>
      <Space direction="vertical" style={{ marginBottom: 24 }}>
        <Input
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <Input
          placeholder="Hindi Name"
          value={newCategory.name_hi}
          onChange={(e) => setNewCategory({ ...newCategory, name_hi: e.target.value })}
        />
        <Input
          placeholder="Icon"
          value={newCategory.icon}
          onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
        />
        <Button type="primary" onClick={handleCreate}>
          Create Category
        </Button>
      </Space>

      <h3>Category List</h3>
      {categories.map((category) => {
        const isEditing = category.id === editId;
        return (
          <div
            key={category.id}
            style={{
              border: '1px solid #ccc',
              marginBottom: 8,
              padding: 10,
              borderRadius: 8,
            }}
          >
            {isEditing ? (
              <Space direction="vertical">
                <Input
                  placeholder="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <Input
                  placeholder="Hindi Name"
                  value={editData.name_hi}
                  onChange={(e) => setEditData({ ...editData, name_hi: e.target.value })}
                />
                <Input
                  placeholder="Icon"
                  value={editData.icon}
                  onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                />
                <Space>
                  <Button type="primary" onClick={() => handleUpdate(category.id)}>
                    Save
                  </Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </Space>
              </Space>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{category.attributes.icon}</span>
                  <span>{category.attributes.name}</span>
                  <span>{category.attributes.name_hi}</span>
                </div>
                <Space>
                  <Button type="link" onClick={() => navigate(`/subcategory/${category.id}`)}>
                    Subcategories
                  </Button>
                  <Button type="link" onClick={() => navigate(`/categoryrole/${category.id}`)}>
                    Role
                  </Button>
                  <Button type="link" onClick={() => handleEditClick(category)}>Edit</Button>
                  <Button type="link" danger onClick={() => handleDelete(category.id)}>Delete</Button>
                </Space>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
