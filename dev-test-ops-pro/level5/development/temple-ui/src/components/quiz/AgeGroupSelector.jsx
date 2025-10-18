import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ageGroups = [
  {
    id: "kids",
    name: {
      hi: "बच्चे (10 साल से कम)",
      en: "Kids (Under 10)"
    },
    description: {
      hi: "मजेदार और आसान सवाल",
      en: "Fun and easy questions"
    },
    icon: <UserOutlined />,
    color: "#52c41a",
    jsonFile: "kids.json"
  },
  {
    id: "students",
    name: {
      hi: "छात्र (10-30 साल)",
      en: "Students (10-30 years)"
    },
    description: {
      hi: "शैक्षिक और चुनौतीपूर्ण सवाल",
      en: "Educational and challenging questions"
    },
    icon: <BookOutlined />,
    color: "#1890ff",
    jsonFile: "students.json"
  },
  {
    id: "adults",
    name: {
      hi: "वयस्क (30+ साल)",
      en: "Adults (30+ years)"
    },
    description: {
      hi: "गहरे ज्ञान और अनुभव आधारित सवाल",
      en: "Deep knowledge and experience-based questions"
    },
    icon: <TeamOutlined />,
    color: "#722ed1",
    jsonFile: "adults.json"
  }
];

export default function AgeGroupSelector({ onAgeGroupSelect }) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group.id);
    onAgeGroupSelect(group);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%)",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Title level={1} style={{ color: "#1d1d1d", marginBottom: "8px" }}>
            आयु समूह चुनें
          </Title>
          <Title
            level={2}
            style={{ color: "#595959", fontWeight: "normal", marginTop: "0" }}
          >
            Select Your Age Group
          </Title>
          <Paragraph
            style={{ fontSize: "16px", color: "#8c8c8c", marginBottom: "0" }}
          >
            अपने आयु समूह के अनुसार प्रश्नोत्तरी का चयन करें
            <br />
            Choose quiz according to your age group
          </Paragraph>
        </div>

        {/* Age Group Cards */}
        <Row gutter={[24, 24]} justify="center">
          {ageGroups.map((group) => (
            <Col xs={24} sm={12} lg={8} key={group.id}>
              <Card
                hoverable
                style={{
                  borderRadius: "16px",
                  boxShadow: selectedGroup === group.id 
                    ? `0 8px 32px ${group.color}30` 
                    : "0 4px 16px rgba(0,0,0,0.1)",
                  border: selectedGroup === group.id 
                    ? `2px solid ${group.color}` 
                    : "1px solid #f0f0f0",
                  textAlign: "center",
                  height: "280px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{
                  padding: "32px 24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleGroupSelect(group)}
              >
                <div>
                  <Avatar
                    size={64}
                    icon={group.icon}
                    style={{
                      backgroundColor: group.color,
                      marginBottom: "16px",
                    }}
                  />
                  <Title level={4} style={{ marginBottom: "8px" }}>
                    {group.name.hi}
                  </Title>
                  <Title
                    level={5}
                    style={{
                      color: "#595959",
                      fontWeight: "normal",
                      marginTop: "0",
                      marginBottom: "16px",
                    }}
                  >
                    {group.name.en}
                  </Title>
                  <Paragraph
                    style={{
                      color: "#8c8c8c",
                      fontSize: "14px",
                      marginBottom: "0",
                    }}
                  >
                    {group.description.hi}
                    <br />
                    {group.description.en}
                  </Paragraph>
                </div>

                <Button
                  type={selectedGroup === group.id ? "primary" : "default"}
                  size="large"
                  style={{
                    backgroundColor: selectedGroup === group.id ? group.color : undefined,
                    borderColor: group.color,
                    color: selectedGroup === group.id ? "#fff" : group.color,
                    borderRadius: "8px",
                    fontWeight: "500",
                    marginTop: "16px",
                  }}
                >
                  {selectedGroup === group.id ? "चयनित / Selected" : "चुनें / Select"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Start Quiz Button */}
        {selectedGroup && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Button
              type="primary"
              size="large"
              style={{
                background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
                border: "none",
                height: "56px",
                padding: "0 48px",
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(24, 144, 255, 0.3)",
              }}
              onClick={() => {
                const group = ageGroups.find(g => g.id === selectedGroup);
                handleGroupSelect(group);
              }}
            >
              प्रश्नोत्तरी शुरू करें / Start Quiz 🚀
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}