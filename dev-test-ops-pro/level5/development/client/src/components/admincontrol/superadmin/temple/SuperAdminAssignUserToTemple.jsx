import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Typography, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import { getTempleLists } from "../../../../services/temple";
import AssignUserModal from "./AssignUserModel";

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

const SuperAdminAssignUserToTemple = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemples, setSelectedTemples] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTempleLists().then((data) => {
      setTemples(data.data);
      setLoading(false);
    });
  }, []);

  const handleTempleSelect = (templeId) => {
    setSelectedTemples((prev) => {
      if (prev.includes(templeId)) {
        return prev.filter((id) => id !== templeId);
      } else {
        return [...prev, templeId];
      }
    });
  };

  const handleAssignUsers = () => {
    if (selectedTemples.length === 0) {
      Modal.warning({
        title: "चेतावनी",
        content: "कृपया कम से कम एक मंदिर चुनें",
      });
      return;
    }
    setShowAssignModal(true);
  };

  const handleSelectAll = () => {
    if (selectedTemples.length === temples.length) {
      setSelectedTemples([]);
    } else {
      setSelectedTemples(temples.map((temple) => temple.id));
    }
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
        {/* Header */}
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
            मंदिर में यूजर असाइन करें
          </Title>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            style={{
              ...buttonStyle,
              backgroundColor:
                selectedTemples.length === temples.length
                  ? warmColors.accent
                  : warmColors.primary,
            }}
            onClick={handleSelectAll}
          >
            {selectedTemples.length === temples.length
              ? "सभी अचुनें"
              : "सभी चुनें"}
          </Button>

          <Button
            style={{
              ...buttonStyle,
              backgroundColor: warmColors.success,
              borderColor: warmColors.success,
            }}
            onClick={handleAssignUsers}
            disabled={selectedTemples.length === 0}
          >
            <UserAddOutlined style={{ marginRight: "8px" }} />
            यूजर असाइन करें ({selectedTemples.length})
          </Button>
        </div>

        {/* Selection Info */}
        {selectedTemples.length > 0 && (
          <Card
            style={{
              marginBottom: "24px",
              backgroundColor: `${warmColors.primary}10`,
              border: `1px solid ${warmColors.primary}30`,
              borderRadius: "12px",
            }}
          >
            <div style={{ textAlign: "center", padding: "8px" }}>
              <span style={{ color: warmColors.primary, fontWeight: "600" }}>
                {selectedTemples.length} मंदिर चुने गए हैं
              </span>
            </div>
          </Card>
        )}

        {/* Temple List */}
        <Spin spinning={loading}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              padding: "0 8px",
            }}
          >
            {temples?.map((temple) => {
              const isSelected = selectedTemples.includes(temple.id);
              return (
                <Card
                  key={temple.id}
                  style={{
                    ...cardStyle,
                    border: isSelected
                      ? `3px solid ${warmColors.primary}`
                      : `1px solid ${warmColors.border}`,
                    backgroundColor: isSelected
                      ? `${warmColors.primary}08`
                      : warmColors.cardBg,
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                  onClick={() => handleTempleSelect(temple.id)}
                >
                  <div style={{ padding: "16px", position: "relative" }}>
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "24px",
                          height: "24px",
                          backgroundColor: warmColors.primary,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}

                    {/* Temple Image/Icon */}
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
                        border: `2px solid ${
                          isSelected ? warmColors.primary : warmColors.accent
                        }`,
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
                            color: isSelected
                              ? warmColors.primary
                              : warmColors.accent,
                          }}
                        >
                          🛕
                        </span>
                      )}
                    </div>

                    {/* Temple Details */}
                    <Title
                      level={5}
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: isSelected
                          ? warmColors.primary
                          : warmColors.textPrimary,
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

                    {/* Temple Address */}
                    {temple.attributes.address?.data && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: warmColors.textSecondary,
                          textAlign: "center",
                          lineHeight: "1.3",
                          marginBottom: "12px",
                          padding: "4px 8px",
                          backgroundColor: warmColors.background,
                          borderRadius: "4px",
                        }}
                      >
                        📍 {temple.attributes.address.data.attributes.district},{" "}
                        {temple.attributes.address.data.attributes.state}
                      </div>
                    )}

                    {/* Action Button */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                        marginTop: "12px",
                      }}
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/superadmin/temple/${temple.id}`);
                        }}
                        style={{
                          backgroundColor: "transparent",
                          borderColor: warmColors.primary,
                          borderRadius: "8px",
                          fontSize: "12px",
                          height: "32px",
                          flex: 1,
                          color: warmColors.primary,
                        }}
                      >
                        <EyeOutlined style={{ marginRight: "4px" }} />
                        विवरण देखें
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Spin>

        {/* Empty State */}
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
          </div>
        )}
      </div>

      {/* Assign User Modal */}
      <AssignUserModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        selectedTemples={selectedTemples}
        temples={temples}
        onSuccess={() => {
          setSelectedTemples([]);
          setShowAssignModal(false);
        }}
      />
    </div>
  );
};

export default SuperAdminAssignUserToTemple;
