import React, { useContext, useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import { AuthContext } from '../../../contexts/AuthContext';
import ListMyContent from './controller/ListMyContent';
import CreateContent from './controller/CreateContent';

const { TabPane } = Tabs;
export default function ManageSubscriptions() {
  const {user} = useContext(AuthContext)
  const [showCreate, setShowCreate] = useState(false);

  const handleToggle = () => {
    setShowCreate((prev) => !prev);
  };

  /**
   *  1. User can create content  (if user allowed to create. This will be in settings settings:{content: {subcategories:[], permission:[CRUD]}})
   *     1a) If Author : 
   *        change the plan as per needed
   *        change the policy
   *     1b) view users subscribed   
   *  2. User View content:
   *  3. 
   *   
   *
  /**
   *  1) Get list of subcategory based on my profiletypes (Students/Farmer/Doctor)
   *        This we will implement.
   *  2) Next select and update to show on dashboard or in parking (default dashboard)
   *        Users setting there is one object would be subscription.dashboard=[], subscription.parking=[]
   *        based on users choice it will reflect on dashboard icons.
   **/  
  const [isAuthor, setIsAuthor] = useState(false);
  const [activeKey, setActiveKey] = useState('view');

  const authorData = user?.settingjson?.content?.author;
  console.log("authorData",authorData)
  useEffect(() => {
    if (Array.isArray(authorData) && authorData.length > 0) {
      setIsAuthor(true);
    }
  }, []);

  return (
    <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
      <TabPane tab="Content" key="view">
        {/* Your view content logic here */}
        <p>This is the View Content tab.</p>
      </TabPane>
      <TabPane tab="Subscription" key="subscription">
        {/* Your view content logic here */}
        <p>This is the View Content tab.</p>
      </TabPane>
      {isAuthor && (
        <TabPane tab="Author" key="manage">
          {/* Your author management logic here */}
          <Button type="primary" onClick={handleToggle} style={{ marginBottom: 16 }}>
        {showCreate ? 'Back to List' : 'Create New Content'}
      </Button>

      {showCreate ? (
        <CreateContent authorData={authorData} userId={user?.id} />
      ) : (
        <ListMyContent authorData={authorData} userId={user?.id} />
      )}
        
        </TabPane>
      )}
      {isAuthor && (
        <TabPane tab="Subscriber" key="subscribeduser">
          {/* Your author management logic here */}
        
          <p>Subscribed users.</p>
        </TabPane>
      )}
    </Tabs>
  );
}