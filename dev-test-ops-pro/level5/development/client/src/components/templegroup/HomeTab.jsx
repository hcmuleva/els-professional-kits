import React, { useState, useEffect } from "react";
import { Card, Avatar, Badge, PullToRefresh, Toast } from "antd-mobile";
import {
  TrophyOutline,
  HeartOutline,
  StarOutline,
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  VideoOutline,
} from "antd-mobile-icons";
import { TrophyOutlined } from "@ant-design/icons";
import { getActivitiesByOrg } from "../../services/activity";

const HomeTab = ({ groupInfo }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLatestActivities = async () => {
    try {
      setLoading(true);
      const res = await getActivitiesByOrg(groupInfo.id, 1, 2);
      console.log("Fetched activities:", res.data);
      const activitiesData = res.data || [];
      const transformed = activitiesData.map(transformActivity);
      setLatestActivities(transformed);
    } catch (err) {
      console.error("Failed to load latest activities:", err);
      Toast.show({ content: "Failed to load activities", position: "center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatestActivities();
  }, [groupInfo.id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const transformActivity = (item) => {
    const {
      id,
      title,
      subtitle,
      createdAt,
      category,
      youtubeurl,
      singlemedia,
      multimedia,
      likes = 0,
      user: rawUser,
    } = item;

    // Build user object, handling missing or incomplete user data
    const user =
      rawUser && typeof rawUser === "object"
        ? {
            id: rawUser.id || "",
            first_name: rawUser.first_name || "",
            last_name: rawUser.last_name || "",
            avatar: rawUser.avatar || { url: "/default-avatar.png" },
            userrole: rawUser.userrole || "MEMBER",
            userstatus: rawUser.userstatus || "APPROVED",
          }
        : {
            id: rawUser || "",
            first_name: "",
            last_name: "",
            avatar: { url: "/default-avatar.png" },
            userrole: "MEMBER",
            userstatus: "APPROVED",
          };

    const userData = {
      name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown User",
      role: getUserRole(user),
      avatar: user.avatar?.url || "/default-avatar.png",
    };

    // Determine media
    let media = null;
    if (youtubeurl) {
      const vid = getYouTubeVideoId(youtubeurl);
      if (vid) media = { type: "youtube", videoId: vid, url: youtubeurl };
    }
    if (!media && singlemedia?.url) {
      media = { type: "image", url: singlemedia.url };
    }
    if (!media && Array.isArray(multimedia) && multimedia.length) {
      media = { type: "image", url: multimedia[0].url };
    }

    return {
      id,
      type: category.toLowerCase(),
      title,
      content: subtitle,
      action: getActionText(category),
      time: getTimeAgo(createdAt),
      user: userData,
      media,
    };
  };

  const getUserRole = (user) => {
    if (!user) return "Member";
    return user.userrole === "ADMIN"
      ? "Admin"
      : user.userstatus === "APPROVED"
      ? "Member"
      : "Volunteer";
  };

  const getActionText = (type) => {
    const actionMap = {
      ANNOUNCEMENT: "made an announcement",
      EVENT: "created an event",
      PRAYER: "shared a prayer",
      DONATION: "made a donation",
      JOIN: "joined the community",
      CELEBRATION: "shared a celebration",
      SERVICE: "organized a service",
      EDUCATION: "shared educational content",
    };
    return actionMap[type] || "shared an update";
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return activityTime.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "prayer":
        return <StarOutline style={{ color: "#ff9a9e" }} />;
      case "join":
        return <TeamOutline style={{ color: "#4ecdc4" }} />;
      case "photo":
      case "image":
        return <HeartOutline style={{ color: "#ffbe0b" }} />;
      case "event":
        return <CalendarOutline style={{ color: "#8338ec" }} />;
      case "education":
        return <VideoOutline style={{ color: "#3a86ff" }} />;
      case "announcement":
        return <HeartOutline style={{ color: "#ffbe0b" }} />;
      case "donation":
        return <HeartOutline style={{ color: "#4ecdc4" }} />;
      case "celebration":
        return <StarOutline style={{ color: "#ff6b9d" }} />;
      case "service":
        return <HeartOutline style={{ color: "#4ecdc4" }} />;
      default:
        return <ClockCircleOutline style={{ color: "#6c757d" }} />;
    }
  };

  const renderMedia = (media, title) => {
    if (!media) return null;

    if (media.type === "youtube") {
      return (
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            marginTop: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${media.videoId}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <VideoOutline style={{ fontSize: "12px" }} />
            YouTube
          </div>
        </div>
      );
    }

    if (media.type === "image") {
      return (
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            marginTop: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={media.url}
            alt={title}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              console.error("Image failed to load:", media.url);
              e.target.style.display = "none";
            }}
          />
        </div>
      );
    }

    return null;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLatestActivities();
    setRefreshing(false);
  };

  // Mock data for top groups
  const topGroups = [
    {
      id: 1,
      name: "Daily Prayers",
      members: 456,
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60&h=60&fit=crop",
      color: "#ff9a9e",
    },
    {
      id: 2,
      name: "Bhajan Group",
      members: 234,
      image:
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=60&h=60&fit=crop",
      color: "#a8edea",
    },
    {
      id: 3,
      name: "Youth Committee",
      members: 189,
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=60&fit=crop",
      color: "#ffd89b",
    },
  ];

  return (
    <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <div style={{ padding: "8px" }}>
        {/* Welcome Section */}
        <Card
          style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "#fff",
            marginBottom: "8px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div style={{ padding: "12px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
              🙏 Welcome to {groupInfo.name}
            </h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "12px" }}>
              Join us in our spiritual journey and community activities
            </p>
          </div>
        </Card>

        {/* Top Groups Section */}
        <Card
          style={{
            borderRadius: "12px",
            background: "#fff",
            border: "none",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
            marginBottom: "8px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div style={{ padding: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <TrophyOutlined
                style={{
                  fontSize: "18px",
                  color: "#ff9a9e",
                  marginRight: "6px",
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                Top Groups
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {topGroups.map((group, index) => (
                <div
                  key={group.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${group.color}20, ${group.color}10)`,
                    border: `1px solid ${group.color}30`,
                  }}
                >
                  <Badge
                    content={index + 1}
                    style={{
                      "--right": "-6px",
                      "--top": "-6px",
                      "--badge-color": group.color,
                    }}
                  >
                    <Avatar
                      src={group.image}
                      style={{
                        "--size": "40px",
                        border: `2px solid ${group.color}40`,
                      }}
                    />
                  </Badge>
                  <div
                    style={{
                      marginLeft: "12px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                        fontSize: "13px",
                      }}
                    >
                      {group.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#7f8c8d",
                        marginTop: "2px",
                      }}
                    >
                      {group.members} members
                    </div>
                  </div>
                  <div
                    style={{
                      background: group.color,
                      color: "#fff",
                      padding: "3px 6px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </PullToRefresh>
  );
};

export default HomeTab;
