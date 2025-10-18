import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentForm from '../../../admins/contentadmin/ContentForm';
import ContentList from './ContentList';
import { Divider } from 'antd';
import { Button } from 'antd-mobile';
import { PlusOutlined } from '@ant-design/icons';

export default function CourseContentManager() {
  const { courseId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate()
  const handleContentCreated = () => {
    setRefreshKey(prev => prev + 1); // refresh content list
  };

  return (
    <div style={{ padding: 20 }}>
 

  <Button 
    type="primary" 
    icon={<PlusOutlined />} 
    size="small"
    style={{
      backgroundColor: '#ffffff',
      color: '#000',
      borderColor: '#fff',
      fontWeight: 'bold'
    }}
     variant="dashed"
    onClick={() => navigate(`/coursesadmin`)}
  >
    <PlusOutlined />
    Create Book
  </Button>




        <Button onClick={()=> navigate('/coursesadmin')}>BackToCourse</Button>
      <ContentForm courseId={courseId} onSuccess={handleContentCreated} />
      <Divider />
      <h2>Existing Contents</h2>
      <ContentList courseId={courseId} refreshKey={refreshKey} />
    </div>
  );
}
