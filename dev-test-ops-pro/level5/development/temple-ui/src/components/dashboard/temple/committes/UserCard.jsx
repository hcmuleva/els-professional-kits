import React, { useState, useCallback } from "react";

const UserCard = ({ userData, userrole }) => {
  const userAttributes = userData?.data?.attributes || {};
  const [imageError, setImageError] = useState(false);

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
    privacy: "#9E9E9E",
  };

  const handleImageError = useCallback(
    (e) => {
      if (!imageError) {
        setImageError(true);
        e.target.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+";
      }
    },
    [imageError]
  );

  return (
    <div
      className="professional-card"
      style={{
        backgroundColor: warmColors.cardBg,
        borderRadius: "20px",
        padding: "20px",
        margin: "12px 0",
        boxShadow: `0 6px 24px ${warmColors.primary}15`,
        border: `1px solid ${warmColors.border}`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = `0 8px 32px ${warmColors.primary}25`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = `0 6px 24px ${warmColors.primary}15`;
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${warmColors.primary}03 0%, ${warmColors.accent}03 100%)`,
          pointerEvents: "none",
        }}
      />

      <div
        className="avatar-container"
        style={{ position: "relative", zIndex: 1, flexShrink: 0 }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "18px",
            background: `linear-gradient(135deg, ${warmColors.primary}20 0%, ${warmColors.secondary}20 100%)`,
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 16px ${warmColors.primary}25`,
          }}
        >
          <img
            src={
              imageError
                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+"
                : userAttributes?.profilePicture?.data?.attributes?.url ||
                  "/default-avatar.png"
            }
            alt="Profile"
            className="avatar"
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "14px",
              objectFit: "cover",
              border: `2px solid ${warmColors.cardBg}`,
            }}
            onError={handleImageError}
          />
        </div>
      </div>

      <div
        className="info-section"
        style={{ flex: 1, position: "relative", zIndex: 1, minWidth: 0 }}
      >
        <div className="details">
          <h2
            style={{
              color: warmColors.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 8px 0",
            }}
          >
            {`${userAttributes.first_name || "N/A"} ${
              userAttributes.last_name || ""
            }`.trim()}
          </h2>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "14px",
              margin: "0 0 6px",
            }}
          >
            <strong>Gender:</strong> {userAttributes.gender || "N/A"}
          </p>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "14px",
              margin: "0 0 6px",
            }}
          >
            <strong>Father:</strong> {userAttributes.father || "N/A"}
          </p>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "14px",
              margin: "0 0 6px",
            }}
          >
            <strong>Gotra:</strong> {userAttributes.gotra || "N/A"}
          </p>

          {userAttributes.mobile && (
            <p
              style={{
                color: warmColors.textSecondary,
                fontSize: "14px",
                margin: "0 0 6px",
              }}
            >
              <strong>Mobile:</strong> {userAttributes.mobile}
            </p>
          )}
          {userAttributes.email && (
            <p
              style={{
                color: warmColors.textSecondary,
                fontSize: "14px",
                margin: "0 0 6px",
              }}
            >
              <strong>Email:</strong> {userAttributes.email}
            </p>
          )}
          {userAttributes.dob && (
            <p
              style={{
                color: warmColors.textSecondary,
                fontSize: "14px",
                margin: "0 0 6px",
              }}
            >
              <strong>DOB:</strong>{" "}
              {new Date(userAttributes.dob).toLocaleDateString()}
            </p>
          )}
          {userAttributes.profession && (
            <p
              style={{
                color: warmColors.textSecondary,
                fontSize: "14px",
                margin: "0 0 6px",
              }}
            >
              <strong>Profession:</strong> {userAttributes.profession}
            </p>
          )}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: `linear-gradient(135deg, ${warmColors.primary}15 0%, ${warmColors.accent}15 100%)`,
              color: warmColors.primary,
              fontSize: "12px",
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "12px",
              border: `1px solid ${warmColors.primary}30`,
              marginTop: "4px",
            }}
          >
            {userrole?.name || "N/A"}
          </div>
        </div>
      </div>

      {userAttributes.committee_role && (
        <div
          className="role-tag"
          style={{
            position: "absolute",
            top: "50px",
            right: "16px",
            background: `linear-gradient(135deg, ${warmColors.secondary} 0%, ${warmColors.primary} 100%)`,
            color: "white",
            fontSize: "11px",
            fontWeight: "600",
            padding: "4px 8px",
            borderRadius: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 2,
            boxShadow: `0 2px 8px ${warmColors.primary}40`,
          }}
        >
          {userAttributes.committee_role}
        </div>
      )}
    </div>
  );
};

export default UserCard;
