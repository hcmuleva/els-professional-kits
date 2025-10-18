
// AssignSubcategoryModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Checkbox, Button, message } from 'antd';
import { getAllCategory } from '../../../../services/category';
import { updateTempleSubcategories } from '../../../../services/community';
//import { assignSubcategoriesToTemple } from '../../../services/temple';

const AssignSubcategoryModal = ({ templeId, open, onClose }) => {
  console.log("AssignSubcategoryModal templeId", templeId);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getAllCategory().then((data)=>{
        console.log("data", data);
        setCategories(data.data);

      });
    }
    
  }, [open]);

  const handleOk = async () => {
    setLoading(true);
    console.log("templeId", templeId  , "selected subcategories", selected);
    try {
      const updatedresponse = await updateTempleSubcategories({id:templeId, subcategoryIds: selected })
      message.success('Assigned successfully',updatedresponse);
      onClose();
    } catch {
      message.error('Failed to assign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} confirmLoading={loading} title="Assign Subcategories">
      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 12 }}>
          <b>{cat.attributes.name}</b>
          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column', marginLeft: 12 }}
            onChange={(checked) => {
              const updated = [...selected.filter(id => !cat.attributes.subcategories.data.some(sc => sc.id === id)), ...checked];
              setSelected(updated);
            }}
            value={selected.filter(id => cat.attributes.subcategories.data.some(sc => sc.id === id))}
          >
            {cat.attributes.subcategories.data.map((sc) => (
              <Checkbox key={sc.id} value={sc.id}>{sc.attributes.name}</Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))}
    </Modal>
  );
};

export default AssignSubcategoryModal;
