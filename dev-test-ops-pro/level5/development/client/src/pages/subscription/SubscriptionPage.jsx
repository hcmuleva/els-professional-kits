
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { getCourseList } from '../../../../services/course';
import { Col, Row, Typography, Card } from 'antd';
import { Button } from 'antd-mobile';
import { PlusOutlined } from '@ant-design/icons';
import { getCourseList } from '../../services/course';
import SubscriptionPlansDialog from './SubscriptionPlansDialog';
const { Title, Text } = Typography;

export default function SubscriptionPage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [isSubscriptionDialogVisible, setIsSubscriptionDialogVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCourseList();
      const data = response?.data?.data || [];
      setCourses(data);
    };
    fetchData();
  }, []);

  const handleSubscribe = (subscriptionData) => {
    // Here you would typically:
    // 1. Send the subscription data to your backend
    // 2. Process payment
    // 3. Handle the response
    setIsSubscriptionDialogVisible(false);
    // Show success message or redirect
  };
  return (
    <>
    <div>
  <Button 
        type="primary" 
        onClick={() => setIsSubscriptionDialogVisible(true)}
      >
        View Subscription Plans
      </Button>

      <SubscriptionPlansDialog
        visible={isSubscriptionDialogVisible}
        onCancel={() => setIsSubscriptionDialogVisible(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
      <Row gutter={[16, 16]}>
        {courses.map((course) => (
         <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
         <Card
           hoverable
           cover={
             <div
               style={{
                 height: 300,
                 backgroundColor: '#f0f2f5',
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center',
                 padding: '20px',
                 backgroundImage: course?.attributes?.cover?.data?.attributes?.url
                   ? `url(${course?.attributes?.cover?.data?.attributes?.url})`
                   : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 position: 'relative',
                 color: '#fff',
                 textShadow: '0px 0px 6px rgba(0,0,0,0.7)',
               }}
             >
               {/* Top Black Strip */}
               <div
                 style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   right: 0,
                   backgroundColor: 'rgba(0,0,0,0.7)',
                   padding: '8px 12px',
                   display: 'flex',
                   justifyContent: 'center', // center the text
                   alignItems: 'center',
                 }}
               >
                 <Text
                   style={{
                     fontSize: 18,
                     fontWeight: 'bold',
                     color: 'white',
                     textAlign: 'center',
                     width: '100%',
                   }}
                 >
                   {course?.attributes?.title || 'Course Title'}
                 </Text>
               </div>
       
               {/* Center Content (Optional) */}
               <div
                 style={{
                   textAlign: 'center',
                   backgroundColor: 'rgba(255,255,255,0.3)', // more transparent
                   padding: '20px',
                   borderRadius: '4px',
                   width: '100%',
                   marginTop: '50px',
                 }}
               >
                 <Title level={3} style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                   {course?.attributes?.title || 'Title'}
                 </Title>
                 <Text
                   strong
                   style={{ display: 'block', marginBottom: '8px', fontStyle: 'italic' }}
                 >
                   {course?.attributes?.subtitle || 'Subtitle'}
                 </Text>
               </div>
       
               {/* Bottom Gray Strip */}
               <div
                 style={{
                   position: 'absolute',
                   bottom: 0,
                   left: 0,
                   right: 0,
                   backgroundColor: 'rgba(240, 240, 240, 0.95)',
                   padding: '8px 12px',
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                 }}
               >
                 <img
                   src="data:image/jpeg;base64,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"
                   alt="Avatar"
                   style={{ width: 32, height: 32, borderRadius: '50%' }}
                 />
                 <Text
                   style={{
                     fontSize: 14,
                     fontWeight: 'bold',
                     color: '#333',
                   }}
                 >
                   {course.author || 'Harish Muleva'}
                 </Text>
               </div>
             </div>
           }
           bodyStyle={{ display: 'none' }}
         />
       </Col>
       
        ))}
      </Row>
    </>
  );
}
