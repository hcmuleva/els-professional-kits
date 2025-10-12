import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Card,
  Avatar,
  InfiniteScroll,
  PullToRefresh,
  Button,
  Divider,
  FloatingBubble,
  Toast,
  ImageViewer,
} from "antd-mobile";
import {
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  StarOutline,
  HeartOutline,
  MessageOutline,
  MoreOutline,
  AddOutline,
  VideoOutline,
  HeartFill,
} from "antd-mobile-icons";
import { ShareAltOutlined } from "@ant-design/icons";
import {
  getActivitiesByOrg,
  toggleActivityLike,
  getActivityLikeStatus,
} from "../../services/activity";
import { ActivityUpload } from "./ActivityUpload";
import ably from "../../utils/ablyClient";
import { AuthContext } from "../../contexts/AuthContext";

const ActivityTab = ({ orgId, currentUserId }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [likeStates, setLikeStates] = useState({}); // Track like states for activities

  const pageSize = 10;

  // Real-time updates handler for like updates
  const handleLikeUpdate = useCallback(
    (message) => {
      const { activityId, likeCount, isLiked, userId } = message.data;

      // Update activities with new like count
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityId
            ? { ...activity, likes: likeCount }
            : activity
        )
      );

      // Update like states - only update isLiked for the current user
      setLikeStates((prev) => ({
        ...prev,
        [activityId]: {
          ...prev[activityId],
          likeCount,
          isLiked:
            userId === currentUserId
              ? isLiked
              : prev[activityId]?.isLiked || false,
          isLoading: false,
        },
      }));
    },
    [currentUserId]
  );

  // Subscribe to Ably channel for organization activity updates
  useEffect(() => {
    if (!orgId) return;

    const channel = ably.channels.get(`org-${orgId}-activities`);

    channel.subscribe("activity-like-update", handleLikeUpdate);

    return () => {
      channel.unsubscribe("activity-like-update", handleLikeUpdate);
    };
  }, [orgId, handleLikeUpdate]);

  useEffect(() => {
    loadActivities();
  }, []);

  // Load like statuses for all activities
  const loadLikeStatuses = async (activityIds) => {
    if (!currentUserId || activityIds.length === 0) {
      console.warn(
        "No user authenticated or no activity IDs, skipping like status load"
      );
      return;
    }

    try {
      const likeStatusPromises = activityIds.map((id) =>
        getActivityLikeStatus(id).catch((err) => {
          // Suppress errors for unauthenticated or not found cases
          if (
            err.message.includes("User must be authenticated") ||
            err.message.includes("Activity not found")
          ) {
            return { activityId: id, likeCount: 0, isLiked: false };
          }
          console.error(`Failed to load like status for activity ${id}:`, err);
          return { activityId: id, likeCount: 0, isLiked: false };
        })
      );

      const likeStatuses = await Promise.all(likeStatusPromises);

      const newLikeStates = {};
      likeStatuses.forEach((status) => {
        newLikeStates[status.activityId] = {
          likeCount: status.likeCount,
          isLiked: status.isLiked,
          isLoading: false,
        };
      });

      setLikeStates((prev) => ({
        ...prev,
        ...newLikeStates,
      }));
    } catch (error) {
      console.error("Error loading like statuses:", error);
    }
  };

  const loadActivities = async (requestedPage = 1) => {
    try {
      setLoading(true);
      const res = await getActivitiesByOrg(orgId, requestedPage, pageSize);
      const activitiesData = res.data || [];
      const transformed = activitiesData.map(transformActivity);

      setActivities((prev) =>
        requestedPage === 1 ? transformed : [...prev, ...transformed]
      );

      // Load like statuses for new activities
      const activityIds = transformed.map((activity) => activity.id);
      await loadLikeStatuses(activityIds);

      const { pageCount } = res.meta.pagination;
      setHasMore(requestedPage < pageCount);
      setPage(requestedPage);
    } catch (err) {
      console.error("Failed to load activities:", err);
      Toast.show({ content: "Failed to load activities", position: "center" });
    } finally {
      setLoading(false);
    }
  };

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

    const organization = item.org?.name || "";

    let media = null;
    let mediaImages = [];

    if (youtubeurl) {
      const vid = getYouTubeVideoId(youtubeurl);
      if (vid) media = { type: "youtube", videoId: vid, url: youtubeurl };
    }
    if (!media && singlemedia?.url) {
      media = { type: "image", url: singlemedia.url };
      mediaImages = [singlemedia.url];
    }
    if (!media && Array.isArray(multimedia) && multimedia.length) {
      media = { type: "images", urls: multimedia.map((m) => m.url) };
      mediaImages = multimedia.map((m) => m.url);
    }

    return {
      id,
      type: category.toLowerCase(),
      title,
      content: subtitle,
      action: getActionText(category),
      timeAgo: getTimeAgo(createdAt),
      organization,
      user: userData,
      media,
      mediaImages,
      likes,
      comments: item.comments || 0,
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
    const iconStyle = { fontSize: "18px", marginRight: "8px" };
    switch (type) {
      case "event":
        return <CalendarOutline style={{ ...iconStyle, color: "#8338ec" }} />;
      case "prayer":
        return <StarOutline style={{ ...iconStyle, color: "#ff9a9e" }} />;
      case "donation":
        return <HeartOutline style={{ ...iconStyle, color: "#4ecdc4" }} />;
      case "announcement":
        return <MessageOutline style={{ ...iconStyle, color: "#ffbe0b" }} />;
      case "join":
        return <TeamOutline style={{ ...iconStyle, color: "#06d6a0" }} />;
      case "celebration":
        return <StarOutline style={{ ...iconStyle, color: "#ff6b9d" }} />;
      case "service":
        return <HeartOutline style={{ ...iconStyle, color: "#4ecdc4" }} />;
      case "education":
        return <VideoOutline style={{ ...iconStyle, color: "#3a86ff" }} />;
      default:
        return (
          <ClockCircleOutline style={{ ...iconStyle, color: "#6c757d" }} />
        );
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "#ff6b6b";
      case "Volunteer":
        return "#4ecdc4";
      case "Member":
        return "#95e1d3";
      default:
        return "#b8bcc0";
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities(1);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (hasMore && !loading) {
      await loadActivities(page + 1);
    }
  };

  const handleActivitySaved = (newActivity) => {
    const transformedActivity = transformActivity(newActivity);
    setActivities([transformedActivity, ...activities]);
    setShowUpload(false);
    Toast.show({
      content: "Activity posted successfully!",
      position: "center",
    });
  };

  // Handle like button click with optimistic updates
  const handleLikeClick = async (activityId) => {
    if (!currentUserId) {
      Toast.show({
        content: "Please login to like activities",
        position: "center",
      });
      return;
    }

    const currentState = likeStates[activityId] || {
      likeCount: 0,
      isLiked: false,
      isLoading: false,
    };

    if (currentState.isLoading) return;

    const wasLiked = currentState.isLiked;
    const newLikeCount = wasLiked
      ? Math.max(0, currentState.likeCount - 1)
      : currentState.likeCount + 1;

    // Optimistic UI update
    setLikeStates((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        isLoading: true,
        isLiked: !wasLiked,
        likeCount: newLikeCount,
      },
    }));

    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId
          ? { ...activity, likes: newLikeCount }
          : activity
      )
    );

    try {
      const response = await toggleActivityLike(activityId);
      console.log("toggleLike Response:", response); // Debug response

      if (response.success) {
        setLikeStates((prev) => ({
          ...prev,
          [activityId]: {
            ...prev[activityId],
            isLoading: false,
            likeCount: response.data.likeCount,
            isLiked: response.data.isLiked,
          },
        }));

        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === activityId
              ? { ...activity, likes: response.data.likeCount }
              : activity
          )
        );
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);

      // Revert optimistic update
      setLikeStates((prev) => ({
        ...prev,
        [activityId]: {
          ...prev[activityId],
          isLoading: false,
          isLiked: wasLiked,
          likeCount: currentState.likeCount,
        },
      }));

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityId
            ? { ...activity, likes: currentState.likeCount }
            : activity
        )
      );

      Toast.show({
        content: "Failed to update like. Please try again.",
        position: "center",
      });
    }
  };

  // Handle image preview
  const handleImageClick = (images, index = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderMedia = (media, title, mediaImages) => {
    if (!media) return null;

    if (media.type === "youtube") {
      return (
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            marginTop: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
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
              top: "8px",
              right: "8px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <VideoOutline style={{ fontSize: "14px" }} />
            YouTube
          </div>
        </div>
      );
    }

    if (media.type === "image") {
      return (
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            marginTop: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => handleImageClick(mediaImages, 0)}
        >
          <img
            src={media.url}
            alt={title}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.2s ease",
            }}
            onError={(e) => {
              console.error("Image failed to load:", media.url);
              e.target.style.display = "none";
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: 0.8,
            }}
          >
            🔍 Tap to view
          </div>
        </div>
      );
    }

    if (media.type === "images" && media.urls.length > 0) {
      return (
        <div style={{ marginTop: "12px" }}>
          {media.urls.length === 1 ? (
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => handleImageClick(mediaImages, 0)}
            >
              <img
                src={media.urls[0]}
                alt={title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  console.error("Image failed to load:", media.urls[0]);
                  e.target.style.display = "none";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  opacity: 0.8,
                }}
              >
                🔍 Tap to view
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  media.urls.length === 2 ? "1fr 1fr" : "2fr 1fr 1fr",
                gap: "8px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {media.urls.slice(0, 3).map((url, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => handleImageClick(mediaImages, index)}
                >
                  <img
                    src={url}
                    alt={`${title} ${index + 1}`}
                    style={{
                      width: "100%",
                      height:
                        index === 0 && media.urls.length > 2
                          ? "200px"
                          : "100px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", url);
                      e.target.style.display = "none";
                    }}
                  />
                  {index === 2 && media.urls.length > 3 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      +{media.urls.length - 3}
                    </div>
                  )}
                  {index === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        opacity: 0.8,
                      }}
                    >
                      {media.urls.length} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (loading && activities.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Loading activities...
      </div>
    );
  }

  return (
    <>
      <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <div style={{ paddingBottom: "80px" }}>
          <Card
            style={{
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #ff8a65 0%, #ffab40 30%, #ffc947 100%)",
              border: "none",
              color: "#2c3e50",
            }}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              <ClockCircleOutline
                style={{ fontSize: "24px", marginBottom: "8px", color: "#fff" }}
              />
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Community Activities
              </h3>
              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                Stay updated with all temple events and community activities
              </p>
            </div>
          </Card>

          {activities.length === 0 && !loading && (
            <Card
              style={{
                borderRadius: "16px",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <h3 style={{ color: "#666", marginBottom: "8px" }}>
                No Activities Yet
              </h3>
              <p style={{ color: "#999", marginBottom: "20px" }}>
                Be the first to share an activity with the community!
              </p>
              <Button
                color="primary"
                onClick={() => setShowUpload(true)}
                style={{ borderRadius: "12px" }}
              >
                Create First Activity
              </Button>
            </Card>
          )}

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {activities.map((activity) => {
              const likeState = likeStates[activity.id] || {
                likeCount: activity.likes,
                isLiked: false,
                isLoading: false,
              };

              return (
                <Card
                  key={activity.id}
                  style={{
                    borderRadius: "16px",
                    background: "#fff",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Avatar
                        src={activity.user.avatar}
                        style={{
                          "--size": "48px",
                          border: "3px solid #f8f9fa",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <div style={{ marginLeft: "12px", flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#2c3e50",
                              fontSize: "15px",
                            }}
                          >
                            {activity.user.name}
                          </span>
                          <span
                            style={{
                              background: getRoleColor(activity.user.role),
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "bold",
                              marginLeft: "8px",
                              textTransform: "uppercase",
                            }}
                          >
                            {activity.user.role}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                            color: "#7f8c8d",
                          }}
                        >
                          {getActivityIcon(activity.type)}
                          <span style={{ marginRight: "8px" }}>
                            {activity.action}
                          </span>
                          <span>• {activity.timeAgo}</span>
                        </div>
                      </div>
                      <Button
                        fill="none"
                        size="mini"
                        style={{
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        <MoreOutline
                          style={{ fontSize: "16px", color: "#bdc3c7" }}
                        />
                      </Button>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#2c3e50",
                        }}
                      >
                        {activity.title}
                      </h4>
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "14px",
                          color: "#495057",
                          lineHeight: "1.5",
                        }}
                      >
                        {activity.content}
                      </p>

                      {activity.organization && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            background: "#f8f9fa",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            display: "inline-block",
                            marginBottom: "12px",
                          }}
                        >
                          🏛️ {activity.organization}
                        </div>
                      )}

                      {renderMedia(
                        activity.media,
                        activity.title,
                        activity.mediaImages
                      )}
                    </div>

                    <Divider style={{ margin: "16px 0" }} />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "16px" }}>
                        <Button
                          fill="none"
                          size="small"
                          style={{
                            border: "none",
                            background: "transparent",
                            color: likeState.isLiked ? "#e74c3c" : "#7f8c8d",
                            padding: "4px 8px",
                            display: "flex",
                            alignItems: "center",
                            opacity: likeState.isLoading ? 0.6 : 1,
                          }}
                          onClick={() => handleLikeClick(activity.id)}
                          disabled={likeState.isLoading}
                        >
                          {likeState.isLiked ? (
                            <HeartFill
                              style={{ fontSize: "16px", marginRight: "4px" }}
                            />
                          ) : (
                            <HeartOutline
                              style={{ fontSize: "16px", marginRight: "4px" }}
                            />
                          )}
                          {likeState.likeCount}
                        </Button>
                        <Button
                          fill="none"
                          size="small"
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#3498db",
                            padding: "4px 8px",
                          }}
                        >
                          <MessageOutline
                            style={{ fontSize: "16px", marginRight: "4px" }}
                          />
                          {activity.comments}
                        </Button>
                        <Button
                          fill="none"
                          size="small"
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#2ecc71",
                            padding: "4px 8px",
                          }}
                        >
                          <ShareAltOutlined
                            style={{ fontSize: "16px", marginRight: "4px" }}
                          />
                          {activity.shares || 0}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            {hasMore ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#7f8c8d",
                }}
              >
                Loading more activities...
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#bdc3c7",
                }}
              >
                No more activities to show
              </div>
            )}
          </InfiniteScroll>
        </div>
      </PullToRefresh>

      <FloatingBubble
        style={{
          "--initial-position-bottom": "90px",
          "--initial-position-right": "20px",
          "--size": "56px",
          background: "linear-gradient(135deg, #ff8a65 0%, #ffab40 100%)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(255, 138, 101, 0.3)",
        }}
        onClick={() => setShowUpload(true)}
      >
        <AddOutline style={{ fontSize: "24px" }} />
      </FloatingBubble>

      <ImageViewer
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
        image={currentImages}
        defaultIndex={currentImageIndex}
      />

      {showUpload && (
        <ActivityUpload
          onSave={handleActivitySaved}
          onCancel={() => setShowUpload(false)}
          orgId={orgId}
        />
      )}
    </>
  );
};

export default ActivityTab;
