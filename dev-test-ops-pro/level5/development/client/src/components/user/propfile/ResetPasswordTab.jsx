import { useState } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { resetpassword } from "../../../services/user";

const ResetPasswordTab = ({ userId }) => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Professional warm color palette (matching ProfileCard and LoginPage)
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

  const handleSubmit = async (values) => {
    if (!userId) {
      Toast.show({
        icon: "fail",
        content: "Password reset cannot be completed. You are not logged in!",
        position: "center",
        duration: 4000,
      });
      return;
    }

    if (values.password !== values.confirmPassword) {
      Toast.show({
        icon: "fail",
        content: "Passwords do not match!",
        position: "center",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await resetpassword(userId, values.password);

      Toast.show({
        icon: "success",
        content: "Password reset successfully!",
        position: "center",
        duration: 3000,
      });

      // Clear form after success
      form.resetFields();
    } catch (error) {
      console.error("Password reset error:", error);
      Toast.show({
        icon: "fail",
        content: error || "An error occurred during password reset",
        position: "center",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: warmColors.background,
        borderRadius: "16px",
        padding: "30px 24px",
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
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
              borderRadius: "20px",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 24px ${warmColors.primary}30`,
            }}
          >
            <span style={{ fontSize: "32px", color: "white" }}>🔐</span>
          </div>
          <h2
            style={{
              color: warmColors.textPrimary,
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              lineHeight: "1.2",
            }}
          >
            Reset Your Password
          </h2>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "15px",
              margin: "0",
              fontWeight: "400",
              lineHeight: "1.4",
            }}
          >
            Enter your new password to secure your account
          </p>
        </div>

        {/* Form Section */}
        <Form
          form={form}
          onFinish={handleSubmit}
          footer={
            <Button
              block
              type="submit"
              loading={loading}
              disabled={loading}
              style={{
                background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                border: "none",
                fontWeight: "600",
                borderRadius: "16px",
                marginTop: "24px",
                height: "52px",
                fontSize: "16px",
                boxShadow: `0 6px 20px ${warmColors.primary}40`,
                transition: "all 0.3s ease",
                color: "white",
              }}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          }
        >
          <Form.Item
            name="password"
            label={
              <span
                style={{
                  color: warmColors.textPrimary,
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                New Password
              </span>
            }
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input
              placeholder="Enter new password"
              type={showPassword ? "text" : "password"}
              style={{
                "--border-radius": "16px",
                "--border": `2px solid ${warmColors.border}`,
                "--background-color": warmColors.cardBg,
                "--padding-left": "16px",
                "--padding-right": "50px",
                "--font-size": "16px",
                height: "52px",
                "--placeholder-color": warmColors.textSecondary,
                "--color": warmColors.textPrimary,
                marginBottom: "16px",
              }}
              onFocus={(e) => {
                e.target.style.setProperty(
                  "--border",
                  `2px solid ${warmColors.primary}`
                );
                e.target.style.setProperty(
                  "--background-color",
                  warmColors.cardBg
                );
              }}
              onBlur={(e) => {
                e.target.style.setProperty(
                  "--border",
                  `2px solid ${warmColors.border}`
                );
                e.target.style.setProperty(
                  "--background-color",
                  warmColors.cardBg
                );
              }}
              extra={
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    cursor: "pointer",
                    color: warmColors.primary,
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {showPassword ? <EyeOutline /> : <EyeInvisibleOutline />}
                </div>
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span
                style={{
                  color: warmColors.textPrimary,
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Confirm New Password
              </span>
            }
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input
              placeholder="Confirm your new password"
              type={showConfirmPassword ? "text" : "password"}
              style={{
                "--border-radius": "16px",
                "--border": `2px solid ${warmColors.border}`,
                "--background-color": warmColors.cardBg,
                "--padding-left": "16px",
                "--padding-right": "50px",
                "--font-size": "16px",
                height: "52px",
                "--placeholder-color": warmColors.textSecondary,
                "--color": warmColors.textPrimary,
              }}
              onFocus={(e) => {
                e.target.style.setProperty(
                  "--border",
                  `2px solid ${warmColors.primary}`
                );
                e.target.style.setProperty(
                  "--background-color",
                  warmColors.cardBg
                );
              }}
              onBlur={(e) => {
                e.target.style.setProperty(
                  "--border",
                  `2px solid ${warmColors.border}`
                );
                e.target.style.setProperty(
                  "--background-color",
                  warmColors.cardBg
                );
              }}
              extra={
                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    cursor: "pointer",
                    color: warmColors.primary,
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOutline />
                  ) : (
                    <EyeInvisibleOutline />
                  )}
                </div>
              }
            />
          </Form.Item>
        </Form>

        {/* Security Note */}
        <div
          style={{
            backgroundColor: `${warmColors.primary}08`,
            border: `1px solid ${warmColors.primary}20`,
            borderRadius: "12px",
            padding: "16px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "13px",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            🔒 <strong>Security Tip:</strong> Use a strong password with at
            least 6 characters, including numbers and special characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordTab;
