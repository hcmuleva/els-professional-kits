import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { Card, Badge, Spin, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { NavBar } from "antd-mobile";
import { getUserRole } from "../../../services/userrole";

const { Text, Title } = Typography;

export default function AnnouncementController() {
  const navigate = useNavigate();
  const {
    user,
    getNotifications,
    markAsRead,
    totalUnreadCount,
    profileUpdated,
    forceRefreshUser,
  } = useContext(AuthContext);

  const [subcategories, setSubcategories] = useState([]);
  const [categoryNotifications, setCategoryNotifications] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const templeId =
    user?.temples?.length > 0 ? user.temples[0]?.id : user?.temples;

  const cardStyle = {
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const cardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };

  const badgeStyle = {
    backgroundColor: "#ef4444",
  };

  const customBadgeStyle = {
    fontSize: "10px",
    height: "16px",
    minWidth: "16px",
    lineHeight: "16px",
  };

  useEffect(() => {
    const fetchRoles = async () => {
      await forceRefreshUser();
    };
    fetchRoles();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const userrolesdata = await getUserRole(); // make sure this API call is already populating temple & subcategory
      const userroles = userrolesdata?.userroles || [];
      console.log("📢 Controller: User roles:", userroles);

      const formattedSubcategories = userroles
        .filter(
          (role) => role?.temple?.id === templeId && role?.subcategory?.id // temple match + subcategory exists
        )
        .map((role) => ({
          id: role.subcategory.id,
          name: role.subcategory.name || "Uncategorized",
          name_hi:
            role.subcategory.name_hi ||
            role.subcategory.name ||
            "Uncategorized",
          icon: role.subcategory.icon || "🏷️",
          templeid: role.temple.id,
        }));

      console.log(
        "📢 Controller: Formatted subcategories:",
        formattedSubcategories
      );
      setSubcategories(formattedSubcategories);
    } catch (error) {
      console.error("📢 Controller: Error processing user roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = () => {
    const notifications = {};
    let totalUnread = 0;
    subcategories.forEach(({ id: subcategoryId }) => {
      const notifs = getNotifications(subcategoryId);
      console.log(
        `📢 Controller: Fetched notifications for subcategory ${subcategoryId}:`,
        notifs
      );
      notifications[subcategoryId] = notifs;
      totalUnread += notifs.filter((notif) => !notif.read).length;
    });

    setCategoryNotifications(notifications);
    console.log("📢 Controller: Total unread notifications:", totalUnread);
  };

  useEffect(() => {
    if (user?.temples?.length) {
      fetchSubcategories();
    }
  }, [user.temples, user.userroles, profileUpdated]);

  useEffect(() => {
    if (subcategories.length) {
      updateNotifications();
      // …
    }
  }, [subcategories, getNotifications, profileUpdated]);

  useEffect(() => {
    if (subcategories.length > 0) {
      updateNotifications();

      const handleStorageChange = () => {
        console.log("📢 Controller: Storage changed, updating notifications");
        updateNotifications();
      };

      // This catches changes from other tabs
      window.addEventListener("storage", handleStorageChange);

      // This catches changes in the same tab (using a custom event)
      const handleLocalUpdate = () => {
        console.log("📢 Controller: Local update, updating notifications");
        updateNotifications();
      };
      window.addEventListener("localNotificationsUpdate", handleLocalUpdate);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener(
          "localNotificationsUpdate",
          handleLocalUpdate
        );
        console.log("📢 Controller: Cleaned up storage & local listeners");
      };
    }
  }, [subcategories, getNotifications]);

  const handleCardClick = (subcategoryId) => {
    console.log(
      "📢 Controller: Navigating to announcements for subcategory:",
      subcategoryId
    );
    navigate(`/userannouncements/${templeId}/${subcategoryId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "24px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <NavBar
        onBack={() => navigate(-1)}
        style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Badge
            content={totalUnreadCount > 0 ? totalUnreadCount : null}
            style={{ "--color": totalUnreadCount > 0 ? "#ef4444" : "#3b82f6" }}
          >
            <MessageOutlined style={{ fontSize: 18, color: "#0284c7" }} />
          </Badge>
          <span style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
            Announcements
          </span>
        </div>
      </NavBar>

      {subcategories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            color: "#6b7280",
          }}
        >
          No categories available
        </div>
      ) : (
        subcategories.map(
          ({ id: subcategoryId, name, name_hi, icon, templeid }) => {
            const notifications = categoryNotifications[subcategoryId] || [];
            const unreadCount = notifications.filter(
              (notif) => !notif.read
            ).length;
            const latestMessage = notifications[0];

            console.log(
              `📢 Controller: Rendering card for subcategory ${subcategoryId}, unreadCount: ${unreadCount}, latestMessage:`,
              latestMessage
            );

            return (
              <Card
                key={subcategoryId}
                style={{
                  ...cardStyle,
                  ...(hoveredCard === subcategoryId ? cardHoverStyle : {}),
                }}
                onClick={() => handleCardClick(subcategoryId)}
                onMouseEnter={() => setHoveredCard(subcategoryId)}
                onMouseLeave={() => setHoveredCard(null)}
                styles={{ body: { padding: 0 } }}
              >
                <div style={{ padding: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{icon}</span>
                      <Text
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {name_hi || name || "Uncategorized"}
                      </Text>
                    </div>
                    <Badge
                      count={unreadCount > 0 ? unreadCount : null}
                      style={{ backgroundColor: "#ef4444" }}
                      styles={{ indicator: customBadgeStyle }}
                    >
                      <MessageOutlined
                        style={{
                          fontSize: "18px",
                          color: unreadCount > 0 ? "#ef4444" : "#3b82f6",
                        }}
                      />
                    </Badge>
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#4b5563",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {latestMessage ? (
                      <>
                        <Text
                          style={{
                            fontWeight: "500",
                            color: unreadCount > 0 ? "#1f2937" : "#6b7280",
                          }}
                        >
                          Latest Update:
                        </Text>
                        <Text
                          style={{
                            marginLeft: "4px",
                            color: unreadCount > 0 ? "#1f2937" : "#6b7280",
                          }}
                          ellipsis
                        >
                          {latestMessage.title ||
                            latestMessage.content ||
                            "No title"}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#9ca3af" }}>
                        No recent announcements
                      </Text>
                    )}
                  </div>

                  <Text style={{ fontSize: "11px", color: "#6b7280" }}>
                    Temple ID: {templeid || "N/A"}
                  </Text>
                </div>
              </Card>
            );
          }
        )
      )}
    </div>
  );
}
