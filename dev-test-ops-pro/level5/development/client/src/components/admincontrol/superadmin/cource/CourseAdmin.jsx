import React, { useState } from 'react';
import { Button } from 'antd-mobile';
import { AuthContext, useAuth } from '../../../../contexts/AuthContext';
import CourseForm from './CourseForm';
import CourseCoverList from './CourseCoverList';
import { Flex, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CourseAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // used to trigger refresh
  const [lastCreated, setLastCreated] = useState(null);
  const {user} = useAuth(AuthContext)
  const handleCreateSuccess = (newCourse) => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // trigger re-fetch in CourseCoverList
    setLastCreated(newCourse);
  };
  const onChange = (key) => {
    console.log(key);
  };
  
const items = [
  {
    key: '1',
    label: 'Course',
    children:<> <Flex gap="small" wrap>
    <Button color="primary" onClick={() => setShowForm(prev => !prev)} variant="dashed">
      <PlusOutlined/>{showForm ? 'Cancel' : 'Course'}
    </Button>
    </Flex>
    <br/>
    {showForm && (
      <CourseForm
        currentUserId={user.id}
        onSuccess={handleCreateSuccess}
      />
    )}

   {!showForm&& <CourseCoverList
      refreshKey={refreshKey}
      lastCreated={lastCreated}
    />}
    
    </>
  },
  {
    key: '2',
    label: 'Author',
    children: 'Assign author',
  }
  
];

  return (
    <><Tabs defaultActiveKey="1" items={items} onChange={onChange} />
       
    </>
  );
}
