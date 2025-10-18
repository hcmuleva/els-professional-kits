import React from "react";
import ReactPlayer from "react-player";
import { Card, Typography, Col } from "antd";

const { Title, Paragraph } = Typography;

export default function ContentView({ content }) {
  const { title, subtitle, type, youtubeurl, coverurl } = content;

  const renderMedia = () => {
    if (type === "YOUTUBE" && youtubeurl) {
      return (
        <ReactPlayer
          url={youtubeurl}
          width="100%"
          height="200px"
          controls
          style={{ borderRadius: "8px" }}
        />
      );
    }

    if (type === "IMAGE" && coverurl) {
      return (
        <img
          src={coverurl}
          alt={title}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      );
    }

    return null; // No rendering for unsupported types
  };

  return (
    <Col xs={24} sm={12} md={8}>
      <Card
        hoverable
        title={<Title level={5}>{title}</Title>}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Paragraph type="secondary">{subtitle}</Paragraph>
        {renderMedia()}
      </Card>
    </Col>
  );
}
