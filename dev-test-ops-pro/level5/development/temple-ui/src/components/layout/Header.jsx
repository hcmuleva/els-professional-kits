import { Avatar } from "antd-mobile";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export const Header = () => {
  const { user } = useContext(AuthContext);

  // Professional warm color palette
  const warmColors = {
    primary: "#8B4513",
    secondary: "#A0522D",
    accent: "#CD853F",
    background: "#FAFAFA",
    cardBg: "#FFFFFF",
    textPrimary: "#2C2C2C",
    textSecondary: "#666666",
    border: "#E8E8E8",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "120px",
        width: "100%",
        background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
        boxShadow: `0 4px 20px ${warmColors.primary}25`,
        padding: "12px",
        borderRadius: "0 0 20px 20px",
        position: "relative",
        overflow: "hidden",
        paddingTop: "30px",
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
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          height: "80px",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left side - User info */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Avatar
            src={user?.profilePicture?.url || "/default-avatar.png"}
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div style={{ marginLeft: "15px", lineHeight: 1.3 }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "2px",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              {user?.first_name} {user?.last_name}
            </div>
            {user?.father && (
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: "400",
                  marginBottom: "3px",
                }}
              >
                S/o {user.father}
              </div>
            )}
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "4px 12px",
                borderRadius: "12px",
                display: "inline-block",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {user?.userrole || "USER"}
            </div>
          </div>
        </div>

        {/* Right side - Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "16px",
              padding: "8px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src="/logo.svg"
              alt="Emeelan Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
              }}
              onError={(e) => {
                // Fallback to emoji if logo fails to load
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="fontSize: 24px; color: white">🏠</span>';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
