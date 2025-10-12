import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "antd-mobile";
import { getTempleSubcategories } from "../../../../../services/temple";
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
};

export default function CommunityList({ refreshTrigger }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        setLoading(true);
        const response = await getTempleSubcategories(id);
        setData(response.data.attributes.subcategories?.data || []);
      } catch (err) {
        console.error("Error fetching subcategories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [id, refreshTrigger]);

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: warmColors.background,
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
        कमिटी लिस्ट
      </Title>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "16px",
          padding: "0 8px",
        }}
      >
        {data?.map((item, index) => (
          <Card
            key={index}
            style={{
              ...cardStyle,
              ":hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 24px ${warmColors.primary}20`,
              },
            }}
            onClick={() => navigate(`/temple/${id}/subcategory/${item.id}`)}
          >
            <div style={{ padding: "16px" }}>
              <div style={iconContainerStyle}>
                <span role="img" aria-label="icon" style={{ fontSize: "28px" }}>
                  {item?.attributes?.icon || "🏛"}
                </span>
              </div>
              <Title level={5} style={cardTitleStyle}>
                {item?.attributes.name_hi || "समिति"}
              </Title>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
