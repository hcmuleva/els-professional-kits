import { Card, Col, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
//import ReactPlayer from "react-player";
import ReactPlayer from "react-player";

import { getUserContent } from "../../../services/usercontent/usercontent";

const { Title, Paragraph } = Typography;

const UserContentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserContent();
        console.log('Response', res);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching user content:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;

  return (
    <div style={{ padding: "1rem" }}>
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          const { topic, subtopic, contenttype, youtubeurl, richtext, images, video } =
            item.attributes;

          return (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                title={<Title level={5}>{topic} - {subtopic}</Title>}
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                {contenttype === "YOUTUBE" && youtubeurl && (
                  <ReactPlayer
                    url={youtubeurl}
                    width="100%"
                    height="200px"
                    style={{ borderRadius: "8px" }}
                    controls
                  />
                )}

                {contenttype === "RICHTEXT" && richtext && (
                  <Paragraph ellipsis={{ rows: 6, expandable: true }}>
                    {richtext}
                  </Paragraph>
                )}

                {contenttype === "IMAGE" && images?.data?.[0]?.attributes?.url && (
                  <img
                    src={`http://localhost:1337${images.data[0].attributes.url}`}
                    alt="Content"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )}

                {contenttype === "VIDEO" && video?.data?.attributes?.url && (
                  <video
                    controls
                    width="100%"
                    style={{ borderRadius: "8px" }}
                    src={`http://localhost:1337${video.data.attributes.url}`}
                  />
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default UserContentList;
