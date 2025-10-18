import React, { useEffect, useState } from 'react';
import {
  createTemple,
  deleteTemple,
  getTempleLists,
  updateTemple,
} from '../../../../services/temple';
import { Button } from 'antd';

export default function TempleMgmt() {
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState({ title: '', subtitle: '', images: [] });
  const [editingId, setEditingId] = useState(null);

  const fetchTemples = async () => {
    const data = await getTempleLists();
    setTemples(data?.data || []);
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", JSON.stringify({
      title: form.title,
      subtitle: form.subtitle
    }));

    for (let i = 0; i < form.images.length; i++) {
      formData.append("files.images", form.images[i]);
    }

    if (editingId) {
      await updateTemple(editingId, formData);
    } else {
      await createTemple(formData);
    }

    setForm({ title: '', subtitle: '', images: [] });
    setEditingId(null);
    fetchTemples();
  };

  const handleEdit = (temple) => {
    setEditingId(temple.id);
    setForm({
      title: temple.attributes.title,
      subtitle: temple.attributes.subtitle,
      images: [],
    });
  };

  const handleDelete = async (id) => {
    await deleteTemple(id);
    fetchTemples();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{editingId ? 'Edit Temple' : 'Create Temple'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={handleChange}
        />
        <br />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <br />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>

      <h3>Temple List</h3>
      <ul>
        {temples.map((temple) => (
          <li key={temple.id}>
            <strong>{temple.attributes.title}</strong> - {temple.attributes.subtitle || "No subtitle"}
            <br />
            {temple.attributes.images?.data?.map((img) => (
              <img
                key={img.id}
                src={`http://localhost:1337${img.attributes.url}`}
                alt="temple"
                style={{ height: 50, marginRight: 10 }}
              />
            ))}
            <br />
            <button onClick={() => handleEdit(temple)}>Edit</button>
            <button onClick={() => handleDelete(temple.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Button onClick={()=>setEditingId(null)} >Cancel</Button>
    </div>
  );
}
