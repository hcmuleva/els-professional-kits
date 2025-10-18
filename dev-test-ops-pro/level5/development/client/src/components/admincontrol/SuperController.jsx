import React from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import AdminController from "./AdminController";
import SuperAdminController from "./SuperAdminController";
import { Tabs } from "antd";
import { Typography } from "antd";

const { TabPane } = Tabs;
const { Title } = Typography;

const warmColors = {
  primary: "#8B4513",
  secondary: "#A0522D",
  accent: "#CD853F",
  background: "#FAFAFA",
  cardBg: "#FFFFFF",
  textPrimary: "#2C2C2C",
  textSecondary: "#666666",
  border: "#E8E8E8",
  error: "#D32F2F",
  success: "#2E7D32",
};

const tabsStyle = {
  backgroundColor: warmColors.cardBg,
  borderRadius: "16px",
  boxShadow: `0 4px 16px ${warmColors.primary}12`,
  border: `1px solid ${warmColors.border}`,
  overflow: "hidden",
};

const tabBarStyle = {
  backgroundColor: warmColors.background,
  borderBottom: `1px solid ${warmColors.border}`,
  margin: 0,
};

export default function SuperController() {
  const { user } = useAuth(AuthContext);
  const [templeId, setTempleId] = React.useState(null);
  console.log(user);

  if (!user?.userrole) return null;

  if (user.userrole === "SUPERADMIN") {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: warmColors.background,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}08 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, ${warmColors.accent}08 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Title
            level={2}
            style={{
              color: warmColors.textPrimary,
              fontWeight: "700",
              marginBottom: "24px",
              textAlign: "center",
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            नियंत्रण केंद्र
          </Title>

          <Tabs
            defaultActiveKey="1"
            style={tabsStyle}
            tabBarStyle={tabBarStyle}
            tabBarGutter={100}
            size="large"
            centered
            items={[
              {
                key: "1",
                label: (
                  <span
                    style={{
                      color: warmColors.textPrimary,
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    सुपर एडमिन नियंत्रण
                  </span>
                ),
                children: (
                  <SuperAdminController
                    templeId={templeId}
                    setTempleId={setTempleId}
                  />
                ),
              },
              {
                key: "2",
                label: (
                  <span
                    style={{
                      color: warmColors.textPrimary,
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    एडमिन नियंत्रण
                  </span>
                ),
                children: <AdminController templeId={templeId} />,
              },
            ]}
          />
        </div>
      </div>
    );
  } else if (user.userrole === "ADMIN") {
    return <AdminController />;
  }

  return null;
}
