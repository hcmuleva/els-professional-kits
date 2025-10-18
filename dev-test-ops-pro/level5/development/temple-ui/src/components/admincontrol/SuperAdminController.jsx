import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd-mobile";
import { Typography } from "antd";

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

const cardStyle = {
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: `0 4px 16px ${warmColors.primary}12`,
  backgroundColor: warmColors.cardBg,
  border: `1px solid ${warmColors.border}`,
  marginBottom: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const iconContainerStyle = {
  width: "48px",
  height: "48px",
  margin: "0 auto 12px",
  fontSize: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: warmColors.background,
};

const cardTitleStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: warmColors.textPrimary,
  marginBottom: "4px",
  textAlign: "center",
};

export default function SuperAdminController({ templeId, setTempleId }) {
  const navigate = useNavigate();

  const superAdminData = {
    assigned: [
      // {
      //   id: "course",
      //   name: "कोर्स",
      //   icon: "📚",
      //   path: "/coursesadmin",
      // },

      // {
      //   id: "subscription",
      //   name: "सब्सक्रिप्शन",
      //   icon: "💳",
      //   path: "/subscriptionadmin",
      // },
      // {
      //   id: "category",
      //   name: "श्रेणी",
      //   icon: "📂",
      //   path: "/categoryadmin",
      // },
      // {
      //   id: "subcategory",
      //   name: "उप श्रेणी",
      //   icon: "📁",
      //   path: "/subcategoryadmin",
      // },
      // {
      //   id: "assignuser",
      //   name: "assign user to temple",
      //   icon: "📝",
      //   path: "/assignusertemple",
      // },
      {
        id: "settemple",
        name: "मंदिर प्रबंधन",
        icon: "🛕",
        path: "/templesuperadmin",
      },
      {
        id: "QuizDemo1",
        name: "क्विज़ demo 1",
        icon: "📝",
        path: "/hcmquizapp",
      },
      {
        id: "QuizDemo2",
        name: "क्विज़ demo 2",
        icon: "📝",
        path: "/questionarea",
      },
    ],
  };

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
          level={3}
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
          सुपर एडमिन डैशबोर्ड
        </Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "16px",
            padding: "0 8px",
          }}
        >
          {superAdminData?.assigned?.map((item, index) => (
            <Card
              key={index}
              style={{
                ...cardStyle,
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 24px ${warmColors.primary}20`,
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <div style={{ padding: "16px" }}>
                <div style={iconContainerStyle}>
                  <span
                    role="img"
                    aria-label={item.name}
                    style={{ fontSize: "28px" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <Title level={5} style={cardTitleStyle}>
                  {item.name}
                </Title>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
