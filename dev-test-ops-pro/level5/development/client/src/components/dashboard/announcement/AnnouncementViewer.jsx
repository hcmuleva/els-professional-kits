import {
  Card,
  Tag,
  Toast,
  Badge,
  Button,
  InfiniteScroll,
  NavBar,
} from "antd-mobile";
import {
  BellOutline,
  CalendarOutline,
  LocationOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { MessageOutlined } from "@ant-design/icons";
import { fetchAnnouncementsByTemple } from "../../../services/announcement";

// === Priority Helpers ===
const getPriorityColor = (type) => {
  const urgent = ["Urgent Alert", "Emergency Notification", "Weather Alert"];
  const important = ["Important Notice", "Policy Update", "System Maintenance"];
  return urgent.includes(type)
    ? "#ef4444"
    : important.includes(type)
    ? "#f59e0b"
    : "#3b82f6";
};
const getPriorityLabel = (type) => {
  const urgent = ["Urgent Alert", "Emergency Notification", "Weather Alert"];
  const important = ["Important Notice", "Policy Update", "System Maintenance"];
  return urgent.includes(type)
    ? "URGENT"
    : important.includes(type)
    ? "IMPORTANT"
    : null;
};

// === Main Component ===
export const AnnouncementsViewer = () => {
  const { templeid, subcategoryid } = useParams();
  const navigate = useNavigate();
  const { markAsRead } = useContext(AuthContext);

  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  });

  // 🔄 Fetch announcements
  const fetchAnnouncements = async (page = 1, pageSize = 10, reset = false) => {
    try {
      const response = await fetchAnnouncementsByTemple(
        templeid,
        subcategoryid,
        {
          page,
          pageSize,
          sort: ["createdAt:desc"],
        }
      );

      const newAnnouncements = response.data || [];
      setAnnouncements((prev) => {
        const updated = reset ? [] : prev;
        const combined = [...updated, ...newAnnouncements].filter(
          (ann, index, self) => self.findIndex((a) => a.id === ann.id) === index
        );
        return combined;
      });

      setPagination({
        page: response.meta?.pagination?.page || page,
        pageSize: response.meta?.pagination?.pageSize || pageSize,
        total: response.meta?.pagination?.total || 0,
        hasMore: page < (response.meta?.pagination?.pageCount || 1),
      });
    } catch (error) {
      console.error("📢 Error fetching announcements:", error);
      Toast.show({
        content: "Failed to fetch announcements",
        icon: "fail",
        duration: 2000,
      });
    }
  };

  // 🧠 Update unread count
  const updateNotifications = () => {
    const stored =
      JSON.parse(localStorage.getItem("categoryNotifications")) || {};
    const notifications = stored[subcategoryid] || [];
    const newUnread = notifications.filter((n) => !n.read).length;
    setUnreadCount(newUnread);
  };

  // ✅ Mark as read + update localStorage
  const markAsReadAndSync = () => {
    const stored =
      JSON.parse(localStorage.getItem("categoryNotifications")) || {};
    if (stored[subcategoryid]) {
      stored[subcategoryid] = stored[subcategoryid].map((n) => ({
        ...n,
        read: true,
      }));
      localStorage.setItem("categoryNotifications", JSON.stringify(stored));
    }
    markAsRead(subcategoryid, true); // Still call context if needed
    updateNotifications(); // Immediately update UI
  };

  useEffect(() => {
    if (!templeid) {
      Toast.show({ content: "Temple ID missing", icon: "fail" });
      return;
    }

    fetchAnnouncements();
    updateNotifications();
    markAsReadAndSync();

    const handleStorageChange = () => {
      updateNotifications();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [templeid, subcategoryid]);

  const loadMore = async () => {
    if (pagination.hasMore) {
      await fetchAnnouncements(pagination.page + 1, pagination.pageSize, false);
    }
  };

  const refreshAnnouncements = () => {
    fetchAnnouncements(1, pagination.pageSize, true);
    markAsReadAndSync();
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <NavBar onBack={() => navigate(-1)} style={{ background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Badge
            content={unreadCount > 0 ? unreadCount : null}
            style={{ "--color": unreadCount > 0 ? "#ef4444" : "#3b82f6" }}
          >
            <MessageOutlined fontSize={18} style={{ color: "#0284c7" }} />
          </Badge>
          <span style={{ fontWeight: 600 }}>Announcements</span>
          {pagination.total > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "2px 6px",
                borderRadius: "10px",
              }}
            >
              {pagination.total}
            </span>
          )}
        </div>
      </NavBar>

      <div style={{ padding: "8px" }}>
        <div style={{ textAlign: "right", marginBottom: "8px" }}>
          <Button
            size="small"
            onClick={refreshAnnouncements}
            style={{
              color: "#3b82f6",
              fontSize: "12px",
              border: "1px solid #e5e5e5",
              background: "#fff",
            }}
          >
            Refresh
          </Button>
        </div>

        {announcements.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e5e5",
              color: "#6b7280",
            }}
          >
            No announcements available
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {announcements.map((announcement) => {
              const attrs = announcement.attributes;
              const color = getPriorityColor(attrs.announcement_type);
              const label = getPriorityLabel(attrs.announcement_type);

              return (
                <Card
                  key={announcement.id}
                  style={{
                    borderLeft: `4px solid ${color}`,
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          margin: 0,
                          marginRight: "8px",
                        }}
                      >
                        {attrs.title || "Untitled"}
                      </h3>
                      {label && (
                        <Tag color={color} style={{ fontSize: "10px" }}>
                          {label}
                        </Tag>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#4b5563",
                        margin: "8px 0",
                      }}
                    >
                      {attrs.description || "No description"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "4px" }}>
                        <CalendarOutline fontSize={11} />
                        <span>{formatDate(attrs.createdAt)}</span>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <LocationOutline fontSize={11} />
                        <span>
                          {attrs.temple?.data?.attributes?.title || "Unknown"}
                        </span>
                      </div>
                      {attrs.subcategory?.data && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <span style={{ fontSize: "11px" }}>
                            {attrs.subcategory.data.attributes.icon || "🏷️"}
                          </span>
                          <span>
                            {attrs.subcategory.data.attributes.name ||
                              attrs.subcategory.data.attributes.name_hi ||
                              "Uncategorized"}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "4px" }}>
                        <UserOutline fontSize={11} />
                        <span>
                          {attrs.user?.data?.attributes?.first_name
                            ? `${attrs.user.data.attributes.first_name} ${attrs.user.data.attributes.last_name}`
                            : attrs.user?.data?.attributes?.username || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            <InfiniteScroll loadMore={loadMore} hasMore={pagination.hasMore}>
              {pagination.hasMore ? (
                <div style={{ textAlign: "center", padding: "12px" }}>
                  Loading more...
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    color: "#9ca3af",
                  }}
                >
                  No more announcements
                </div>
              )}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsViewer;
