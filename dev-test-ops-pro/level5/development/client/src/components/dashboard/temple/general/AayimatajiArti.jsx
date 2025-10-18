import React from "react";
import { Card, Typography, Divider, Space } from "antd";
import { StarOutlined, HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AayimatajiArti = () => {
  const artiVerses = [
    {
      id: 1,
      lines: [
        "जय जय जय जगदम्ब भवानी, जय जय जय जगदम्बे भवानी",
        "मात हमारी आद भवानी, मात हमारी आद भवानी,",
        "जय जय जय जगदम्बे भवानी।।",
      ],
    },
    {
      id: 2,
      lines: [
        "तुझ सुमिरे से नित सुख होवे, तुझ सुमिरे से नित सुख होवे",
        "काल क्लेश सब दूर हो जावे, काल क्लेश सब दूर हो जावे,",
        "तू जग की है मुख्य भवानी, तू जग की है मुख्य भवानी,",
        "जय जय जय जगदम्बे भवानी।।",
      ],
    },
    {
      id: 3,
      lines: [
        "सुर और असुर तेरा गुण गावे, सुर और असुर तेरा गुण गावे,",
        "वेद पुराणन मे यश छावे, वेद पुराणन मे यश छावे,",
        "तू समर्थ है जग की जननी, तू समर्थ है जग की जननी",
        "जय जय जय जगदम्बे भवानी।।",
      ],
    },
    {
      id: 4,
      lines: [
        "अखण्ड ज्योत मे तू ही समावे, अखण्ड ज्योत मे तू ही समावे,",
        "हम सब है तब शरण चरन के, हम सब है तब शरण चरन के,",
        "शुभ दृष्टि कर नित मम जननी, शुभ दृष्टि कर नित मम जननी,",
        "जय जय जय जगदम्बे भवानी",
      ],
    },
    {
      id: 5,
      lines: ["मात हमारी आद भवानी, जय जय जय जगदम्बे भवानी।।"],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "16px",
        fontFamily: 'Inter, "Noto Serif Devanagari", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#ffffff",
          }}
        >
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Space direction="vertical" size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <StarOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#1f2937",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
                  माताजी वंदना
                </Title>
                <StarOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <HeartOutlined
                    key={i}
                    style={{ color: "#ff6b6b", fontSize: "16px" }}
                  />
                ))}
              </div>
            </Space>
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
          <div style={{ padding: "0 16px" }}>
            {artiVerses.map((verse) => (
              <div key={verse.id} style={{ marginBottom: "16px" }}>
                <Card
                  size="small"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    background: "#ffffff",
                  }}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {verse.lines.map((line, lineIndex) => (
                      <div key={lineIndex} style={{ textAlign: "center" }}>
                        <Text
                          style={{
                            fontSize: "16px",
                            fontWeight: line.includes("जय जय जय")
                              ? "600"
                              : "500",
                            color: line.includes("जय जय जय")
                              ? "#ff6b6b"
                              : "#1f2937",
                            lineHeight: "1.8",
                            display: "block",
                            padding: "4px 0",
                          }}
                        >
                          {line}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </div>
            ))}
          </div>
          <Divider style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Space>
              <HeartOutlined style={{ color: "#ff6b6b", fontSize: "16px" }} />
              <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                श्री माता जी की जय हो
              </Text>
              <HeartOutlined style={{ color: "#ff6b6b", fontSize: "16px" }} />
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AayimatajiArti;
