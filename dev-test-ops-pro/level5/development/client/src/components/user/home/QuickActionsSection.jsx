import { Grid } from "antd-mobile";
import {
  EnvironmentOutline,
  StarOutline,
  TeamOutline,
} from "antd-mobile-icons";

export const QuickActionsSection = () => {
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // Replace with your navigation logic
  };

  const quickActions = [
    {
      name: "Alumni List",
      icon: <TeamOutline fontSize={24} />,
      path: "/alumni-list",
      color: "#3b82f6",
      bgColor: "#dbeafe",
    },
    {
      name: "Near Me",
      icon: <EnvironmentOutline fontSize={24} />,
      path: "/near-me",
      color: "#10b981",
      bgColor: "#d1fae5",
    },
    {
      name: "Demo",
      icon: <StarOutline fontSize={24} />,
      path: "/demo",
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
  ];

  return (
    <div style={{ margin: "16px" }}>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#1e40af",
          marginBottom: "16px",
          paddingLeft: "4px",
        }}
      >
        Quick Actions
      </h2>
      <Grid columns={3} gap={12}>
        {quickActions.map((action, index) => (
          <Grid.Item key={index}>
            <div
              onClick={() => handleNavigation(action.path)}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px 12px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                ":hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: action.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  color: action.color,
                }}
              >
                {action.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1f2937",
                  lineHeight: 1.3,
                }}
              >
                {action.name}
              </div>
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
};
