import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Card,
  Avatar,
  InfiniteScroll,
  PullToRefresh,
  Button,
  Divider,
  Toast,
  ImageViewer,
  Selector,
  SpinLoading,
  FloatingBubble,
  Collapse,
  NavBar,
} from "antd-mobile";
import {
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  StarOutline,
  HeartOutline,
  MessageOutline,
  MoreOutline,
  VideoOutline,
  HeartFill,
  AddOutline,
} from "antd-mobile-icons";
import { ShareAltOutlined } from "@ant-design/icons";
import ably from "../../../utils/ablyClient";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  getActivitiesByOrg,
  getActivityLikeStatus,
  toggleActivityLike,
} from "../../../services/activity";
import { getOrgsList } from "../../../services/org";
import { getAllSubCategories } from "../../../services/subcategory";
import { ActivityUpload } from "../../templegroup/ActivityUpload";

export default function ActivityView() {
  const { templeId } = useParams();
  const [orgId, setOrgId] = useState(null);
  const [orgsList, setOrgsList] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id;
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [likeStates, setLikeStates] = useState({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  const warmColors = {
    primary: "#d2691e",
    secondary: "#daa520",
    accent: "#cd853f",
    background: "#fef7e7",
    cardBg: "#ffffff",
    textPrimary: "#5d4037",
    textSecondary: "#8d6e63",
    border: "#f4e4bc",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
  };

  const pageSize = 10;

  // Fetch organizations list and set default orgId
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const resOrg = await getOrgsList();
        const orgs = resOrg.data || [];
        setOrgsList(orgs);

        console.log(orgs);
        if (orgs.length > 0) {
          const initialOrgId = parseInt(orgs[0].id, 10);
          setOrgId(initialOrgId);
          setSelectedOrg(initialOrgId.toString());
          await loadActivities(1, initialOrgId);
        }
      } catch (err) {
        console.error("Failed to load temples:", err);
        Toast.show({
          content: "Failed to load temples",
          position: "center",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  // Fetch subcategories when orgId changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!orgId) {
        setSubcategories([]);
        setSelectedSubcategory(null);
        return;
      }
      try {
        setSubcategoryLoading(true);
        const filters = { templeId: orgId };
        const res = await getAllSubCategories(filters);
        const subcats = res.data.map((subcat) => ({
          id: subcat.id,
          name: `${subcat.attributes.name_hi}(${subcat.attributes.name})`,
          icon: subcat.attributes.icon || "🏷️",
        }));
        setSubcategories(subcats);
        setSelectedSubcategory(null);
      } catch (err) {
        console.error("Failed to load subcategories:", err);
        Toast.show({
          content: "Failed to load subcategories",
          position: "center",
        });
        setSubcategories([]);
      } finally {
        setSubcategoryLoading(false);
      }
    };
    fetchSubcategories();
  }, [orgId]);

  // Handle temple selection
  const handleOrgSelect = async (value) => {
    try {
      const newOrgId =
        value && value.length > 0 ? parseInt(value[0], 10) : null;
      const selectedOrg = orgsList.find(
        (org) => parseInt(org.id, 10) === newOrgId
      );
      const orgName = selectedOrg
        ? selectedOrg.attributes.name || `Temple ${selectedOrg.id}`
        : "";
      setSelectedOrg(newOrgId ? newOrgId.toString() : null);
      if (newOrgId === orgId) return;
      setOrgId(newOrgId);
      setActivities([]);
      setPage(1);
      setHasMore(true);
      setLikeStates({});
      setSelectedSubcategory(null);
      if (newOrgId) {
        setLoading(true);
        await loadActivities(1, newOrgId);
      }
    } catch (error) {
      console.error("Error selecting temple:", error);
      Toast.show({
        content: "Failed to load activities for selected temple",
        position: "center",
      });
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = async (value) => {
    try {
      const newSubcategoryId =
        value && value.length > 0 ? parseInt(value[0], 10) : null;
      const selectedSubcat = subcategories.find(
        (subcat) => subcat.id === newSubcategoryId
      );
      const subcategoryName = selectedSubcat
        ? selectedSubcat.name
        : "All Subcategories";
      setSelectedSubcategory(newSubcategoryId);
      setActivities([]);
      setPage(1);
      setHasMore(true);
      setLikeStates({});
      if (orgId) {
        setLoading(true);
        await loadActivities(1, orgId, newSubcategoryId);
      }
    } catch (error) {
      console.error("Error selecting subcategory:", error);
      Toast.show({
        content: "Failed to load activities for selected subcategory",
        position: "center",
      });
    }
  };

  // Real-time updates handler for like updates
  const handleLikeUpdate = useCallback(
    (message) => {
      const { activityId, likeCount, isLiked, userId } = message.data;
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityId
            ? { ...activity, likes: likeCount }
            : activity
        )
      );
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

  // Subscribe to Ably channel for temple activity updates
  useEffect(() => {
    if (!orgId) return;
    const channel = ably.channels.get(`org-${orgId}-activities`);
    channel.subscribe("activity-like-update", handleLikeUpdate);
    return () => {
      channel.unsubscribe("activity-like-update", handleLikeUpdate);
    };
  }, [orgId, handleLikeUpdate]);

  // Load activities
  const loadActivities = async (
    requestedPage = 1,
    targetOrgId = orgId,
    subcategoryId = selectedSubcategory
  ) => {
    if (!targetOrgId) return;
    try {
      setLoading(true);
      const filters = subcategoryId
        ? { subcategory: { id: { $eq: subcategoryId } } }
        : undefined;
      const res = await getActivitiesByOrg(
        targetOrgId,
        requestedPage,
        pageSize,
        filters
      );
      if (res.error) {
        throw new Error(
          res.error.message ||
            `HTTP ${res.error.status}: Failed to fetch activities`
        );
      }
      const activitiesData = res.data || [];
      const transformed = activitiesData.map(transformActivity);
      setActivities((prev) =>
        requestedPage === 1 ? transformed : [...prev, ...transformed]
      );
      const activityIds = transformed.map((activity) => activity.id);
      if (activityIds.length > 0) {
        await loadLikeStatuses(activityIds);
      }
      const { pageCount } = res.meta?.pagination || { pageCount: 1 };
      setHasMore(requestedPage < pageCount);
      setPage(requestedPage);
    } catch (err) {
      console.error("Failed to load activities:", err);
      Toast.show({
        content: `Error loading activities: ${err.message}`,
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load like statuses
  const loadLikeStatuses = async (activityIds) => {
    if (!currentUserId || activityIds.length === 0) return;
    try {
      const likeStatusPromises = activityIds.map((id) =>
        getActivityLikeStatus(id).catch((err) => ({
          activityId: id,
          likeCount: 0,
          isLiked: false,
        }))
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
      setLikeStates((prev) => ({ ...prev, ...newLikeStates }));
    } catch (error) {
      console.error("Error loading like statuses:", error);
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
      subcategory,
    } = item;
    const user =
      rawUser && typeof rawUser === "object"
        ? {
            id: rawUser.id || "",
            first_name: rawUser.first_name || "",
            last_name: rawUser.last_name || "",
            profilepicture: rawUser.profilePicture || {
              url: "/default-avatar.png",
            },
            userrole: rawUser.userrole || "MEMBER",
            userstatus: rawUser.userstatus || "APPROVED",
          }
        : {
            id: rawUser || "",
            first_name: "",
            last_name: "",
            profilepicture: { url: "/default-avatar.png" },
            userrole: "MEMBER",
            userstatus: "APPROVED",
          };

    const userData = {
      name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown User",
      role: getUserRole(user),
      avatar: user.profilepicture?.url || "/default-avatar.png",
    };
    const organization = item.temple?.name || "";
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
      subcategory: subcategory?.name || "",
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
        return (
          <CalendarOutline
            style={{ ...iconStyle, color: warmColors.primary }}
          />
        );
      case "prayer":
        return (
          <StarOutline style={{ ...iconStyle, color: warmColors.secondary }} />
        );
      case "donation":
        return (
          <HeartOutline style={{ ...iconStyle, color: warmColors.success }} />
        );
      case "announcement":
        return (
          <MessageOutline style={{ ...iconStyle, color: warmColors.warning }} />
        );
      case "join":
        return (
          <TeamOutline style={{ ...iconStyle, color: warmColors.accent }} />
        );
      case "celebration":
        return (
          <StarOutline style={{ ...iconStyle, color: warmColors.primary }} />
        );
      case "service":
        return (
          <HeartOutline style={{ ...iconStyle, color: warmColors.success }} />
        );
      case "education":
        return (
          <VideoOutline style={{ ...iconStyle, color: warmColors.accent }} />
        );
      default:
        return (
          <ClockCircleOutline
            style={{ ...iconStyle, color: warmColors.textSecondary }}
          />
        );
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return warmColors.primary;
      case "Volunteer":
        return warmColors.accent;
      case "Member":
        return warmColors.success;
      default:
        return warmColors.textSecondary;
    }
  };

  const onRefresh = async () => {
    if (!orgId) return;
    setRefreshing(true);
    await loadActivities(1, orgId, selectedSubcategory);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (hasMore && !loading && orgId) {
      await loadActivities(page + 1, orgId, selectedSubcategory);
    }
  };

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

  const handleActivitySaved = (newActivity) => {
    const transformedActivity = transformActivity(newActivity);
    setActivities([transformedActivity, ...activities]);
    setShowUpload(false);
    Toast.show({
      content: "Activity posted successfully!",
      position: "center",
    });
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
            boxShadow: `0 4px 16px rgba(210, 105, 30, 0.1)`,
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
            boxShadow: `0 4px 16px rgba(210, 105, 30, 0.1)`,
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
                boxShadow: `0 4px 16px rgba(210, 105, 30, 0.1)`,
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
                    boxShadow: `0 2px 8px rgba(210, 105, 30, 0.1)`,
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
                        color: "#fff",
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

  const handleImageClick = (images, index = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };
  const orgOptions = orgsList.map((org) => ({
    label: org.attributes.name || `Temple ${org.id}`,
    value: org.id.toString(),
  }));

  const subcategoryOptions = [
    { label: "All Subcategories", value: "null" },
    ...subcategories.map((subcat) => ({
      label: `${subcat.icon} ${subcat.name}`,
      value: subcat.id.toString(),
    })),
  ];

  if (!orgsList.length && loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: warmColors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <SpinLoading color={warmColors.primary} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: warmColors.background,
        padding: "16px",
      }}
    >
      <NavBar
        style={{
          backgroundColor: warmColors.primary,
          color: "white",
          "--adm-color-text": "white",
        }}
        onBack={() => navigate(-1)}
      >
        Temple Activities
      </NavBar>

      {/* Temple Selector */}
      <Card
        style={{
          marginTop: "16px",
          borderRadius: "12px",
          border: `1px solid ${warmColors.border}`,
          boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
          background: warmColors.cardBg,
        }}
      >
        <div style={{ padding: "12px" }}>
          <Selector
            options={orgOptions}
            value={selectedOrg ? [selectedOrg] : []}
            onChange={handleOrgSelect}
            showSearch
            searchPlaceholder="Search temples"
            style={{
              "--border-radius": "8px",
              "--border": `1px solid ${warmColors.border}`,
              "--checked-border": `2px solid ${warmColors.primary}`,
              "--adm-color-primary": warmColors.primary,
            }}
          />
        </div>
      </Card>

      {/* Subcategory Selector (Collapsible) */}
      {orgId && (
        <Collapse
          defaultActiveKey={["subcategory"]} // 👈 set default open panel
          style={{
            marginTop: "12px",
            borderRadius: "12px",
            border: `1px solid ${warmColors.border}`,
            boxShadow: `0 4px 16px rgba(210, 105, 30, 0.1)`,
            background: warmColors.cardBg,
          }}
        >
          <Collapse.Panel
            key="subcategory"
            title="Select Subcategory"
            style={{
              background: warmColors.cardBg,
              color: warmColors.textPrimary,
              fontWeight: "600",
            }}
          >
            <div style={{ padding: "12px" }}>
              {subcategoryLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    color: warmColors.textSecondary,
                  }}
                >
                  <SpinLoading color={warmColors.accent} />
                </div>
              ) : (
                <Selector
                  options={subcategoryOptions}
                  value={
                    selectedSubcategory
                      ? [selectedSubcategory.toString()]
                      : ["null"]
                  }
                  onChange={handleSubcategorySelect}
                  showSearch
                  searchPlaceholder="Search subcategories"
                  style={{
                    "--border-radius": "8px",
                    "--border": `1px solid ${warmColors.border}`,
                    "--checked-border": `2px solid ${warmColors.accent}`,
                    "--adm-color-primary": warmColors.accent,
                  }}
                />
              )}
            </div>
          </Collapse.Panel>
        </Collapse>
      )}

      <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <div style={{ marginTop: "12px" }}>
          <Card
            style={{
              borderRadius: "12px",
              border: `1px solid ${warmColors.border}`,
              boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
              background: warmColors.cardBg,
            }}
          >
            <div style={{ padding: "16px", textAlign: "center" }}>
              <ClockCircleOutline
                style={{
                  fontSize: "24px",
                  marginBottom: "8px",
                  color: warmColors.primary,
                }}
              />
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: warmColors.textPrimary,
                }}
              >
                Temple Activities
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: warmColors.textSecondary,
                }}
              >
                Stay updated with all temple events and community activities
              </p>
            </div>
          </Card>

          {!orgId && (
            <Card
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
                background: warmColors.cardBg,
                textAlign: "center",
                padding: "40px 20px",
                marginTop: "12px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏛️</div>
              <h3
                style={{
                  color: warmColors.textPrimary,
                  marginBottom: "8px",
                  fontSize: "16px",
                }}
              >
                No Temple Selected
              </h3>
              <p
                style={{
                  color: warmColors.textSecondary,
                  fontSize: "14px",
                }}
              >
                Please select a temple to view activities.
              </p>
            </Card>
          )}

          {orgId && activities.length === 0 && !loading && (
            <Card
              style={{
                borderRadius: "12px",
                border: `1px solid ${warmColors.border}`,
                boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
                background: warmColors.cardBg,
                textAlign: "center",
                padding: "40px 20px",
                marginTop: "12px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <h3
                style={{
                  color: warmColors.textPrimary,
                  marginBottom: "8px",
                  fontSize: "16px",
                }}
              >
                No Activities Yet
              </h3>
              <p
                style={{
                  color: warmColors.textSecondary,
                  fontSize: "14px",
                }}
              >
                No activities found for this temple
                {selectedSubcategory ? ` in the selected subcategory.` : "."}
              </p>
            </Card>
          )}

          {orgId && (
            <div
              style={{
                marginTop: "12px",
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
                      borderRadius: "12px",
                      border: `1px solid ${warmColors.border}`,
                      boxShadow: "0 4px 16px rgba(210, 105, 30, 0.1)",
                      background: warmColors.cardBg,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <Avatar
                          src={activity.user.avatar}
                          style={{
                            "--size": "48px",
                            border: `2px solid ${warmColors.border}`,
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
                                fontWeight: "600",
                                color: warmColors.textPrimary,
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
                              color: warmColors.textSecondary,
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
                            style={{
                              fontSize: "16px",
                              color: warmColors.textSecondary,
                            }}
                          />
                        </Button>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: warmColors.textPrimary,
                          }}
                        >
                          {activity.title}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            color: warmColors.textSecondary,
                            lineHeight: "1.5",
                          }}
                        >
                          {activity.content}
                        </p>

                        {activity.organization && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: warmColors.textSecondary,
                              background: `${warmColors.primary}05`,
                              padding: "6px 10px",
                              borderRadius: "8px",
                              display: "inline-block",
                              marginBottom: "12px",
                            }}
                          >
                            🏛️ {activity.organization}
                          </div>
                        )}

                        {activity.subcategory && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: warmColors.accent,
                              background: `${warmColors.accent}10`,
                              padding: "6px 10px",
                              borderRadius: "8px",
                              display: "inline-block",
                              marginBottom: "12px",
                              marginLeft: "8px",
                            }}
                          >
                            🏷️ {activity.subcategory}
                          </div>
                        )}

                        {renderMedia(
                          activity.media,
                          activity.title,
                          activity.mediaImages
                        )}
                      </div>

                      <Divider
                        style={{
                          margin: "12px 0",
                          borderColor: warmColors.border,
                        }}
                      />

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
                              color: likeState.isLiked
                                ? warmColors.error
                                : warmColors.textSecondary,
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
                              color: warmColors.accent,
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
                              color: warmColors.success,
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
          )}
          {templeId && (
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
          )}

          {orgId && (
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              {hasMore ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: warmColors.textSecondary,
                  }}
                >
                  <SpinLoading color={warmColors.primary} />
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: warmColors.textSecondary,
                  }}
                >
                  No more activities to show
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </PullToRefresh>

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
          subcategories={subcategories}
        />
      )}
    </div>
  );
}
