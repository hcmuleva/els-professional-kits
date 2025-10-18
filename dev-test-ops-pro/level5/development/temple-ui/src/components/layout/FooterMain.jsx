import {
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Space } from "antd-mobile";

export const FooterMain = ({ activeKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeKey);

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

  // Determine current active tab based on pathname
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/dashboard") {
      setCurrentTab("dashboard");
    } else if (pathname === "/profile") {
      setCurrentTab("profile");
    } else if (pathname === "/superadmin") {
      setCurrentTab("superadmin");
    } else if (pathname === "/admin") {
      setCurrentTab("admin");
    } else {
      setCurrentTab(activeKey);
    }
  }, [location.pathname, activeKey]);

  const footerItems = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined style={{ fontSize: "22px" }} />,
      label: "डैशबोर्ड",
      route: "/dashboard",
    },
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: "22px" }} />,
      label: "प्रोफाइल",
      route: "/profile",
    },
  ];

  // Add admin sections based on user role
  if (user?.userrole === "SUPERADMIN") {
    footerItems.push({
      key: "superadmin",
      label: "SuperAdmin",
      icon: <SettingOutlined style={{ fontSize: "22px" }} />,
      route: "/superadmin",
    });
  } else if (user?.userrole === "ADMIN") {
    footerItems.push({
      key: "admin",
      label: "एडमिन",
      icon: <SettingOutlined style={{ fontSize: "22px" }} />,
      route: "/admin",
    });
  }

  const handleTabClick = (item) => {
    setCurrentTab(item.key);
    navigate(item.route);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100px",
        background: warmColors.cardBg,
        boxShadow: `0 -2px 10px ${warmColors.primary}10`,
        zIndex: 100,
        borderTop: `1px solid ${warmColors.border}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 16px",
        }}
      >
        {footerItems.map((item) => {
          const isActive = currentTab === item.key;

          return (
            <div
              key={item.key}
              onClick={() => handleTabClick(item)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                minWidth: "70px",
              }}
            >
              <div
                style={{
                  color: isActive
                    ? warmColors.primary
                    : warmColors.textSecondary,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isActive ? "600" : "500",
                  marginTop: "4px",
                  textAlign: "center",
                  color: isActive
                    ? warmColors.primary
                    : warmColors.textSecondary,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
