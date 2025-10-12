import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { login } from "../../services/auth";

export default function LoginPage({ onForgotPassword }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const authcontext = useContext(AuthContext);

  // Professional warm color palette (matching ProfileCard)
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

  const handleLogin = async (values) => {
    console.log("Form Values:", values);

    const { username, password } = values;

    if (!username || !password) {
      Toast.show({ content: "Please enter all fields", position: "bottom" });
      return;
    }
    try {
      const { jwt, user } = await login(username, password);
      await authcontext.login(jwt, user);

      navigate("/dashboard", { replace: true }); // home, dashboard
    } catch (error) {
      console.error(error);
      Toast.show("Enter Valid Id/Password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: warmColors.background,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
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

      {/* Main Login Card */}
      <div
        style={{
          backgroundColor: warmColors.cardBg,
          borderRadius: "24px",
          padding: "40px 30px",
          margin: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(139, 69, 19, 0.12)",
          border: `1px solid ${warmColors.border}`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
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
              overflow: "hidden",
            }}
          >
            <img
              src="/logo.svg"
              alt="Emeelan Logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
              }}
              onError={(e) => {
                // Fallback to emoji if logo fails to load
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="fontSize: 32px; color: white">🏠</span>';
              }}
            />
          </div>
          <h2
            style={{
              color: warmColors.textPrimary,
              fontSize: "28px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              lineHeight: "1.2",
            }}
          >
            {" "}
            <span
              style={{
                fontSize: "36px",
                fontWeight: "700",
                background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              सीरवी समाज
            </span>
          </h2>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "16px",
              margin: "0",
              fontWeight: "400",
            }}
          >
            सीरवी समाज में आपका स्वागत है
          </p>
        </div>

        <Form
          onFinish={handleLogin}
          footer={
            <Button
              block
              type="submit"
              color="primary"
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
              }}
            >
              Sign In
            </Button>
          }
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Mobile is required" }]}
          >
            <Input
              placeholder="Mobile or Email"
              style={{
                "--border-radius": "16px",
                "--border": `2px solid ${warmColors.border}`,
                "--background-color": warmColors.background,
                "--padding-left": "16px",
                "--padding-right": "16px",
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
                  warmColors.background
                );
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input
              placeholder="Password"
              type={visible ? "text" : "password"}
              style={{
                "--border-radius": "16px",
                "--border": `2px solid ${warmColors.border}`,
                "--background-color": warmColors.background,
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
                  warmColors.background
                );
              }}
              extra={
                <div
                  onClick={() => setVisible((v) => !v)}
                  style={{
                    cursor: "pointer",
                    color: warmColors.primary,
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {visible ? <EyeOutline /> : <EyeInvisibleOutline />}
                </div>
              }
            />
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            fontSize: "15px",
            color: warmColors.textSecondary,
            paddingTop: "20px",
            borderTop: `1px solid ${warmColors.border}`,
          }}
        >
          मेरा अकाउंट नहीं है?{" "}
          <span
            style={{
              color: warmColors.primary,
              fontWeight: "600",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onClick={() => navigate(`/register`)}
            onMouseEnter={(e) => (e.target.style.color = warmColors.secondary)}
            onMouseLeave={(e) => (e.target.style.color = warmColors.primary)}
          >
            रजिस्टर करने के लिए यहाँ क्लिक करे
          </span>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: warmColors.textSecondary,
          fontSize: "12px",
          fontWeight: "500",
          opacity: 0.8,
        }}
      >
        Secure • Professional • Trusted
      </div>
    </div>
  );
}
