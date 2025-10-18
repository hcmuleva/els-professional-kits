import React, { useEffect, useState } from 'react';
import { AuthContext, useAuth } from '../../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Typography, Spin } from 'antd';
import { getContentsByCourseId } from '../../../../services/content';
import ContentForm from './ContentForm';

const { Title, Text } = Typography;

export default function ContentAdminComponent() {
  const { user } = useAuth(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContents() {
      try {
        const response = await getContentsByCourseId(courseId);
        const data = response?.data?.data || [];
        console.log("data",data)
        setContentList(data || []);
      } catch (err) {
        console.error('Failed to load contents:', err);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) fetchContents();
  }, [courseId]);

  const renderContentCard = (item, index) => {
    console.log("ITEM", item);
    
    return (
      <Card
        key={index}
        title={`${item?.attributes?.title || 'Untitled'} - ${item?.attributes?.content_category}`}
        style={{ marginBottom: 16 }}
      >
        {item?.attributes?.type=== 'YOUTUBE' && item?.attributes?.youtubeurl && (
          <iframe
            width="100%"
            height="315"
            src={item?.attributes?.youtubeurl.replace('watch?v=', 'embed/')}
            title={item?.attributes?.title}
            frameBorder="0"
            allowFullScreen
          />
        )}

        {item?.attributes?.type=== 'VIDEO' && item?.attributescontentid && (
          <video controls width="100%">
            <source src={item?.attributescontentid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {item?.attributes?.type=== 'AUDIO' && item?.attributescontentid && (
          <audio controls style={{ width: '100%' }}>
            <source src={item?.attributescontentid} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        )}

        {item?.attributes?.type=== 'IMAGE' && item?.attributescontentid && (
          <img src={item?.attributescontentid} alt={item?.attributestitle} style={{ width: '100%' }} />
        )}

        {item?.attributes?.type=== 'PDF' && item?.attributescontentid && (
          <iframe
            src={item?.attributescontentid}
            width="100%"
            height="500px"
            title={item?.attributestitle}
            style={{ border: 'none' }}
          />
        )}

        {item?.attributesabout && <Text type="secondary">{item?.attributesabout}</Text>}
      </Card>
    );
  };
  const handleContentCreated = (newContent) => {
    setContentList(prev => [newContent, ...prev]);
  };

  console.log("contentList",contentList);
  
  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => navigate(-1)} type="primary" style={{ marginBottom: 16 }}>
        Back
      </Button>
      
      <ContentForm currentUser ={user} courseId={courseId} onContentCreated={handleContentCreated} />

      <Title level={3}>Contents for Course ID: {courseId}</Title>
      {loading ? <Spin /> : contentList.map((item, index) => renderContentCard(item, index))}
    </div>
  );
}
