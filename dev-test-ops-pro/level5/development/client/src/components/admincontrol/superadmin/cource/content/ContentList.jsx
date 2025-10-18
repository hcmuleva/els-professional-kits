import React, { useEffect, useState } from 'react';
import { List, Typography } from 'antd';
import { getContentsByCourseId } from '../../../../../services/content';
export default function ContentList({ courseId, refreshKey }) {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      const response = await getContentsByCourseId(courseId);
      const data = response?.data?.data || [];
      setContents(data);
    };
    fetchContents();
  }, [courseId, refreshKey]);

  return (
    <List
      itemLayout="vertical"
      dataSource={contents}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            title={<Typography.Text strong>{item.attributes?.title}</Typography.Text>}
            description={item.attributes?.description}
          />
        </List.Item>
      )}
    />
  );
}
