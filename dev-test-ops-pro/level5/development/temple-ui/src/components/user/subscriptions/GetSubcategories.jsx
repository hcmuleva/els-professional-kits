import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getAllCategory } from '../../../services/category';

const { Option } = Select;

export default function GetSubcategories() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategory(); // should populate subcategories and categoryroles
        setData(response?.data || []);
      } catch (err) {
        console.error('Error fetching categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleCategoryChange = (value) => {
    setSelected(value);
    setSelectedSub(null);
    setSelectedRole(null);

    const fullCategory = data.find(
      (item) => item.attributes.name === value.value
    );

    if (fullCategory) {
      const subs = fullCategory?.attributes?.subcategories?.data || [];
      const categoryRoles = fullCategory?.attributes?.categoryroles?.data || [];

      setSubcategories(subs);
      setRoles(categoryRoles);

      console.log('Selected Category:', {
        id: fullCategory?.id,
        ...fullCategory?.attributes,
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Category Select */}
      <Select
        showSearch
        style={{ width: 300 }}
        placeholder="Select a category"
        labelInValue
        value={selected}
        onChange={handleCategoryChange}
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {data.map((item) => {
          const { name, name_hi, icon } = item.attributes;
          return (
            <Option
              key={name}
              value={name}
              label={`${icon} ${name_hi}`}
            >
              <span>
                <span style={{ marginRight: 8 }}>{icon}</span>
                {name_hi}
              </span>
            </Option>
          );
        })}
      </Select>

      {/* Subcategory Select */}
      {subcategories.length > 0 && (
        <Select
          style={{ width: 300 }}
          placeholder="Select a subcategory"
          value={selectedSub}
          onChange={(value) => {
            setSelectedSub(value);
            const sub = subcategories.find((s) => s.id === value);
            console.log('Selected Subcategory:', {
              id: sub?.id,
              ...sub?.attributes,
            });
          }}
        >
          {subcategories.map((sub) => (
            <Option key={sub.id} value={sub.id}>
              {sub.attributes?.icon} {sub.attributes.name_hi}
            </Option>
          ))}
        </Select>
      )}

      {/* Category Roles Select */}
      {roles.length > 0 && (
        <Select
          style={{ width: 300 }}
          placeholder="Select a role"
          value={selectedRole}
          onChange={(value) => {
            setSelectedRole(value);
            const role = roles.find((r) => r.id === value);
            console.log('Selected Role:', {
              id: role?.id,
              ...role?.attributes,
            });
          }}
        >
          {roles.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.attributes?.icon} {role.attributes.name_hi}
            </Option>
          ))}
        </Select>
      )}
    </div>
  );
}
