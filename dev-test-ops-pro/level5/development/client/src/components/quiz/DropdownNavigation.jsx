import React, { useState } from "react";

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
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          type="ghost"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 12px",
            fontSize: "20px",
            border: "1px solid #667eea",
            borderRadius: "8px",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </Button>
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            padding: "16px",
            margin: "8px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 100,
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              type={activeTab === tab.key ? "primary" : "ghost"}
              onClick={() => handleTabClick(tab.key)}
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                border: activeTab === tab.key ? "none" : "1px solid #667eea",
                width: "100%",
                textAlign: "left",
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownNavigation;
