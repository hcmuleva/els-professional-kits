import React, { useState } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import { Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import { createTemple } from "../../../../services/temple";
import ImageUploaderSingle from "../../../fileupload/ImageUploaderSingle";

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
};

const buttonStyle = {
  backgroundColor: warmColors.primary,
  borderColor: warmColors.primary,
  borderRadius: "12px",
  fontWeight: "600",
  color: "white",
};

const inputStyle = {
  borderRadius: "8px",
  border: `1px solid ${warmColors.border}`,
  backgroundColor: warmColors.cardBg,
};

const SuperAdminTempleForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    images: [],
    qr_images: [],
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Toast.show("कृपया मंदिर का नाम दर्ज करें");
      return;
    }

    setLoading(true);
    try {
      const createData = {
        title: formData.title,
        subtitle: formData.subtitle,
        images: formData.images.map((img) => img.id),
        qr_images: formData.qr_images.map((img) => img.id),
      };

      await createTemple(createData);
      Toast.show("मंदिर सफलतापूर्वक बनाया गया!");
      navigate("/superadmin/temples");
    } catch (error) {
      Toast.show("मंदिर बनाने में त्रुटि हुई!");
      console.error("Creation error:", error);
    } finally {
      setLoading(false);
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
      {/* Background pattern */}
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
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header with back button */}
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
            नया मंदिर बनाएं
          </Title>
        </div>

        {/* Temple Form Card */}
        <Card style={cardStyle}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                मंदिर का नाम *
              </label>
              <Input
                value={formData.title}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, title: val }))
                }
                style={inputStyle}
                placeholder="मंदिर का नाम दर्ज करें"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                उपशीर्षक
              </label>
              <Input
                value={formData.subtitle}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, subtitle: val }))
                }
                style={inputStyle}
                placeholder="उपशीर्षक दर्ज करें"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                मंदिर की तस्वीर
              </label>
              <ImageUploaderSingle
                value={formData.images}
                onChange={(images) =>
                  setFormData((prev) => ({ ...prev, images }))
                }
                onUploadSuccess={(image) =>
                  console.log("Image uploaded:", image)
                }
                onRemove={() => console.log("Image removed")}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                QR कोड इमेज
              </label>
              <ImageUploaderSingle
                value={formData.qr_images}
                onChange={(qr_images) =>
                  setFormData((prev) => ({ ...prev, qr_images }))
                }
                onUploadSuccess={(image) =>
                  console.log("QR Image uploaded:", image)
                }
                onRemove={() => console.log("QR Image removed")}
              />
            </div>

            <div style={{ marginTop: "32px" }}>
              <Button
                onClick={handleSubmit}
                loading={loading}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  height: "48px",
                  fontSize: "16px",
                }}
              >
                <SaveOutlined style={{ marginRight: "8px" }} />
                मंदिर बनाएं e
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminTempleForm;
