import { Card, Row, Col, Typography, Button } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

const FirstTimeUserCard = ({ navigate, warmColors, user }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if user has dismissed this card before
  useEffect(() => {
    const dismissed = localStorage.getItem("firstTimeUserCardDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem("firstTimeUserCardDismissed", "true");
    setIsVisible(false);
  };

  console.log("FirstTimeUserCard rendering for user:", user);

  const setupSteps = [
    {
      title: "प्रोफ़ाइल सेटअप करें",
      description:
        "व्यक्तिगत जानकारी, व्यवसाय, नौकरी, शिक्षा, कृषि की जानकारी दें",
      path: "/profile",
      icon: UserOutlined,
    },
    {
      title: "परिवार की जानकारी दें",
      description: "अपने परिवार के सदस्यों की जानकारी जोड़ें",
      path: "/myfamily",
      icon: TeamOutlined,
    },
    {
      title: "जनगणना देखें",
      description: "मंदिर के सदस्यों और उनके व्यवसाय की जानकारी देखें",
      path: "/janganana",
      icon: GlobalOutlined,
    },
  ];

  return (
    <div style={{ margin: "16px", marginTop: "24px" }}>
      <Card
        style={{
          borderRadius: "16px",
          border: `2px solid ${warmColors.primary}`,
          backgroundColor: warmColors.cardBg,
          boxShadow: `0 8px 24px ${warmColors.primary}20`,
          position: "relative",
        }}
      >
        {/* Close/Dismiss Button */}
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            color: warmColors.textSecondary,
            border: "none",
            boxShadow: "none",
          }}
          size="small"
        />

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
            padding: "20px 40px 16px 20px", // Extra padding-right to avoid close button
            backgroundColor: `${warmColors.primary}08`,
            margin: "-24px -24px 24px -24px",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <UserOutlined
            style={{
              fontSize: "40px",
              color: warmColors.primary,
              marginBottom: "12px",
            }}
          />
          <Title
            level={3}
            style={{
              color: warmColors.primary,
              marginBottom: "8px",
            }}
          >
            नमस्ते! आपका स्वागत है
          </Title>
          <Text
            style={{
              color: warmColors.textSecondary,
              fontSize: "15px",
            }}
          >
            समुदाय से जुड़ने के लिए अपनी प्रोफ़ाइल पूरी करें
          </Text>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "20px" }}>
          <Title
            level={5}
            style={{
              color: warmColors.textPrimary,
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            निम्नलिखित चरणों को पूरा करें:
          </Title>

          {setupSteps.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                margin: "8px 0",
                border: `1px solid ${warmColors.border}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              onClick={() => navigate(step.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${warmColors.primary}08`;
                e.currentTarget.style.borderColor = warmColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = warmColors.border;
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: warmColors.primary,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {index + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <step.icon
                    style={{ color: warmColors.primary, fontSize: "18px" }}
                  />
                  <Text
                    strong
                    style={{ color: warmColors.textPrimary, fontSize: "16px" }}
                  >
                    {step.title}
                  </Text>
                </div>
                <Text
                  style={{
                    color: warmColors.textSecondary,
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {step.description}
                </Text>
              </div>

              <ArrowRightOutlined
                style={{
                  color: warmColors.primary,
                  fontSize: "18px",
                }}
              />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/profile")}
            style={{
              backgroundColor: warmColors.primary,
              borderColor: warmColors.primary,
              borderRadius: "8px",
              height: "48px",
              fontSize: "16px",
              fontWeight: "500",
              minWidth: "200px",
            }}
          >
            अभी शुरू करें
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FirstTimeUserCard;
