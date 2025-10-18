import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
//import { getSubcategoryDetails } from "../../../../services/userrole";
//import UserCard from "./UserCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import { getSubcategoryDetails } from "../../services/userrole";
import DashboardCommiteeUserCard from "./DashboardCommiteeUserCard";
export default function DashboardCoreTeam({ templeId, subcategoryId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Track renders and API calls
  const renderCount = useRef(0);
  const apiCallCount = useRef(0);

  renderCount.current += 1;
  console.log(`🔄 CommittyDetail render #${renderCount.current}`);
  console.log("📋 Current params:", { templeId, subcategoryId });
  console.log("👥 Current users count:", users.length);

  // Professional warm color palette (matching LoginPage)
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

  const fetchUsers = useCallback(async () => {
    // Prevent unnecessary calls if params are missing
    if (!templeId || !subcategoryId) {
      console.log("❌ Missing params, skipping API call");
      setLoading(false);
      return;
    }

    apiCallCount.current += 1;
    console.log(`🌐 API call #${apiCallCount.current} with params:`, {
      templeId,
      subcategoryId,
    });

    try {
      setLoading(true);
      setError(null);
      const data = await getSubcategoryDetails(templeId, subcategoryId);

      //   console.log("📊 API Response:", data);
      //   console.log("📊 Response type:", typeof data);
      //   console.log("📊 Is array:", Array.isArray(data));

      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        console.log("✅ Setting users data:", data.length, "items");
        setUsers(data);
      } else {
        console.error("❌ Expected array but got:", typeof data, data);
        setUsers([]);
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setError("Failed to fetch committee members");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [templeId, subcategoryId]);

  useEffect(() => {
    console.log("🎯 useEffect triggered");
    fetchUsers();
  }, [fetchUsers]);

  // Debug: Log users data structure
  useEffect(() => {
    if (users.length > 0) {
      console.log("👥 Users structure sample:", users[0]);
      console.log(
        "🔑 Users IDs:",
        users.map((user) => user.id || user._id || "NO_ID")
      );
    }
  }, [users]);

  // Loading Component
  const LoadingComponent = () => (
    <div
      style={{
        minHeight: "20vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: warmColors.background,
        borderRadius: "20px",
        padding: "10px",
        margin: "10px 0",
        border: `1px solid ${warmColors.border}`,
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "3px solid white",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
      <p
        style={{
          color: warmColors.textPrimary,
          fontSize: "18px",
          fontWeight: "500",
          margin: "0",
          textAlign: "center",
        }}
      >
        Loading committee members...
      </p>
      <p
        style={{
          color: warmColors.textSecondary,
          fontSize: "14px",
          margin: "8px 0 0 0",
          textAlign: "center",
        }}
      >
        Please wait while we fetch the data
      </p>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: warmColors.cardBg,
        borderRadius: "20px",
        padding: "10px",
        margin: "10px 0",
        border: `1px solid ${warmColors.border}`,
        boxShadow: `0 4px 16px ${warmColors.error}15`,
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${warmColors.error}15 0%, ${warmColors.error}25 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "32px", color: warmColors.error }}>⚠️</span>
      </div>
      <p
        style={{
          color: warmColors.textPrimary,
          fontSize: "18px",
          fontWeight: "600",
          margin: "0 0 8px 0",
          textAlign: "center",
        }}
      >
        Oops! Something went wrong
      </p>
      <p
        style={{
          color: warmColors.textSecondary,
          fontSize: "14px",
          margin: "0 0 24px 0",
          textAlign: "center",
        }}
      >
        {error}
      </p>
      <Button
        onClick={fetchUsers}
        style={{
          background: `linear-gradient(135deg, ${warmColors.primary} 0%, ${warmColors.secondary} 100%)`,
          border: "none",
          fontWeight: "600",
          borderRadius: "16px",
          height: "48px",
          fontSize: "14px",
          padding: "0 24px",
          boxShadow: `0 4px 16px ${warmColors.primary}40`,
          color: "white",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = `0 6px 20px ${warmColors.primary}50`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = `0 4px 16px ${warmColors.primary}40`;
        }}
      >
        Try Again
      </Button>
    </div>
  );

  // No Users Component
  const NoUsersComponent = () => (
    <div
      style={{
        minHeight: "25vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: warmColors.cardBg,
        borderRadius: "20px",
        padding: "10px",
        margin: "10px 0",
        border: `1px solid ${warmColors.border}`,
        boxShadow: `0 4px 16px ${warmColors.primary}10`,
      }}
    >
      <div
        style={{
          width: "80px",
          height: "40px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${warmColors.primary}15 0%, ${warmColors.accent}15 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "32px", color: warmColors.primary }}>👥</span>
      </div>
      <p
        style={{
          color: warmColors.textPrimary,
          fontSize: "18px",
          fontWeight: "600",
          margin: "0 0 8px 0",
          textAlign: "center",
        }}
      >
        No committee members found
      </p>
      <p
        style={{
          color: warmColors.textSecondary,
          fontSize: "14px",
          margin: "0",
          textAlign: "center",
        }}
      >
        There are no members in this committee yet
      </p>
    </div>
  );

  // Marquee Component for User Cards
  const MarqueeUserCards = () => {
    // Duplicate users array for seamless infinite scroll
    const duplicatedUsers = [...users, ...users];

    return (
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          background: `linear-gradient(135deg, ${warmColors.background} 0%, ${warmColors.cardBg} 100%)`,
          borderRadius: "20px",
          padding: "10px 0",
          boxShadow: `0 8px 32px ${warmColors.primary}10`,
        }}
      >
        {/* Gradient fade edges */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100px",
            height: "100%",
            background: `linear-gradient(to right, ${warmColors.background} 0%, transparent 100%)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100px",
            height: "10%",
            background: `linear-gradient(to left, ${warmColors.background} 0%, transparent 100%)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Marquee container */}
        <div
          className="marquee-container"
          style={{
            display: "flex",
            gap: "3px",
            animation: "marquee 5s linear infinite",
            willChange: "transform",
          }}
        >
          {duplicatedUsers.map((user, index) => {
            const key = `${user.id || user._id || index}-${index}`;
            return (
              <div
                key={key}
                style={{
                  minWidth: "180px",
                  maxWidth: "280px",
                  flexShrink: 0,
                }}
              >
                <DashboardCommiteeUserCard
                  userData={user?.attributes?.user}
                  userrole={user?.attributes?.categoryrole?.data?.attributes}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    console.log("⏳ Showing loading state");
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          padding: "10px 20px", // top/bottom then left/right
        }}
      >
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    console.log("❌ Showing error state:", error);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          padding: "10px 20px", // top/bottom then left/right
        }}
      >
        <ErrorComponent />
      </div>
    );
  }

  console.log("🎨 Rendering user list with", users.length, "users");

  return (
    <div
      style={{
        background: warmColors.background,
        padding: "20px",
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
          backgroundImage: `radial-gradient(circle at 25% 25%, ${warmColors.primary}05 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, ${warmColors.accent}05 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header with Back Button */}

        {/* Title Section */}
        <div
          style={{
            marginBottom: "1px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: warmColors.textPrimary,
              fontSize: "32px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              lineHeight: "1.2",
            }}
          >
            Committee Members
          </h1>
          <p
            style={{
              color: warmColors.textSecondary,
              fontSize: "16px",
              margin: "0",
              fontWeight: "400",
            }}
          >
            {users.length > 0 ? `${users.length} members found` : ""}
          </p>
        </div>

        {/* Marquee User Cards */}
        <div style={{ marginBottom: "0px" }}>
          {users.length > 0 ? <MarqueeUserCards /> : <NoUsersComponent />}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-container {
            animation-duration: 1.3s;
          }
        }

        @media (max-width: 480px) {
          .marquee-container {
            animation-duration: 1.7s;
          }
        }
      `}</style>
    </div>
  );
}
