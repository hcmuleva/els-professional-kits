import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, EyeOutlined } from "@ant-design/icons";
import { getTempleLists } from "../../../../services/temple";

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
  borderRadius: "16px",
  boxShadow: `0 4px 16px ${warmColors.primary}12`,
  backgroundColor: warmColors.cardBg,
  border: `1px solid ${warmColors.border}`,
  marginBottom: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: warmColors.primary,
  borderColor: warmColors.primary,
  borderRadius: "12px",
  fontWeight: "600",
  height: "44px",
  marginBottom: "24px",
  boxShadow: `0 2px 8px ${warmColors.primary}30`,
};

const SuperAdminTempleList = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTempleLists().then((data) => {
      setTemples(data.data);
      setLoading(false);
    });
  }, []);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "transparent",
              color: warmColors.primary,
              border: `1px solid ${warmColors.primary}`,
              borderRadius: "12px",
              padding: "8px",
              minWidth: "auto",
              height: "40px",
              width: "40px",
            }}
          >
            <LeftOutlined />
          </Button>

          <Title
            level={3}
            style={{
              color: warmColors.textPrimary,
              fontWeight: "700",
              margin: 0,
              flex: 1,
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            मंदिर सूची
          </Title>
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Button
            style={buttonStyle}
            onClick={() => navigate("/superadmin/temples/new")}
          >
            नया मंदिर जोड़ें
          </Button>
        </div>

        <Spin spinning={loading}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              padding: "0 8px",
            }}
          >
            {temples?.map((temple) => (
              <Card
                key={temple.id}
                style={{
                  ...cardStyle,
                  ":hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px ${warmColors.primary}20`,
                  },
                }}
              >
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      margin: "0 auto 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: warmColors.background,
                      border: `2px solid ${warmColors.accent}`,
                      overflow: "hidden",
                    }}
                  >
                    {temple.attributes.images?.data?.[0]?.attributes?.url ? (
                      <img
                        src={temple.attributes.images.data[0].attributes.url}
                        alt={`${temple.attributes.title} temple icon`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span
                        role="img"
                        aria-label="temple"
                        style={{
                          fontSize: "32px",
                          lineHeight: "56px",
                          color: warmColors.primary,
                        }}
                      >
                        🛕
                      </span>
                    )}
                  </div>

                  <Title
                    level={5}
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: warmColors.textPrimary,
                      marginBottom: "8px",
                      textAlign: "center",
                      lineHeight: "1.4",
                    }}
                  >
                    {temple.attributes.title}
                  </Title>

                  {temple.attributes.subtitle && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: warmColors.textSecondary,
                        textAlign: "center",
                        lineHeight: "1.4",
                        marginBottom: "16px",
                      }}
                    >
                      {temple.attributes.subtitle}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                      marginTop: "12px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        navigate(`/superadmin/temple/${temple.id}`);
                      }}
                      style={{
                        backgroundColor: warmColors.primary,
                        borderColor: warmColors.primary,
                        borderRadius: "8px",
                        fontSize: "12px",
                        height: "32px",
                        flex: 1,
                        color: "white",
                      }}
                    >
                      <EyeOutlined style={{ marginRight: "4px" }} />
                      विवरण देखें
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Spin>

        {!loading && temples?.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 16px",
              color: warmColors.textSecondary,
            }}
          >
            <span
              role="img"
              aria-label="temple"
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                display: "block",
              }}
            >
              🛕
            </span>
            <Title level={4} style={{ color: warmColors.textSecondary }}>
              कोई मंदिर नहीं मिला
            </Title>
            <div style={{ marginTop: "8px" }}>
              नया मंदिर जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminTempleList;
