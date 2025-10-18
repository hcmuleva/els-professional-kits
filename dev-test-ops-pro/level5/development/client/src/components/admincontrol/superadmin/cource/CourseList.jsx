import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function CourseList({ courses, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button onClick={() => navigate(`/courses/edit/${record.id}`)}>Edit</Button>
          <Button danger onClick={() => onDelete(record.id)}>Delete</Button>
          <Button onClick={() => navigate(`/courses/${record.id}/contents`)}>View Contents</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => navigate('/courses/create')}>Add Course</Button>
      <Table dataSource={courses} columns={columns} rowKey="id" />
    </div>
  );
}