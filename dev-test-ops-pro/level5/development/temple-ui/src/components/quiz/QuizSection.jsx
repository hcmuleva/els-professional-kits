import React, { useState } from "react";
import Leaderboards from "./Leaderboards";
import TakeQuiz from "./TakeQuiz";
import QuizCreator from "./QuizCreator";
import BrowseContent from "./BrowseContent";
import { ContentUpload } from "./ContentUpload";

// DropdownNavigation component
const DropdownNavigation = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const tabs = [
    { key: "home", label: "🏠 Home", icon: "🏠" },
    { key: "create", label: "✨ Create", icon: "✨" },
    { key: "take", label: "🎮 Take Quiz", icon: "🎮" },
    { key: "browse", label: "📚 Browse", icon: "📚" },
    { key: "leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
  ];

  const handleTabClick = (key) => {
    setActiveTab(key);
    setIsOpen(false); // Close dropdown after selecting a tab
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(102, 126, 234, 0.15)",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "capitalize",
          }}
        >
          {tabs.find((tab) => tab.key === activeTab)?.label || activeTab}
        </h1>
        <Button
          type="ghost"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "6px 10px",
            fontSize: "18px",
            border: "1px solid #667eea",
            borderRadius: "6px",
            color: "#667eea",
            transition: "all 0.2s ease",
            ":hover": {
              background: "rgba(102, 126, 234, 0.1)",
            },
          }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </Button>
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "16px",
            width: "200px",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(102, 126, 234, 0.15)",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.2)",
            padding: "8px",
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 100,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              type={activeTab === tab.key ? "primary" : "ghost"}
              size="small"
              onClick={() => handleTabClick(tab.key)}
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                border:
                  activeTab === tab.key
                    ? "none"
                    : "1px solid rgba(102, 126, 234, 0.3)",
                width: "100%",
                textAlign: "left",
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: activeTab === tab.key ? "white" : "#333",
                transition: "all 0.2s ease",
                ":hover": {
                  background:
                    activeTab === tab.key
                      ? "linear-gradient(135deg, #5a6de8 0%, #6a3f9f 100%)"
                      : "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              <span>{tab.icon}</span>
              {tab.label.replace(/^\S+\s*/, "")}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

// Reused components
const Button = ({
  children,
  onClick,
  style,
  type = "default",
  size = "medium",
  ...props
}) => (
  <button
    onClick={onClick}
    style={{
      padding:
        size === "large"
          ? "16px 32px"
          : size === "small"
          ? "8px 16px"
          : "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: size === "large" ? "18px" : size === "small" ? "14px" : "16px",
      fontWeight: "500",
      cursor: "pointer",
      background:
        type === "primary"
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : type === "ghost"
          ? "transparent"
          : "#f5f5f5",
      color:
        type === "primary" ? "white" : type === "ghost" ? "#667eea" : "#333",
      border: type === "ghost" ? "1px solid #667eea" : "none",
      transition: "all 0.3s ease",
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, style, onClick, ...props }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "primary", style }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      background:
        color === "primary"
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : color === "success"
          ? "#10b981"
          : color === "warning"
          ? "#f59e0b"
          : "#ef4444",
      color: "white",
      ...style,
    }}
  >
    {children}
  </span>
);

const QuizSection = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <ContentUpload />;
      case "take":
        return <TakeQuiz />;
      case "leaderboard":
        return <Leaderboards />;
      case "browse":
        return <BrowseContent />;
      default:
        return (
          <div style={{ padding: "20px" }}>
            {/* Welcome Header */}
            <Card>
              <h1
                style={{
                  margin: "0 0 16px 0",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "36px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                🧠 Quiz Hub
              </h1>
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  margin: 0,
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                Create engaging quizzes, challenge yourself, and compete with
                others
              </p>
            </Card>

            {/* Quick Stats */}
            <Card>
              <h3
                style={{
                  margin: "0 0 20px 0",
                  color: "#333",
                  fontSize: "20px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📊 Your Stats
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    📝
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    12
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Quizzes Taken
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    🎯
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f59e0b",
                    }}
                  >
                    87%
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Avg Score
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    🏆
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#8b5cf6",
                    }}
                  >
                    156
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Rank</div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ef4444",
                    }}
                  >
                    5
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Streak</div>
                </div>
              </div>
            </Card>

            {/* Feature Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <Card
                onClick={() => setActiveTab("create")}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  cursor: "pointer",
                  transform: "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 48px rgba(102, 126, 234, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(102, 126, 234, 0.1)";
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ✨
                  </div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: "#333",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Create Quiz
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      margin: "0 0 16px 0",
                      lineHeight: "1.6",
                    }}
                  >
                    Design custom quizzes with various question types and share
                    them with the community
                  </p>
                  <Button type="primary" size="large">
                    Start Creating
                  </Button>
                </div>
              </Card>

              <Card
                onClick={() => setActiveTab("take")}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                  cursor: "pointer",
                  transform: "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 48px rgba(16, 185, 129, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(102, 126, 234, 0.1)";
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🎮
                  </div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: "#333",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Take Quiz
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      margin: "0 0 16px 0",
                      lineHeight: "1.6",
                    }}
                  >
                    Challenge yourself with quizzes from various categories and
                    difficulty levels
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    style={{ background: "#10b981" }}
                  >
                    Browse Quizzes
                  </Button>
                </div>
              </Card>

              <Card
                onClick={() => setActiveTab("browse")}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                  cursor: "pointer",
                  transform: "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 48px rgba(245, 158, 11, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(102, 126, 234, 0.1)";
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📚
                  </div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: "#333",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Browse Content
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      margin: "0 0 16px 0",
                      lineHeight: "1.6",
                    }}
                  >
                    Explore our vast collection of quizzes across different
                    topics and categories
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    style={{ background: "#f59e0b" }}
                  >
                    Explore Content
                  </Button>
                </div>
              </Card>
            </div>

            {/* Recent Activity & Recommendations */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "20px",
              }}
            >
              <Card>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    color: "#333",
                    fontSize: "20px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📈 Recent Activity
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      action: "Completed",
                      quiz: "JavaScript Fundamentals",
                      score: "92%",
                      time: "2 hours ago",
                      icon: "✅",
                    },
                    {
                      action: "Started",
                      quiz: "World History Quiz",
                      score: "In Progress",
                      time: "1 day ago",
                      icon: "🚀",
                    },
                    {
                      action: "Created",
                      quiz: "React Components",
                      score: "5 questions",
                      time: "3 days ago",
                      icon: "✨",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "rgba(102, 126, 234, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <div style={{ fontSize: "20px" }}>{activity.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "500",
                          }}
                        >
                          {activity.action} "{activity.quiz}"
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {activity.score} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    color: "#333",
                    fontSize: "20px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💡 Recommended for You
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      title: "Advanced CSS Techniques",
                      category: "Technology",
                      difficulty: "Hard",
                      participants: 234,
                    },
                    {
                      title: "Ancient Civilizations",
                      category: "History",
                      difficulty: "Medium",
                      participants: 456,
                    },
                    {
                      title: "Data Structures",
                      category: "Computer Science",
                      difficulty: "Hard",
                      participants: 189,
                    },
                  ].map((quiz, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        background: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "12px",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(102, 126, 234, 0.05)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.8)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          color: "#333",
                          fontSize: "16px",
                        }}
                      >
                        {quiz.title}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Badge color="primary" style={{ fontSize: "10px" }}>
                            {quiz.category}
                          </Badge>
                          <Badge
                            color={
                              quiz.difficulty === "Hard"
                                ? "error"
                                : quiz.difficulty === "Medium"
                                ? "warning"
                                : "success"
                            }
                            style={{ fontSize: "10px" }}
                          >
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          👥 {quiz.participants}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  color: "#333",
                  fontSize: "20px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🚀 Quick Actions
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="ghost"
                  onClick={() => setActiveTab("leaderboard")}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  🏆 View Leaderboard
                </Button>
                <Button
                  type="ghost"
                  onClick={() => setActiveTab("browse")}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  📚 Browse Content
                </Button>
                <Button
                  type="ghost"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  📊 My Performance
                </Button>
                <Button
                  type="ghost"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  🎁 Daily Challenge
                </Button>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Dropdown Navigation */}
      <DropdownNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{renderContent()}</div>
    </div>
  );
};

export default QuizSection;
