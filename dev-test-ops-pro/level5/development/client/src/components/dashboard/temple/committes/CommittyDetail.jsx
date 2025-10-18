import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSubcategoryDetails } from "../../../../services/userrole";
import UserCard from "./UserCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";

export default function CommittyDetail() {
  const navigate = useNavigate();
  const { templeId, subcategoryId } = useParams();
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

      console.log("📊 API Response:", data);
      console.log("📊 Response type:", typeof data);
      console.log("📊 Is array:", Array.isArray(data));

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
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: warmColors.background,
        borderRadius: "20px",
        padding: "40px",
        margin: "20px 0",
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
          marginBottom: "20px",
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
        padding: "40px",
        margin: "20px 0",
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
          marginBottom: "20px",
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
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: warmColors.cardBg,
        borderRadius: "20px",
        padding: "40px",
        margin: "20px 0",
        border: `1px solid ${warmColors.border}`,
        boxShadow: `0 4px 16px ${warmColors.primary}10`,
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${warmColors.primary}15 0%, ${warmColors.accent}15 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
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

  if (loading) {
    console.log("⏳ Showing loading state");
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          padding: "20px",
        }}
      >
        <Row justify="start" style={{ marginBottom: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              fontSize: 16,
              color: warmColors.primary,
              fontWeight: "500",
              height: "40px",
              padding: "0 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${warmColors.primary}10`;
              e.target.style.color = warmColors.secondary;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = warmColors.primary;
            }}
          >
            वापस जाएं
          </Button>
        </Row>
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
          padding: "20px",
        }}
      >
        <Row justify="start" style={{ marginBottom: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              fontSize: 16,
              color: warmColors.primary,
              fontWeight: "500",
              height: "40px",
              padding: "0 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${warmColors.primary}10`;
              e.target.style.color = warmColors.secondary;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = warmColors.primary;
            }}
          >
            वापस जाएं
          </Button>
        </Row>
        <ErrorComponent />
      </div>
    );
  }

  console.log("🎨 Rendering user list with", users.length, "users");

  return (
    <div
      style={{
        minHeight: "100vh",
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
        <Row justify="start" style={{ marginBottom: 24 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              fontSize: 16,
              color: warmColors.primary,
              fontWeight: "500",
              height: "40px",
              padding: "0 16px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${warmColors.primary}10`;
              e.target.style.color = warmColors.secondary;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = warmColors.primary;
            }}
          >
            वापस जाएं
          </Button>
        </Row>

        {/* Title Section */}
        <div
          style={{
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: warmColors.textPrimary,
              fontSize: "28px",
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

        {/* User List */}
        <div
          className="user-list"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {users.length > 0 ? (
            users.map((user, index) => {
              const key = user.id || user._id || `user-${index}`;
              console.log(
                `🔑 Rendering user ${index} with key:`,
                key,
                " userObject",
                user?.attributes?.categoryrole?.data?.attributes
              );
              return (
                <UserCard
                  key={key}
                  userData={user?.attributes?.user}
                  userrole={user?.attributes?.categoryrole?.data?.attributes}
                />
              );
            })
          ) : (
            <NoUsersComponent />
          )}
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

        @media (max-width: 768px) {
          .user-list {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
