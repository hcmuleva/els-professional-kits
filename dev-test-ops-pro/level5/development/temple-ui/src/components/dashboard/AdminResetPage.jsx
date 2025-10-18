// src/components/dashboard/AdminResetPage.jsx
import { useEffect, useState } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { resetpassword } from "../../services/user";
import { useNavigate, useParams } from "react-router-dom";

const AdminResetPage = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { templeadminId, familyId, userId } = useParams();

  // Updated styles to match the address UI theme
  const styles = {
    container: {
      padding: "16px",
      backgroundColor: "#fef6f0",
      minHeight: "100vh",
    },
    headerCard: {
      backgroundColor: "#f97316",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    backButton: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      padding: "8px 12px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    backButtonHover: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      transform: "translateY(-50%) scale(1.02)",
    },
    headerContent: {
      textAlign: "center",
      paddingLeft: "80px",
      paddingRight: "80px",
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "8px",
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#fff7ed",
      fontWeight: "500",
    },
    formCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      marginBottom: "20px",
    },
    formSection: {
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#7c2d12",
      marginBottom: "16px",
      padding: "12px 0",
      borderBottom: "2px solid #fed7aa",
    },
    formLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#9a3412",
      marginBottom: "8px",
      display: "block",
    },
    inputStyle: {
      "--border-radius": "8px",
      "--border": "2px solid #e5e7eb",
      "--background-color": "#ffffff",
      "--padding-left": "16px",
      "--padding-right": "50px",
      "--font-size": "16px",
      height: "48px",
      "--placeholder-color": "#9ca3af",
      "--color": "#374151",
      marginBottom: "16px",
    },
    inputFocusStyle: {
      "--border": "2px solid #f97316",
      "--background-color": "#ffffff",
    },
    eyeIcon: {
      cursor: "pointer",
      color: "#f97316",
      padding: "8px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    submitButton: {
      backgroundColor: "#f97316",
      border: "none",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "600",
      height: "48px",
      width: "100%",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "16px",
    },
    submitButtonHover: {
      backgroundColor: "#ea580c",
      transform: "translateY(-1px)",
    },
    submitButtonDisabled: {
      backgroundColor: "#d1d5db",
      cursor: "not-allowed",
      transform: "none",
    },
    securityNote: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "16px",
      marginTop: "20px",
      borderLeft: "4px solid #f97316",
    },
    securityNoteText: {
      color: "#64748b",
      fontSize: "14px",
      margin: "0",
      lineHeight: "1.5",
    },
    securityNoteStrong: {
      color: "#f97316",
      fontWeight: "600",
    },
    statsCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "12px",
    },
    statItem: {
      textAlign: "center",
      padding: "12px",
      backgroundColor: "#f8fafc",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    },
    statIcon: {
      fontSize: "24px",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  }, []);

  const handleSubmit = async (values) => {
    if (!userId) {
      Toast.show({
        icon: "fail",
        content: "Password reset cannot be completed. No user ID provided!",
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
      form.resetFields();
      // Navigate back to family page
      navigate(`/templeadmin/${templeadminId}/familyadmin/${familyId}`);
    } catch (error) {
      console.error("Password reset error:", error);
      Toast.show({
        icon: "fail",
        content: error.message || "An error occurred during password reset",
        position: "center",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerCard}>
        <button
          style={styles.backButton}
          onClick={handleGoBack}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.backButtonHover.backgroundColor;
            e.currentTarget.style.transform = styles.backButtonHover.transform;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.backButton.backgroundColor;
            e.currentTarget.style.transform = styles.backButton.transform;
          }}
        >
          ← Back
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>🔐 Password Reset</h1>
          <p style={styles.headerSubtitle}>
            Reset password for User ID: {userId}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={styles.formCard}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>🔐 Update Password</h2>

          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="password"
              label={
                <span style={styles.formLabel}>New Password / नया पासवर्ड</span>
              }
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                style={styles.inputStyle}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.inputFocusStyle);
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    styles.inputStyle["--border"]
                  );
                }}
                extra={
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? <EyeOutline /> : <EyeInvisibleOutline />}
                  </div>
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span style={styles.formLabel}>
                  Confirm New Password / पासवर्ड की पुष्टि करें
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
                style={styles.inputStyle}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.inputFocusStyle);
                }}
                onBlur={(e) => {
                  e.target.style.setProperty(
                    "--border",
                    styles.inputStyle["--border"]
                  );
                }}
                extra={
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
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

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  Object.assign(
                    e.currentTarget.style,
                    styles.submitButtonHover
                  );
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    styles.submitButton.backgroundColor;
                  e.currentTarget.style.transform = "none";
                }
              }}
            >
              {loading ? "🔄 Updating Password..." : "🔐 Update Password"}
            </button>
          </Form>
        </div>
      </div>

      {/* Security Note */}
      <div style={styles.securityNote}>
        <p style={styles.securityNoteText}>
          <span style={styles.securityNoteStrong}>🔒 Security Tip:</span> Use a
          strong password with at least 6 characters, including numbers and
          special characters for better security.
        </p>
      </div>
    </div>
  );
};

export default AdminResetPage;
