import React, { useEffect, useState } from 'react';
import { AuthContext, useAuth } from '../../../../contexts/AuthContext';
import { getcustomcourses } from '../../../../services/course';
import { Col, Row, Typography, Card, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function CourseAdminComponent() {
  const { user } = useAuth(AuthContext);
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.id) {
        try {
          const response = await getcustomcourses(user.id);
          setCourseList(response);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
        }
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div>
      <Tabs defaultActiveKey="course">
        <TabPane tab="Course Admin" key="course">
          <Row gutter={[16, 16]}>
            {courseList.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/admincourses/${course.id}/contents`)}
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
                        backgroundImage: course?.cover?.data?.url
                          ? `url(${course?.cover?.data?.url})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        color: '#fff',
                        textShadow: '0px 0px 6px rgba(0,0,0,0.7)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'center',
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
                          {course?.title || 'Course Title'}
                        </Text>
                      </div>

                      <div
                        style={{
                          textAlign: 'center',
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          padding: '20px',
                          borderRadius: '4px',
                          width: '100%',
                          marginTop: '50px',
                        }}
                      >
                        <Title level={3} style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                          {course?.title || 'Title'}
                        </Title>
                        <Text
                          strong
                          style={{ display: 'block', marginBottom: '8px', fontStyle: 'italic' }}
                        >
                          {course?.subtitle || 'Subtitle'}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab="Manage Subscription" key="subscription">
          <h2>Subscription</h2>
        </TabPane>

        <TabPane tab="Users Subscribed" key="users">
          <h1>Users Subscribed</h1>
        </TabPane>
      </Tabs>
    </div>
  );
}
