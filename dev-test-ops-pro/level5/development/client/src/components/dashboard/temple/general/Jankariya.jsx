import { Tabs, Card, Typography, Space } from "antd"
import { BookOutlined, FireOutlined, HeartOutlined, StarOutlined, CheckCircleOutlined } from "@ant-design/icons"
import AayimatajiArti from "./AayimatajiArti"
import Arati from "./Arati"
import BelKeNiyam from "./BelKeNiyam"
import Diwansahablist from "./Diwansahablist"
import Itihas from "./Itihas"

const { Title, Text } = Typography

export default function Jankariya() {
  const tabItems = [
    {
      key: "1",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StarOutlined />
          माताजी वंदना
        </span>
      ),
      children: <AayimatajiArti />,
    },
    {
      key: "2",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FireOutlined />
          माताजी की आरती
        </span>
      ),
      children: <Arati />,
    },
    {
      key: "3",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircleOutlined />
          बेल के नियम
        </span>
      ),
      children: <BelKeNiyam />,
    },
    {
      key: "4",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOutlined />
          दीवान साहब
        </span>
      ),
      children: <Diwansahablist />,
    },
    {
      key: "5",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOutlined />
          इतिहास
        </span>
      ),
      children: <Itihas />,
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: 'Inter, "Noto Serif Devanagari", sans-serif',
        padding: 0, // Removed padding
        margin: 0, // Ensure no margin
      }}
    >
      {/* Full width container - removed padding */}
      <div style={{ width: "100%" }}>
        <Card
          style={{
            marginBottom: "16px",
            borderRadius: 0, // Remove border radius for full width effect
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#ffffff",
            margin: 0, // Remove any margin
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <div style={{ textAlign: "center" }}>
            <Space direction="vertical" size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <HeartOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#1f2937",
                    fontSize: "28px",
                    fontWeight: "600",
                  }}
                >
                  जानकारी
                </Title>
                <HeartOutlined style={{ fontSize: "24px", color: "#ff6b6b" }} />
              </div>
              <Text style={{ color: "#6b7280", fontSize: "16px" }}>श्री माताजी की संपूर्ण भक्ति सामग्री</Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <StarOutlined key={i} style={{ color: "#f59e0b", fontSize: "16px" }} />
                ))}
              </div>
            </Space>
          </div>
        </Card>
        <Card
          style={{
            borderRadius: 0, // Remove border radius for full width effect
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#ffffff",
            margin: 0, // Remove any margin
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            size="large"
            tabBarStyle={{
              padding: "8px 16px",
              borderBottom: "1px solid #e5e7eb",
              margin: 0, // Ensure no margin on tab bar
            }}
            style={{
              color: "#1f2937",
              width: "100%", // Ensure full width
            }}
          />
        </Card>
      </div>
    </div>
  )
}
