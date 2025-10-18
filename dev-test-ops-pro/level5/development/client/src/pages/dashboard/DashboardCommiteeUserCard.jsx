import React, { useState, useCallback } from "react";

const DashboardCommiteeUserCard = ({ userData, userrole }) => {
  const userAttributes = userData?.data?.attributes || {};
  const [imageError, setImageError] = useState(false);

  // Check if user is female for privacy protection
  const isFemale = userAttributes.gender?.toLowerCase() === "female";

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

  // Privacy placeholder for female users
  const getPrivacyPlaceholder = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "62px",
        height: "62px",
        borderRadius: "14px",
        backgroundColor: warmColors.privacy,
        border: `2px solid ${warmColors.cardBg}`,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 10.5V12.5C15 13.3 14.3 14 13.5 14H10.5C9.7 14 9 13.3 9 12.5V10.5C9 9.7 9.7 9 10.5 9H13.5C14.3 9 15 9.7 15 10.5Z"
          fill="white"
        />
      </svg>
    </div>
  );

  return (
    <div
      className="professional-card"
      style={{
        backgroundColor: warmColors.cardBg,
        borderRadius: "20px",
        padding: "20px",
        margin: "6px 0",
        padding: "10px 20px",
        boxShadow: `0 6px 24px ${warmColors.primary}15`,
        border: `1px solid ${warmColors.border}`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        opacity: isFemale ? 0.7 : 1,
        height: "160px",
        minHeight: "180px",
        overflow: "hidden", // Prevent content overflow
      }}
      onMouseEnter={(e) => {
        if (!isFemale) {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = `0 8px 32px ${warmColors.primary}25`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isFemale) {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = `0 6px 24px ${warmColors.primary}15`;
        }
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isFemale
            ? `linear-gradient(135deg, ${warmColors.privacy}05 0%, ${warmColors.privacy}10 100%)`
            : `linear-gradient(135deg, ${warmColors.primary}03 0%, ${warmColors.accent}03 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Avatar Section */}
      <div
        className="avatar-container"
        style={{
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "18px",
            background: isFemale
              ? `linear-gradient(135deg, ${warmColors.privacy}20 0%, ${warmColors.privacy}20 100%)`
              : `linear-gradient(135deg, ${warmColors.primary}20 0%, ${warmColors.secondary}20 100%)`,
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 16px ${
              isFemale ? warmColors.privacy : warmColors.primary
            }25`,
          }}
        >
          {isFemale ? (
            getPrivacyPlaceholder()
          ) : (
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
          )}
        </div>
      </div>

      {/* Info Section */}
      <div
        className="info-section"
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          maxHeight: "240px",
          overflowY: "auto",
        }}
      >
        <div className="details">
          <h2
            className="name"
            style={{
              color: warmColors.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
            }}
          >
            {`${userAttributes.first_name || "N/A"} ${
              userAttributes.father || ""
            }`.trim()}
          </h2>

          <p
            className="detail-line"
            style={{
              color: warmColors.textSecondary,
              fontSize: "14px",
              fontWeight: "400",
              margin: "0 0 6px 0",
              lineHeight: "1.4",
            }}
          >
            <strong> {userAttributes.last_name || ""}</strong>
          </p>

          <p
            className="detail-line"
            style={{
              color: warmColors.textSecondary,
              fontSize: "14px",
              fontWeight: "400",
              margin: "0 0 6px 0",
              lineHeight: "1.4",
            }}
          >
            <strong> {userAttributes.gotra || ""}</strong>
          </p>

          {!isFemale && (
            <>
              {userAttributes.mobile && (
                <p
                  className="detail-line"
                  style={{
                    color: warmColors.textSecondary,
                    fontSize: "14px",
                    fontWeight: "400",
                    margin: "0 0 6px 0",
                    lineHeight: "1.4",
                  }}
                >
                  <strong>Mobile:</strong> {userAttributes.mobile}
                </p>
              )}
            </>
          )}

          {userAttributes.profession && (
            <p
              className="detail-line"
              style={{
                color: warmColors.textSecondary,
                fontSize: "14px",
                fontWeight: "400",
                margin: "0 0 6px 0",
                lineHeight: "1.4",
              }}
            >
              <strong>Profession:</strong> {userAttributes.profession}
            </p>
          )}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: isFemale
                ? `linear-gradient(135deg, ${warmColors.privacy}15 0%, ${warmColors.privacy}15 100%)`
                : `linear-gradient(135deg, ${warmColors.primary}15 0%, ${warmColors.accent}15 100%)`,
              color: isFemale ? warmColors.privacy : warmColors.primary,
              fontSize: "12px",
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "12px",
              border: `1px solid ${
                isFemale ? warmColors.privacy : warmColors.primary
              }30`,
              marginTop: "4px",
            }}
          >
            {userrole?.name || "N/A"}
          </div>
        </div>
      </div>

      {/* Committee Role Tag (if exists) */}
      {userAttributes.committee_role && !isFemale && (
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

      {/* Privacy Notice for Female Users */}
      {isFemale && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: `linear-gradient(135deg, ${warmColors.privacy} 0%, #757575 100%)`,
            color: "white",
            fontSize: "10px",
            fontWeight: "600",
            padding: "4px 8px",
            borderRadius: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 2,
            boxShadow: `0 2px 8px ${warmColors.privacy}40`,
          }}
        >
          🔒 Privacy Mode
        </div>
      )}
    </div>
  );
};

export default DashboardCommiteeUserCard;
